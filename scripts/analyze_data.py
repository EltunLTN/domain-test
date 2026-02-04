import pandas as pd

# Analyze car_data.csv
df = pd.read_csv('car_data.csv')

print(f'Total: {len(df)} cars')
print(f'\nColumns: {list(df.columns)}')
print(f'\nUnique brands: {df["marka"].nunique()}')
print(f'Unique models: {df["model"].nunique()}')

# Get all unique brands
print('\n=== ALL BRANDS ===')
brands = sorted(df['marka'].unique())
print(f'Total brands: {len(brands)}')
for brand in brands[:50]:  # First 50
    print(f'  - {brand}')

# Get brand-model mapping
print('\n=== BRAND-MODEL MAPPING (Top 20 brands) ===')
brand_counts = df['marka'].value_counts()
for brand in brand_counts.head(20).index:
    models = df[df['marka'] == brand]['model'].unique()
    print(f'\n{brand} ({len(models)} models):')
    print(f'  {", ".join(sorted(models)[:10])}...')
