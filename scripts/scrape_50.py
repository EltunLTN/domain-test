"""
Turbo.az Mini Scraper - 50 səhifə (~1,800 avtomobil)
Bu ~5-10 dəqiqə çəkər, test üçün idealdır.
"""

import sys
sys.path.append('.')
from scrape_full import TurboAzAdvancedScraper

def main():
    scraper = TurboAzAdvancedScraper()
    
    # 50 səhifə scrape et (~1,800 avtomobil, ~5-10 dəqiqə)
    print("\n⏱️  Təxmini vaxt: 5-10 dəqiqə")
    print("💡 Sürətli test versiyası\n")
    
    scraper.scrape_all(max_pages=50)
    
    if scraper.cars_data:
        scraper.save_data('car_data_50pages.csv')
        scraper.clean_and_prepare('car_data_50pages.csv', 'car_data_cleaned.csv')
        print("\n✅ ML üçün hazır: car_data_cleaned.csv")
        print("🚀 İndi modeli train edin: python train_model.py")
    else:
        print("\n❌ Scraping uğursuz")

if __name__ == "__main__":
    main()
