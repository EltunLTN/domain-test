"""
Turbo.az Web Scraper - YENILƏNMIŞ VERSİYA
Bu script turbo.az saytından avtomobil məlumatlarını scrape edir.
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'az-AZ,az;q=0.9',
        }
        self.cars_data = []

    def extract_car_data(self, listing):
        """HTML listing-dən məlumatları çıxarır"""
        try:
            car = {}
            
            # Link-dən məlumat al
            link = listing.find('a', class_='products-i__link')
            if not link:
                return None
            
            # Qiymət - products-i__price
            price_elem = listing.find('div', class_='product-price')
            if not price_elem:
                price_elem = listing.find('span', class_='price')
            
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                # "12,500 ₼" -> 12500
                price_clean = re.sub(r'[^\d]', '', price_text)
                car['price'] = int(price_clean) if price_clean else None
            else:
                return None
            
            # Başlıq və parametrlər - products-i__name
            name_elem = listing.find('div', class_='products-i__name')
            if name_elem:
                title_text = name_elem.get_text(strip=True)
                # "Mercedes-Benz E 200" kimi
                parts = title_text.split(',')[0].strip().split(' ', 1)
                car['brand'] = parts[0] if len(parts) > 0 else 'Unknown'
                car['model'] = parts[1] if len(parts) > 1 else 'Unknown'
            else:
                return None
            
            # Parametrlər - products-i__attributes (il, yürüş, mühərrik)
            attrs = listing.find_all('div', class_='products-i__attributes')
            if attrs:
                attr_text = ' '.join([a.get_text() for a in attrs])
                
                # İl
                year_match = re.search(r'(\d{4})\s*il', attr_text)
                if not year_match:
                    year_match = re.search(r'(\d{4})', attr_text)
                car['year'] = int(year_match.group(1)) if year_match else 2020
                
                # Yürüş (km)
                mileage_match = re.search(r'(\d[\d\s]*)\s*km', attr_text, re.IGNORECASE)
                if mileage_match:
                    mileage_str = re.sub(r'\s', '', mileage_match.group(1))
                    car['mileage'] = int(mileage_str)
                else:
                    car['mileage'] = 50000  # Default
                
                # Mühərrik həcmi
                engine_match = re.search(r'(\d+\.?\d*)\s*L', attr_text, re.IGNORECASE)
                car['engine_size'] = float(engine_match.group(1)) if engine_match else 2.0
            else:
                car['year'] = 2020
                car['mileage'] = 50000
                car['engine_size'] = 2.0
            
            # Şəhər - products-i__bottom
            city_elem = listing.find('div', class_='products-i__bottom')
            if city_elem:
                city_text = city_elem.get_text(strip=True)
                car['city'] = city_text.split(',')[0] if ',' in city_text else 'Bakı'
            else:
                car['city'] = 'Bakı'
            
            # Yanacaq və transmissiya - təxmin
            full_text = listing.get_text().lower()
            car['fuel_type'] = self.guess_fuel_type(full_text)
            car['transmission'] = self.guess_transmission(full_text)
            car['condition'] = 'yaxsi'
            car['owners'] = 1
            car['scraped_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            return car
            
        except Exception as e:
            print(f"⚠️ Məlumat çıxarma xətası: {e}")
            return None

    def guess_fuel_type(self, text):
        """Yanacaq növünü təxmin edir"""
        if 'dizel' in text or 'diesel' in text:
            return 'dizel'
        elif 'hibrid' in text or 'hybrid' in text:
            return 'hibrid'
        elif 'elektrik' in text or 'electric' in text:
            return 'elektrik'
        elif 'qaz' in text:
            return 'qaz'
        return 'benzin'

    def guess_transmission(self, text):
        """Transmissiya növünü təxmin edir"""
        if 'mexaniki' in text or 'manual' in text:
            return 'mexaniki'
        elif 'robot' in text:
            return 'robot'
        elif 'variator' in text:
            return 'variator'
        return 'avtomat'

    def scrape_page(self, page_num):
        """Bir səhifəni scrape edir"""
        print(f"📄 Scraping səhifə {page_num}...")
        
        url = f"{self.base_url}?page={page_num}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Yeni struktur: <div class="products-i vipped featured">
            car_listings = soup.find_all('div', class_='products-i')
            
            if not car_listings:
                # Debug üçün HTML saxla
                with open('turbo_debug.html', 'w', encoding='utf-8') as f:
                    f.write(soup.prettify())
                print("⚠️ Elan tapılmadı. HTML: turbo_debug.html")
                return False
            
            count = 0
            for listing in car_listings:
                car_data = self.extract_car_data(listing)
                if car_data:
                    self.cars_data.append(car_data)
                    count += 1
            
            print(f"✅ Səhifə {page_num}: {count}/{len(car_listings)} elan scrape edildi")
            return count > 0
            
        except Exception as e:
            print(f"❌ Səhifə {page_num} xətası: {e}")
            return False

    def scrape_all(self, max_pages=50):
        """Bütün səhifələri scrape edir"""
        print(f"\n🚗 Turbo.az Scraping Başladı")
        print(f"📊 Maksimum {max_pages} səhifə\n")
        
        for page in range(1, max_pages + 1):
            success = self.scrape_page(page)
            
            if not success and page == 1:
                print("❌ İlk səhifə scrape edilmədi. Dayandırılır.")
                break
            elif not success:
                print(f"⚠️ Səhifə {page} boşdur. Scraping tamamlandı.")
                break
            
            # Rate limiting
            time.sleep(random.uniform(2, 4))
            
            # Hər 10 səhifədə saxla
            if page % 10 == 0:
                self.save_data('car_data_temp.csv')
                print(f"💾 Progress saxlanıldı: {len(self.cars_data)} elan\n")
        
        print(f"\n✅ Scraping tamamlandı!")
        print(f"📊 Toplam: {len(self.cars_data)} avtomobil məlumatı")

    def save_data(self, filename='car_data.csv'):
        """CSV faylına yaz"""
        if not self.cars_data:
            print("⚠️ Saxlanılacaq məlumat yoxdur")
            return
        
        df = pd.DataFrame(self.cars_data)
        df = df.drop_duplicates(subset=['brand', 'model', 'year', 'price'])
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"✅ {len(df)} elan '{filename}' faylına yazıldı")

    def clean_and_prepare_data(self, input_file, output_file):
        """Məlumatları təmizlə və ML üçün hazırla"""
        print("\n🧹 Məlumatlar təmizlənir...")
        
        try:
            df = pd.read_csv(input_file)
        except FileNotFoundError:
            print(f"❌ {input_file} tapılmadı. Scraping edilmiş məlumat yoxdur.")
            return
        
        # Null dəyərləri sil
        df = df.dropna(subset=['price', 'year', 'brand', 'model'])
        
        # Qiymət və il filtrləri
        df = df[df['price'] > 1000]
        df = df[(df['year'] >= 1990) & (df['year'] <= 2026)]
        df = df[df['mileage'] >= 0]
        
        # Outlier-ləri sil
        price_q1 = df['price'].quantile(0.01)
        price_q99 = df['price'].quantile(0.99)
        df = df[(df['price'] >= price_q1) & (df['price'] <= price_q99)]
        
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"✅ {len(df)} təmiz məlumat '{output_file}' faylına yazıldı")


def main():
    """Ana funksiya"""
    scraper = TurboAzScraper()
    
    # 1. Scraping (50 səhifə ~ 1000 elan)
    scraper.scrape_all(max_pages=50)
    
    # 2. İlkin saxla
    if scraper.cars_data:
        scraper.save_data('car_data_raw.csv')
        
        # 3. Təmizlə
        scraper.clean_and_prepare_data('car_data_raw.csv', 'car_data_cleaned.csv')
    else:
        print("\n⚠️ Scraping uğursuz oldu. Sample dataset istifadə edin.")
        print("car_data_sample.csv faylını car_data_cleaned.csv olaraq kopyalayın:")
        print("copy car_data_sample.csv car_data_cleaned.csv")


if __name__ == "__main__":
    main()
