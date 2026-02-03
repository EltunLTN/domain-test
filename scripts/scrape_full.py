"""
Turbo.az Advanced Scraper - Real Data Extraction
Bu script 100k+ avtomobil məlumatını scrape edir
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
from datetime import datetime
import random
import json

class TurboAzAdvancedScraper:
    def __init__(self):
        self.base_url = "https://turbo.az/autos"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'az-AZ,az;q=0.9,en;q=0.8',
        }
        self.cars_data = []
        self.failed_pages = []

    def extract_car_data(self, listing):
        """Maşın məlumatlarını çıxarır"""
        try:
            car = {}
            
            # Qiymət - products-i__price
            price_elem = listing.find('div', class_='products-i__price')
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price_clean = re.sub(r'[^\d]', '', price_text)
                car['price'] = int(price_clean) if price_clean and int(price_clean) > 1000 else None
            
            if not car.get('price'):
                return None
            
            # Başlıq - products-i__name
            name_elem = listing.find('div', class_='products-i__name')
            if name_elem:
                # "Mercedes-Benz E 200" və ya "Mercedes-Benz, E 200"
                title_text = name_elem.get_text(strip=True)
                title_clean = title_text.replace(',', ' ')
                parts = title_clean.strip().split(' ', 1)
                car['brand'] = parts[0] if len(parts) > 0 else 'Unknown'
                car['model'] = parts[1].strip() if len(parts) > 1 else 'Unknown'
            else:
                return None
            
            # Parametrlər - products-i__attributes
            full_text = listing.get_text()
            
            # İl
            year_match = re.search(r'(\d{4})', full_text)
            car['year'] = int(year_match.group(1)) if year_match and 1990 <= int(year_match.group(1)) <= 2026 else 2020
            
            # Yürüş
            mileage_match = re.search(r'(\d[\d\s,\.]*)\s*km', full_text, re.IGNORECASE)
            if mileage_match:
                mileage_str = re.sub(r'[^\d]', '', mileage_match.group(1))
                car['mileage'] = int(mileage_str) if mileage_str else 50000
            else:
                car['mileage'] = 50000
            
            # Mühərrik həcmi
            engine_match = re.search(r'(\d+\.?\d*)\s*L', full_text, re.IGNORECASE)
            car['engine_size'] = float(engine_match.group(1)) if engine_match else 2.0
            
            # Şəhər
            city_match = re.search(r'(Bakı|Gəncə|Sumqayıt|Mingəçevir|Lənkəran|Şəki|Naxçıvan)', full_text)
            car['city'] = city_match.group(1) if city_match else 'Bakı'
            
            # Yanacaq və transmissiya
            text_lower = full_text.lower()
            car['fuel_type'] = self.detect_fuel(text_lower)
            car['transmission'] = self.detect_transmission(text_lower)
            car['condition'] = self.detect_condition(text_lower)
            car['owners'] = 1
            car['scraped_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            return car
            
        except Exception as e:
            return None

    def detect_fuel(self, text):
        if 'dizel' in text or 'diesel' in text:
            return 'dizel'
        elif 'hibrid' in text or 'hybrid' in text:
            return 'hibrid'
        elif 'elektrik' in text or 'electric' in text:
            return 'elektrik'
        elif 'qaz' in text:
            return 'qaz'
        return 'benzin'

    def detect_transmission(self, text):
        if 'mexaniki' in text or 'manual' in text:
            return 'mexaniki'
        elif 'robot' in text:
            return 'robot'
        elif 'variator' in text:
            return 'variator'
        return 'avtomat'

    def detect_condition(self, text):
        if 'yeni' in text or 'sıfır' in text or 'new' in text:
            return 'ela'
        elif 'vurulan' in text or 'vuruqllu' in text:
            return 'orta'
        return 'yaxsi'

    def scrape_page(self, page_num):
        """Bir səhifəni scrape edir"""
        print(f"📄 Səhifə {page_num}...", end=' ', flush=True)
        
        url = f"{self.base_url}?page={page_num}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            listings = soup.find_all('div', class_='products-i')
            
            if not listings:
                print("❌ Boş")
                return False
            
            count = 0
            for listing in listings:
                car_data = self.extract_car_data(listing)
                if car_data:
                    self.cars_data.append(car_data)
                    count += 1
            
            print(f"✅ {count}/{len(listings)}")
            return count > 0
            
        except Exception as e:
            print(f"❌ Xəta: {str(e)[:30]}")
            self.failed_pages.append(page_num)
            return False

    def scrape_all(self, max_pages=3000):
        """Bütün səhifələri scrape edir (100k+ elan)"""
        print(f"\n{'='*60}")
        print(f"🚗 TURBO.AZ FULL SCRAPING")
        print(f"{'='*60}")
        print(f"📊 Maksimum {max_pages} səhifə (~{max_pages*36:,} elan)")
        print(f"⏱️  Təxmini vaxt: {int(max_pages*3/60)} saat\n")
        
        start_time = time.time()
        
        for page in range(1, max_pages + 1):
            self.scrape_page(page)
            
            # İlk səhifə uğursuzsa, dayan
            if page == 1 and not self.cars_data:
                print("\n❌ İlk səhifə scrape edilmədi. Dayandırılır.")
                break
            
            # Hər 50 səhifədə progress saxla
            if page % 50 == 0:
                self.save_progress(page)
                elapsed = time.time() - start_time
                remaining = (elapsed / page) * (max_pages - page)
                print(f"\n💾 Progress: {len(self.cars_data):,} elan | Qalan: ~{int(remaining/60)} dəq\n")
            
            # Rate limiting
            time.sleep(random.uniform(1.5, 3.5))
        
        print(f"\n{'='*60}")
        print(f"✅ SCRAPING TAMAMLANDI!")
        print(f"{'='*60}")
        print(f"📊 Toplam: {len(self.cars_data):,} avtomobil")
        print(f"⏱️  Vaxt: {int((time.time()-start_time)/60)} dəqiqə")
        print(f"❌ Uğursuz səhifələr: {len(self.failed_pages)}")

    def save_progress(self, page_num):
        """Progress saxlayır"""
        if self.cars_data:
            filename = f'car_data_page_{page_num}.csv'
            df = pd.DataFrame(self.cars_data)
            df.to_csv(filename, index=False, encoding='utf-8-sig')

    def save_data(self, filename='car_data_full.csv'):
        """Final məlumatları saxlayır"""
        if not self.cars_data:
            print("⚠️ Saxlanılacaq məlumat yoxdur")
            return
        
        df = pd.DataFrame(self.cars_data)
        
        # Dublikatları sil
        before = len(df)
        df = df.drop_duplicates(subset=['brand', 'model', 'year', 'price', 'mileage'])
        after = len(df)
        
        # Saxla
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"\n✅ {after:,} unikal elan saxlanıldı ({before-after:,} dublikat silindi)")
        print(f"📁 Fayl: {filename}")
        
        # Statistika
        print(f"\n📊 STATISTIKA:")
        print(f"   Marka sayı: {df['brand'].nunique()}")
        print(f"   Orta qiymət: {df['price'].mean():,.0f} AZN")
        print(f"   Orta yürüş: {df['mileage'].mean():,.0f} km")
        print(f"   İl aralığı: {df['year'].min()}-{df['year'].max()}")

    def clean_and_prepare(self, input_file, output_file='car_data_cleaned.csv'):
        """ML üçün hazırlayır"""
        print("\n🧹 Təmizləmə başladı...")
        
        df = pd.read_csv(input_file)
        original_count = len(df)
        
        # Null və outlier-ləri sil
        df = df.dropna(subset=['price', 'year', 'brand', 'model'])
        df = df[df['price'] > 1000]
        df = df[(df['year'] >= 1990) & (df['year'] <= 2026)]
        df = df[df['mileage'] >= 0]
        df = df[df['mileage'] < 1000000]
        
        # Price outlier-ləri sil
        q1 = df['price'].quantile(0.01)
        q99 = df['price'].quantile(0.99)
        df = df[(df['price'] >= q1) & (df['price'] <= q99)]
        
        # Saxla
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        
        print(f"✅ Təmizləndi: {original_count:,} -> {len(df):,} (-{original_count-len(df):,})")
        print(f"📁 Fayl: {output_file}")


def main():
    """Ana funksiya"""
    scraper = TurboAzAdvancedScraper()
    
    # Full scraping (100k+ avtomobil üçün ~3000 səhifə)
    scraper.scrape_all(max_pages=3000)
    
    # Saxla
    if scraper.cars_data:
        scraper.save_data('car_data_full.csv')
        scraper.clean_and_prepare('car_data_full.csv', 'car_data_cleaned.csv')
        
        print("\n🎉 Hazır! İndi modeli train edin:")
        print("   python train_model.py")
    else:
        print("\n❌ Scraping uğursuz oldu")


if __name__ == "__main__":
    main()
