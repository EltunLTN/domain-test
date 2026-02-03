"""
Turbo.az Quick Scraper - 200 səhifə (~7,200 avtomobil)
Bu ~1-2 saat çəkər və kompüter açıq qalmalıdır.
"""

import sys
sys.path.append('.')
from scrape_full import TurboAzAdvancedScraper

def main():
    scraper = TurboAzAdvancedScraper()
    
    # 200 səhifə scrape et (~7,200 avtomobil, ~1-2 saat)
    print("\n⏱️  Təxmini vaxt: 1-2 saat")
    print("💡 Kompüter açıq qalmalıdır\n")
    
    scraper.scrape_all(max_pages=200)
    
    if scraper.cars_data:
        scraper.save_data('car_data_200pages.csv')
        scraper.clean_and_prepare('car_data_200pages.csv', 'car_data_cleaned.csv')
        print("\n✅ ML üçün hazır: car_data_cleaned.csv")
        print("🚀 İndi modeli train edin: python train_model.py")
    else:
        print("\n❌ Scraping uğursuz")

if __name__ == "__main__":
    main()
