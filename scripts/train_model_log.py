"""
Logaritmik transformasiya ilə model trainer.
Hər model (marka+model) üçün ayrı pipeline qurur.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os
from datetime import datetime
import json
import warnings
warnings.filterwarnings('ignore')

# Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, 'car_data.csv')

def train_global_model():
    """Bütün data üzərində bir model qur"""
    
    print("=" * 60)
    print("LOGARİTMİK TRANSFORMASİYA İLƏ MODEL TRAİNER")
    print("=" * 60)
    
    # Data yüklə
    print("\n📊 Məlumatlar yüklənir...")
    df = pd.read_csv(csv_path)
    print(f"   Ümumi: {len(df):,} maşın")
    
    # Məlumatları təmizlə
    print("\n🧹 Məlumatlar təmizlənir...")
    df.dropna(inplace=True)
    df['il'] = pd.to_numeric(df['il'], errors='coerce')
    df['yurus'] = pd.to_numeric(df['yurus'], errors='coerce')
    df['muherrik'] = pd.to_numeric(df['muherrik'], errors='coerce')
    df['qiymet'] = pd.to_numeric(df['qiymet'], errors='coerce')
    df.dropna(subset=['il', 'yurus', 'muherrik', 'qiymet'], inplace=True)
    
    # Tip çevirmə
    df = df.astype({'il': int, 'yurus': int, 'qiymet': int, 'muherrik': float})
    
    # Filtrlər - lüks maşınları saxlamaq üçün yuxarı limit artırılıb
    df = df[(df['qiymet'] > 1000) & (df['qiymet'] < 2000000)]
    df = df[df['yurus'] < 1000000]
    df = df[df['il'] >= 1990]
    df = df[df['muherrik'] > 0]
    
    print(f"   Təmizlənmiş: {len(df):,} maşın")
    
    # Features və target
    features = ['marka', 'model', 'il', 'yurus', 'muherrik']
    target = 'qiymet'
    
    X = df[features]
    y = df[target]
    
    # LOGARİTMİK TRANSFORMASİYA
    print("\n📐 Logaritmik transformasiya tətbiq edilir...")
    y_log = np.log1p(y)  # log(y + 1)
    
    # Train/test split
    X_train, X_test, y_train_log, y_test_log = train_test_split(
        X, y_log, test_size=0.2, random_state=42
    )
    
    # Pipeline qur
    print("\n🔧 Pipeline qurulur...")
    categorical_features = ['marka', 'model']
    numeric_features = ['il', 'yurus', 'muherrik']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ],
        remainder='passthrough'
    )
    
    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', model)
    ])
    
    # Model təlim et
    print(f"\n🚀 {len(X_train):,} məlumat üzərində model təlim edilir...")
    pipeline.fit(X_train, y_train_log)
    
    # Test
    print("\n📈 Model test edilir...")
    y_pred_log = pipeline.predict(X_test)
    
    # Logaritmadan geri çevir
    y_pred = np.expm1(y_pred_log)
    y_test = np.expm1(y_test_log)
    
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"   MAE: {mae:,.0f} AZN")
    print(f"   R²: {r2:.4f}")
    
    # Model saxla
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_file = os.path.join(script_dir, f'car_price_model_log_{timestamp}.pkl')
    
    with open(model_file, 'wb') as f:
        pickle.dump(pipeline, f)
    print(f"\n💾 Model saxlandı: {model_file}")
    
    # Metadata
    metadata = {
        'timestamp': timestamp,
        'total_samples': len(df),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'mae': float(mae),
        'r2': float(r2),
        'features': features,
        'unique_brands': int(df['marka'].nunique()),
        'unique_models': int(df['marka_model'].nunique()) if 'marka_model' in df.columns else int((df['marka'] + ' ' + df['model']).nunique()),
        'model_file': os.path.basename(model_file),
        'transformation': 'log1p'
    }
    
    meta_file = os.path.join(script_dir, f'model_metadata_log_{timestamp}.json')
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"💾 Metadata saxlandı: {meta_file}")
    
    # Test nümunələri
    print("\n" + "=" * 60)
    print("🧪 TEST NƏTİCƏLƏRİ:")
    print("=" * 60)
    
    test_cases = [
        {'marka': 'Lamborghini', 'model': 'Urus', 'il': 2025, 'yurus': 0, 'muherrik': 4.0},
        {'marka': 'Lamborghini', 'model': 'Urus', 'il': 2021, 'yurus': 6000, 'muherrik': 4.0},
        {'marka': 'Mercedes', 'model': 'E 200', 'il': 2020, 'yurus': 50000, 'muherrik': 2.0},
        {'marka': 'Mercedes', 'model': 'E 200', 'il': 2015, 'yurus': 150000, 'muherrik': 2.0},
        {'marka': 'Toyota', 'model': 'Camry', 'il': 2021, 'yurus': 30000, 'muherrik': 2.5},
        {'marka': 'LADA (VAZ)', 'model': '2107', 'il': 2018, 'yurus': 100000, 'muherrik': 1.6},
        {'marka': 'BMW', 'model': 'X5', 'il': 2019, 'yurus': 80000, 'muherrik': 3.0},
        {'marka': 'Porsche', 'model': 'Cayenne', 'il': 2020, 'yurus': 40000, 'muherrik': 3.0},
        {'marka': 'Hyundai', 'model': 'Elantra', 'il': 2022, 'yurus': 20000, 'muherrik': 2.0},
        {'marka': 'Rolls-Royce', 'model': 'Cullinan', 'il': 2023, 'yurus': 5000, 'muherrik': 6.75},
    ]
    
    for tc in test_cases:
        input_df = pd.DataFrame([tc])
        log_pred = pipeline.predict(input_df)
        pred = np.expm1(log_pred)[0]
        
        print(f"\n   {tc['marka']} {tc['model']} ({tc['il']}, {tc['yurus']:,} km)")
        print(f"   └─ Proqnoz: {pred:,.0f} AZN")
    
    print("\n✅ TAMAMLANDI!")
    
    return pipeline, metadata


if __name__ == '__main__':
    train_global_model()
