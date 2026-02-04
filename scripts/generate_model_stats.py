"""Generate per-model stats for fallback pricing (brand+model)."""

import json
import os
import pandas as pd

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, 'car_data.csv')
output_path = os.path.join(script_dir, 'model_stats.json')

df = pd.read_csv(csv_path)

# Ensure correct types
for col in ['qiymet']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

df = df.dropna(subset=['marka', 'model', 'qiymet'])

stats = (
    df.groupby(['marka', 'model'])
    .agg(
        mean_price=('qiymet', 'mean'),
        min_price=('qiymet', 'min'),
        max_price=('qiymet', 'max'),
        count=('qiymet', 'count'),
        avg_il=('il', 'mean'),
        avg_yurus=('yurus', 'mean'),
        avg_muherrik=('muherrik', 'mean'),
    )
    .reset_index()
)

result = {}
for _, row in stats.iterrows():
    key = f"{row['marka']}||{row['model']}"
    result[key] = {
        'avg_price': float(row['mean_price']),
        'min_price': float(row['min_price']),
        'max_price': float(row['max_price']),
        'count': int(row['count']),
        'avg_il': float(row['avg_il']),
        'avg_yurus': float(row['avg_yurus']),
        'avg_muherrik': float(row['avg_muherrik']),
    }

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False)

print(f"Saved: {output_path} ({len(result)} models)")
