"""
Hər model üçün ayrı ML model quran skript.
Məsələn: Mercedes E 200, Toyota Camry, Lada Priora - hər biri üçün ayrı model.

Qaydalar:
1. Modeldə >= 30 maşın varsa: RandomForest ML model qur
2. Modeldə 10-29 maşın varsa: LinearRegression model qur
3. Modeldə < 10 maşın varsa: Ortalama qiymət və statistika saxla (ML yoxdur)
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def create_features(df):
    """Model üçün xüsusiyyətlər yarat"""
    features = pd.DataFrame()
    
    # Əsas xüsusiyyətlər
    features['il'] = df['il']
    features['yurus'] = df['yurus']
    features['muherrik'] = df['muherrik']
    
    # Yaş
    features['yas'] = 2026 - df['il']
    
    # İldə yürüş
    features['yurus_per_il'] = df['yurus'] / (features['yas'] + 1)
    
    return features

def train_model_for_single(df_model, model_name):
    """Bir model üçün ML model qur"""
    
    n_samples = len(df_model)
    
    result = {
        'model_name': model_name,
        'n_samples': n_samples,
        'avg_price': float(df_model['qiymet'].mean()),
        'min_price': float(df_model['qiymet'].min()),
        'max_price': float(df_model['qiymet'].max()),
        'std_price': float(df_model['qiymet'].std()) if n_samples > 1 else 0,
        'avg_il': float(df_model['il'].mean()),
        'avg_yurus': float(df_model['yurus'].mean()),
        'avg_muherrik': float(df_model['muherrik'].mean()),
    }
    
    # Az sayda maşın varsa - ML model qurmuruq
    if n_samples < 10:
        result['model_type'] = 'stats_only'
        result['ml_model'] = None
        result['scaler'] = None
        result['mae'] = None
        result['r2'] = None
        return result
    
    # Xüsusiyyətlər yarat
    X = create_features(df_model)
    y = df_model['qiymet'].values
    
    # NaN və inf dəyərləri təmizlə
    mask = ~(X.isna().any(axis=1) | np.isinf(X).any(axis=1) | np.isnan(y) | np.isinf(y))
    X = X[mask]
    y = y[mask]
    
    if len(X) < 10:
        result['model_type'] = 'stats_only'
        result['ml_model'] = None
        result['scaler'] = None
        result['mae'] = None
        result['r2'] = None
        return result
    
    # Scaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train/test split (əgər kifayət qədər data varsa)
    if n_samples >= 30:
        # RandomForest
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        
        n_estimators = min(100, max(10, n_samples // 5))
        max_depth = min(15, max(3, n_samples // 10))
        
        model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=max(2, n_samples // 20),
            min_samples_leaf=max(1, n_samples // 30),
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        result['model_type'] = 'random_forest'
        result['mae'] = float(mean_absolute_error(y_test, y_pred))
        result['r2'] = float(r2_score(y_test, y_pred))
        
    else:
        # Linear Regression (10-29 sample)
        model = LinearRegression()
        model.fit(X_scaled, y)
        
        y_pred = model.predict(X_scaled)
        result['model_type'] = 'linear_regression'
        result['mae'] = float(mean_absolute_error(y, y_pred))
        result['r2'] = float(r2_score(y, y_pred))
    
    result['ml_model'] = model
    result['scaler'] = scaler
    result['feature_names'] = list(X.columns)
    
    return result

def main():
    print("=" * 60)
    print("HƏR MODEL ÜÇÜN AYRI ML MODEL QURAN SİSTEM")
    print("=" * 60)
    
    # Data yüklə
    print("\n📊 Data yüklənir...")
    df = pd.read_csv('car_data.csv')
    print(f"   Ümumi: {len(df):,} maşın")
    
    # Marka + Model birləşdir
    df['marka_model'] = df['marka'] + ' ' + df['model']
    
    unique_models = df['marka_model'].unique()
    print(f"   Unikal modellər: {len(unique_models):,}")
    
    # Hər model üçün train
    all_models = {}
    stats = {
        'random_forest': 0,
        'linear_regression': 0,
        'stats_only': 0,
        'total_mae': 0,
        'total_r2': 0,
        'ml_count': 0
    }
    
    print(f"\n🔄 Hər model üçün ayrı train edilir...")
    
    for i, model_name in enumerate(unique_models):
        df_model = df[df['marka_model'] == model_name].copy()
        
        result = train_model_for_single(df_model, model_name)
        all_models[model_name] = result
        
        stats[result['model_type']] += 1
        
        if result['mae'] is not None:
            stats['total_mae'] += result['mae']
            stats['total_r2'] += result['r2']
            stats['ml_count'] += 1
        
        # Progress
        if (i + 1) % 100 == 0 or i == len(unique_models) - 1:
            print(f"   [{i+1}/{len(unique_models)}] model işləndi...")
    
    # Statistikalar
    print("\n" + "=" * 60)
    print("📊 NƏTİCƏLƏR:")
    print("=" * 60)
    print(f"   RandomForest modellər: {stats['random_forest']} (>= 30 maşın)")
    print(f"   LinearRegression modellər: {stats['linear_regression']} (10-29 maşın)")
    print(f"   Yalnız statistika: {stats['stats_only']} (< 10 maşın)")
    
    if stats['ml_count'] > 0:
        avg_mae = stats['total_mae'] / stats['ml_count']
        avg_r2 = stats['total_r2'] / stats['ml_count']
        print(f"\n   Ortalama MAE: {avg_mae:,.0f} AZN")
        print(f"   Ortalama R²: {avg_r2:.4f}")
    
    # Modeli saxla
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # ML modelləri ayrı saxla (böyük fayl)
    ml_models = {}
    model_stats = {}
    
    for model_name, data in all_models.items():
        # ML model varsa ayrı saxla
        if data['ml_model'] is not None:
            ml_models[model_name] = {
                'model': data['ml_model'],
                'scaler': data['scaler'],
                'feature_names': data['feature_names']
            }
        
        # Stats hər model üçün saxla
        model_stats[model_name] = {
            'model_type': data['model_type'],
            'n_samples': data['n_samples'],
            'avg_price': data['avg_price'],
            'min_price': data['min_price'],
            'max_price': data['max_price'],
            'std_price': data['std_price'],
            'avg_il': data['avg_il'],
            'avg_yurus': data['avg_yurus'],
            'avg_muherrik': data['avg_muherrik'],
            'mae': data['mae'],
            'r2': data['r2']
        }
    
    # ML modelləri saxla
    ml_file = f'per_model_ml_{timestamp}.pkl'
    with open(ml_file, 'wb') as f:
        pickle.dump(ml_models, f)
    print(f"\n💾 ML modellər saxlandı: {ml_file}")
    
    # Statistikalar saxla
    stats_file = f'per_model_stats_{timestamp}.pkl'
    with open(stats_file, 'wb') as f:
        pickle.dump(model_stats, f)
    print(f"💾 Statistikalar saxlandı: {stats_file}")
    
    # Metadata
    metadata = {
        'timestamp': timestamp,
        'total_models': len(unique_models),
        'random_forest_count': stats['random_forest'],
        'linear_regression_count': stats['linear_regression'],
        'stats_only_count': stats['stats_only'],
        'avg_mae': avg_mae if stats['ml_count'] > 0 else None,
        'avg_r2': avg_r2 if stats['ml_count'] > 0 else None,
        'ml_file': ml_file,
        'stats_file': stats_file
    }
    
    meta_file = f'per_model_metadata_{timestamp}.json'
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"💾 Metadata saxlandı: {meta_file}")
    
    print("\n✅ TAMAMLANDI!")
    
    # Test
    print("\n" + "=" * 60)
    print("🧪 TEST:")
    print("=" * 60)
    
    test_cases = [
        ('Mercedes E 200', 2020, 50000, 2.0),
        ('Mercedes E 200', 2015, 150000, 2.0),
        ('Toyota Camry', 2021, 30000, 2.5),
        ('LADA (VAZ) 2107', 2018, 100000, 1.6),
        ('BMW X5', 2019, 80000, 3.0),
        ('Hyundai Elantra', 2022, 20000, 2.0),
    ]
    
    for model_name, il, yurus, muherrik in test_cases:
        if model_name in model_stats:
            stat = model_stats[model_name]
            
            if stat['model_type'] != 'stats_only' and model_name in ml_models:
                # ML ilə predict
                ml = ml_models[model_name]
                
                features = pd.DataFrame({
                    'il': [il],
                    'yurus': [yurus],
                    'muherrik': [muherrik],
                    'yas': [2026 - il],
                    'yurus_per_il': [yurus / (2026 - il + 1)]
                })
                
                X_scaled = ml['scaler'].transform(features)
                pred = ml['model'].predict(X_scaled)[0]
                
                print(f"\n   {model_name} ({il}, {yurus:,} km, {muherrik}L)")
                print(f"   └─ Proqnoz: {pred:,.0f} AZN ({stat['model_type']})")
                print(f"   └─ Dataset ort: {stat['avg_price']:,.0f} AZN ({stat['n_samples']} maşın)")
            else:
                # Statistika ilə
                print(f"\n   {model_name} ({il}, {yurus, muherrik})")
                print(f"   └─ Ortalama qiymət: {stat['avg_price']:,.0f} AZN")
                print(f"   └─ Dataset: {stat['n_samples']} maşın (az data - ML yoxdur)")
        else:
            print(f"\n   {model_name} - tapılmadı!")

if __name__ == '__main__':
    main()
