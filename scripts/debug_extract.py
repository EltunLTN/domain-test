import requests
from bs4 import BeautifulSoup
import re

url = 'https://turbo.az/autos'
headers = {'User-Agent': 'Mozilla/5.0'}

r = requests.get(url, headers=headers)
soup = BeautifulSoup(r.content, 'html.parser')
listings = soup.find_all('div', class_='products-i')

print(f"Tapılan elanlar: {len(listings)}\n")

if listings:
    first = listings[0]
    print("İLK ELAN HTML:")
    print("="*60)
    print(first.prettify()[:1500])
    print("\n\nMƏLUMAT ÇIXARTMA TEST:")
    print("="*60)
    
    # Qiymət
    price = first.find('div', class_='product-price')
    print(f"Qiymət elementi: {price}")
    if price:
        print(f"Qiymət text: {price.get_text(strip=True)}")
    
    # Ad
    name = first.find('div', class_='products-i__name')
    print(f"\nAd elementi: {name}")
    if name:
        print(f"Ad text: {name.get_text(strip=True)}")
    
    # Parametrlər
    attrs = first.find_all('div', class_='products-i__attributes')
    print(f"\nParametr elementləri: {len(attrs)}")
    for i, attr in enumerate(attrs):
        print(f"  {i+1}. {attr.get_text(strip=True)}")
    
    # Tam text
    print(f"\nTam text (ilk 500 char):")
    print(first.get_text()[:500])
