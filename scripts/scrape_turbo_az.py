"""
Turbo.az Web Scraper
Bu script turbo.az saytından avtomobil məlumatlarını scrape edir və CSV faylına yazır.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
from datetime import datetime
import random

class TurboAzScraper:
    def __init__(self):
        self.base_url = "https://turbo.az/autos"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'az-AZ,az;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.cars_data = []

    def clean_price(self, price_text):
        """Qiyməti təmizləyir və rəqəmə çevirir"""
        if not price_text:
            return None
        # "12 500 AZN" -> 12500
        cleaned = re.sub(r'[^\d]', '', price_text)
        return int(cleaned) if cleaned else None

    def clean_number(self, text):
        """Rəqəmləri təmizləyir"""
        if not text:
            return None
        cleaned = re.sub(r'[^\d.]', '', text)
        return float(cleaned) if cleaned else None

    def scrape_page(self, page_num):
        """Bir səhifəni scrape edir"""
        print(f"Scraping səhifə {page_num}...")
        
        url = f"{self.base_url}?page={page_num}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Turbo.az yeni struktur - products class-ları
            # Müxtəlif selector-lar sınayaq
            car_listings = (
                soup.find_all('div', class_='products-i') or
                soup.find_all('div', class_='product-item') or
                soup.find_all('a', class_='products-link') or
                soup.find_all('div', attrs={'data-id': True})
            )
            
            if not car_listings:
                # HTML-i faylda saxlayaq debugging üçün
                with open('turbo_debug.html', 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify()))
                print("⚠️ HTML strukturu faylda: turbo_debug.html")
                print("⚠️ Maşın elanları tapılmadı. Alternativ scraping method istifadə edilir...")
                
                # Alternativ: bütün link-ləri tap
                all_links = soup.find_all('a', href=True)
                car_links = [link for link in all_links if '/autos/' in link.get('href', '')]
                
                if car_links:
                    print(f"✓ {len(car_links)} avtomobil linki tapıldı")
                    for link in car_links[:50]:  # İlk 50-ni götür
                        car_data = self.extract_from_detail_page(link.get('href'))
                        if car_data:
                            self.cars_data.append(car_data)
                    return True if car_links else False
                
                return False
            
            for listing in car_listings:
                car_data = self.extract_car_data(listing)
                if car_data:
                    self.cars_data.append(car_data)
            
            print(f"Səhifə {page_num}: {len(car_listings)} elan scrape edildi")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"Səhifə {page_num} scrape xətası: {e}")
            return False

    def extract_from_detail_page(self, url):
        """Ətraflı səhifədən məlumat çıxarır"""
        try:
            if not url.startswith('http'):
                url = 'https://turbo.az' + url
            
            response = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Sadələşdirilmiş extraction
            car = {}
            
            # Başlıq
            title = soup.find('h1')
            if title:
                title_text = title.text.strip()
                parts = title_text.split(',')[0].split(' ')
                car['brand'] = parts[0] if len(parts) > 0 else None
                car['model'] = ' '.join(parts[1:]) if len(parts) > 1 else None
            
            # Qiymət
            price = soup.find('div', class_='price')
            if price:
                car['price'] = self.clean_price(price.text)
            
            # Parametrlər
            params = soup.find_all('tr')
            for param in params:
                label = param.find('td', class_='label')
                value = param.find('td', class_='value')
                if label and value:
                    label_text = label.text.strip().lower()
                    value_text = value.text.strip()
                    
                    if 'buraxılış' in label_text or 'il' in label_text:
                        car['year'] = self.clean_number(value_text)
                    elif 'yürüş' in label_text:
                        car['mileage'] = self.clean_number(value_text)
                    elif 'mühərrik' in label_text and 'həcmi' in label_text:
                        car['engine_size'] = self.clean_number(value_text)
                    elif 'yanacaq' in label_text:
                        car['fuel_type'] = value_text.lower()
                    elif 'sürətlər' in label_text:
                        car['transmission'] = value_text.lower()
            
            car['scraped_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            return car if car.get('price') else None
            
        except Exception as e:
            return None

    def extract_car_data(self, listing):
        """Bir elan məlumatlarını çıxarır"""
        try:
            car = {}
            
            # Başlıq (Marka Model)
            title_elem = listing.find('div', class_='products-i__name')
            if title_elem:
                title = title_elem.text.strip()
                # "Mercedes-Benz E 200" -> brand: Mercedes-Benz, model: E 200
                parts = title.split(' ', 1)
                car['brand'] = parts[0] if len(parts) > 0 else None
                car['model'] = parts[1] if len(parts) > 1 else None
            else:
                return None
            
            # Qiymət
            price_elem = listing.find('div', class_='product-price')
            if price_elem:
                car['price'] = self.clean_price(price_elem.text)
            else:
                return None  # Qiymətsiz elanları buraxırıq
            
            # Parametrlər (İl, Yürüş, Mühərrik və s.)
            params = listing.find_all('div', class_='products-i__attributes')
            if params:
                param_text = params[0].text if len(params) > 0 else ""
                
                # İl
                year_match = re.search(r'(\d{4})', param_text)
                car['year'] = int(year_match.group(1)) if year_match else None
                
                # Yürüş
                mileage_match = re.search(r'(\d+[\s\d]*)\s*km', param_text, re.IGNORECASE)
                car['mileage'] = self.clean_number(mileage_match.group(1)) if mileage_match else None
                
                # Mühərrik həcmi
                engine_match = re.search(r'(\d+\.?\d*)\s*L', param_text, re.IGNORECASE)
                car['engine_size'] = self.clean_number(engine_match.group(1)) if engine_match else None
            
            # Şəhər
            city_elem = listing.find('div', class_='products-i__bottom-text')
            if city_elem:
                car['city'] = city_elem.text.strip()
            
            # Yanacaq növü, Sürətlər qutusu və digər parametrlər
            # Bu məlumatlar ətraflı səhifədə ola bilər, lakin sadələşdirmə üçün ümumi dəyərlər veririk
            car['fuel_type'] = self.guess_fuel_type(listing.text)
            car['transmission'] = self.guess_transmission(listing.text)
            car['condition'] = 'yaxsi'  # Default
            car['owners'] = 1  # Default
            
            # Yaradılma tarixi
            car['scraped_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            return car
            
        except Exception as e:
            print(f"Məlumat çıxarma xətası: {e}")
            return None

    def guess_fuel_type(self, text):
        """Mətndən yanacaq növünü təxmin edir"""
        text_lower = text.lower()
        if 'dizel' in text_lower or 'diesel' in text_lower:
            return 'dizel'
        elif 'hibrid' in text_lower or 'hybrid' in text_lower:
            return 'hibrid'
        elif 'elektrik' in text_lower or 'electric' in text_lower:
            return 'elektrik'
        elif 'qaz' in text_lower or 'gas' in text_lower:
            return 'qaz'
        else:
            return 'benzin'

    def guess_transmission(self, text):
        """Mətndən sürətlər qutusunu təxmin edir"""
        text_lower = text.lower()
        if 'mexaniki' in text_lower or 'manual' in text_lower:
            return 'mexaniki'
        elif 'robot' in text_lower:
            return 'robot'
        elif 'variator' in text_lower:
            return 'variator'
        else:
            return 'avtomat'

    def scrape_all(self, max_pages=100):
        """Bütün səhifələri scrape edir"""
        print(f"Turbo.az scraping başladı...")
        print(f"Maksimum {max_pages} səhifə scrape ediləcək")
        
        for page in range(1, max_pages + 1):
            success = self.scrape_page(page)
            
            if not success:
                print(f"Səhifə {page}-də problem. Dayandırılır.")
                break
            
            # Rate limiting - saytı yükləməmək üçün
            time.sleep(random.uniform(2, 4))
            
            # Hər 10 səhifədə bir məlumat saxla
            if page % 10 == 0:
                self.save_data()
                print(f"✓ {len(self.cars_data)} məlumat indi saxlanıldı")
        
        print(f"\n✓ Scraping tamamlandı! Cəmi {len(self.cars_data)} avtomobil məlumatı toplandı")

    def save_data(self, filename='car_data.csv'):
        """Məlumatları CSV faylına yazır"""
        if not self.cars_data:
            print("Saxlanılacaq məlumat yoxdur")
            return
        
        df = pd.DataFrame(self.cars_data)
        
        # Dublikatları sil
        df = df.drop_duplicates(subset=['brand', 'model', 'year', 'price', 'mileage'])
        
        # CSV-yə yaz
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"✓ Məlumatlar '{filename}' faylına yazıldı ({len(df)} sətir)")

    def clean_and_prepare_data(self, input_file='car_data.csv', output_file='car_data_cleaned.csv'):
        """Məlumatları təmizləyir və ML üçün hazırlayır"""
        import os
        
        if not os.path.exists(input_file):
            print(f"⚠️ '{input_file}' faylı tapılmadı. Scraping uğursuz oldu.")
            return None
        
        print("Məlumatlar təmizlənir...")
        
        df = pd.read_csv(input_file)
        
        if len(df) == 0:
            print("⚠️ CSV boşdur. Məlumat yoxdur.")
            return None
        
        # Null dəyərləri sil
        df = df.dropna(subset=['price', 'year', 'mileage', 'brand', 'model'])
        
        # Qiymət > 0
        df = df[df['price'] > 0]
        
        # İl aralığı (1990-2026)
        df = df[(df['year'] >= 1990) & (df['year'] <= 2026)]
        
        # Yürüş > 0
        df = df[df['mileage'] >= 0]
        
        # Outlier-ləri sil (qiymət çox yüksək/aşağı)
        if len(df) > 10:
            price_q1 = df['price'].quantile(0.01)
            price_q99 = df['price'].quantile(0.99)
            df = df[(df['price'] >= price_q1) & (df['price'] <= price_q99)]
        
        # Təmizlənmiş datanı saxla
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"✓ Təmizlənmiş məlumatlar '{output_file}' faylına yazıldı ({len(df)} sətir)")
        
        return df


def main():
    """Ana funksiya"""
    scraper = TurboAzScraper()
    
    print("\n⚠️ XƏBƏRDARLIQ: Turbo.az scraping çətin ola bilər (CAPTCHA, anti-bot).")
    print("⚠️ Alternativ: Hazır CSV faylı istifadə edin və ya manual məlumat toplayın.\n")
    
    # 1. Scraping et (10 səhifə test üçün)
    scraper.scrape_all(max_pages=10)
    
    # 2. Əgər məlumat varsa saxla
    if scraper.cars_data:
        scraper.save_data('car_data_raw.csv')
        
        # 3. Təmizlə və hazırla
        scraper.clean_and_prepare_data('car_data_raw.csv', 'car_data_cleaned.csv')
    else:
        print("\n❌ Heç bir məlumat scrape edilmədi!")
        print("\n💡 Alternativ həll:")
        print("1. Hazır CSV faylı istifadə edin")
        print("2. Və ya əllə məlumat toplayın")
        print("3. turbo_debug.html faylını yoxlayın və selector-ları düzəldin")
        return
    
    print("\n🎉 Bütün əməliyyatlar tamamlandı!")
    print("car_data_cleaned.csv faylı ML model üçün hazırdır")


if __name__ == "__main__":
    main()
