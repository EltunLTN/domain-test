"""
car_data.csv-dən bütün marka və modelləri çıxarır
TypeScript formatında CAR_DATA obyekti yaradır
"""

import pandas as pd
import json

# Read CSV
df = pd.read_csv('car_data.csv')

# Brand-model mapping
brand_models = {}
for brand in sorted(df['marka'].unique()):
    models = sorted(df[df['marka'] == brand]['model'].unique())
    brand_models[brand] = models

# Generate TypeScript code
ts_code = "// AUTO-GENERATED from car_data.csv\n"
ts_code += "// Total: {} brands, {} unique models\n\n".format(len(brand_models), len(df['model'].unique()))
ts_code += "const CAR_DATA: { [brand: string]: string[] } = {\n"

for brand, models in brand_models.items():
    # Escape quotes in model names
    models_escaped = [model.replace("'", "\\'").replace('"', '\\"') for model in models]
    models_str = "', '".join(models_escaped)
    ts_code += f"  '{brand}': ['{models_str}'],\n"

ts_code += "};\n\n"
ts_code += "export const BRANDS = Object.keys(CAR_DATA).sort();\n"

# Save
with open('car_data_ts.txt', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("✅ TypeScript code generated!")
print(f"📊 {len(brand_models)} brands")
print(f"📊 {len(df['model'].unique())} unique models")
print("\nTop 10 brands by model count:")
for brand in sorted(brand_models.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
    print(f"  {brand[0]}: {len(brand[1])} models")

print("\n✅ Saved to: car_data_ts.txt")
