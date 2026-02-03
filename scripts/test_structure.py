import requests
from bs4 import BeautifulSoup

url = 'https://turbo.az/autos'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

print("Turbo.az HTML strukturunu yoxlayır...\n")

r = requests.get(url, headers=headers)
soup = BeautifulSoup(r.content, 'html.parser')

# Müxtəlif selector-ları test et
selectors = [
    ('div.products-i', 'div', {'class': 'products-i'}),
    ('div[class*="product"]', 'div', {'class': lambda x: x and 'product' in str(x)}),
    ('a.products-i__link', 'a', {'class': 'products-i__link'}),
]

for name, tag, attrs in selectors:
    found = soup.find_all(tag, attrs)
    print(f"{name}: {len(found)} tapıldı")
    if found:
        print(f"  İlk element class-ları: {found[0].get('class')}")
        print(f"  İlk element text (ilk 100 char): {found[0].get_text()[:100]}")
        print()

# Debug HTML faylı yaz
with open('turbo_structure_debug.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())
    
print("\n✓ HTML structure 'turbo_structure_debug.html' faylında saxlanıldı")
