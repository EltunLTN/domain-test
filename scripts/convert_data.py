"""
car_data_50pages.csv-i car_data.csv formatina cevir
Sadəcə 6 sutun: marka, model, il, yurus, muherrik, qiymet
"""

import pandas as pd

# 50 pages data yukle
df = pd.read_csv('car_data_50pages.csv', encoding='utf-8')

print(f"Original: {len(df)} rows, {len(df.columns)} columns")
print(f"Columns: {df.columns.tolist()}\n")

# Rename columns to Azerbaijani format
df_new = pd.DataFrame({
    'marka': df['brand'],
    'model': df['model'],
    'il': df['year'],
    'yurus': df['mileage'],
    'muherrik': df['engine_size'],
    'qiymet': df['price']
})

# Data temizleme
print("Temizleme...")
df_new = df_new.dropna()
df_new = df_new[df_new['qiymet'] > 0]
df_new = df_new[df_new['il'] >= 1990]
df_new = df_new[df_new['il'] <= 2026]
df_new = df_new[df_new['yurus'] >= 0]
df_new = df_new[df_new['muherrik'] > 0]

print(f"Temiz: {len(df_new)} rows")
print(f"Markalar: {df_new['marka'].nunique()}")
print(f"Modeller: {df_new['model'].nunique()}")

# Statistika
print("\nQiymet statistikasi:")
print(df_new['qiymet'].describe())

print("\nEn cox olan markalar:")
print(df_new['marka'].value_counts().head(10))

# Saxla
df_new.to_csv('car_data.csv', index=False, encoding='utf-8')
print(f"\n✅ Saxlanildi: car_data.csv ({len(df_new)} rows)")
