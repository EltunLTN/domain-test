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
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Turbo.az-da maşın kartlarını tap (bu selectorlar turbo.az strukturuna görə dəyişə bilər)
            car_listings = soup.find_all('div', class_='products-i')
            
            if not car_listings:
                print("Maşın elanları tapılmadı. HTML strukturu dəyişmiş ola bilər.")
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
        print("Məlumatlar təmizlənir...")
        
        df = pd.read_csv(input_file)
        
        # Null dəyərləri sil
        df = df.dropna(subset=['price', 'year', 'mileage', 'brand', 'model'])
        
        # Qiymət > 0
        df = df[df['price'] > 0]
        
        # İl aralığı (1990-2026)
        df = df[(df['year'] >= 1990) & (df['year'] <= 2026)]
        
        # Yürüş > 0
        df = df[df['mileage'] >= 0]
        
        # Outlier-ləri sil (qiymət çox yüksək/aşağı)
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
    
    # 1. Scraping et (100 səhifə = təxminən 2000-3000 maşın)
    scraper.scrape_all(max_pages=100)
    
    # 2. İlkin məlumatları saxla
    scraper.save_data('car_data_raw.csv')
    
    # 3. Təmizlə və hazırla
    scraper.clean_and_prepare_data('car_data_raw.csv', 'car_data_cleaned.csv')
    
    print("\n🎉 Bütün əməliyyatlar tamamlandı!")
    print("car_data_cleaned.csv faylı ML model üçün hazırdır")


if __name__ == "__main__":
    main()
