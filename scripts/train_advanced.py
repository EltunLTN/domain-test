"""
Advanced Car Price Prediction Model
Her marka/modelin ozunun xusussiyyetlerini ogrenecek
Feature engineering ile daha deqiq qiymet tahmini
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import pickle
import json
from datetime import datetime

def create_advanced_features(df):
    """Advanced feature engineering"""
    print("\n3. Advanced features yaradilir...")
    
    # Yas hesabla
    current_year = 2026
    df['yas'] = current_year - df['il']
    
    # Ortalama yillik yurus
    df['yillik_yurus'] = df['yurus'] / np.maximum(df['yas'], 1)
    
    # Muherrik/Yas orani
    df['muherrik_yas_ratio'] = df['muherrik'] / np.maximum(df['yas'], 1)
    
    # Yurus kategoriyasi
    df['yurus_kategori'] = pd.cut(df['yurus'], 
                                   bins=[0, 50000, 100000, 200000, float('inf')],
                                   labels=['az', 'orta', 'cox', 'coxcox'])
    
    # Yas kategoriyasi
    df['yas_kategori'] = pd.cut(df['yas'],
                                 bins=[0, 3, 7, 15, float('inf')],
                                 labels=['yeni', 'yaxsi', 'orta', 'kohne'])
    
    # Log transformations (qiymet anomalileri ucun)
    df['log_yurus'] = np.log1p(df['yurus'])
    df['log_muherrik'] = np.log1p(df['muherrik'])
    
    print(f"   Yeni features elave edildi")
    print(f"   Ortalama yas: {df['yas'].mean():.1f} il")
    print(f"   Ortalama yillik yurus: {df['yillik_yurus'].mean():.0f} km")
    
    return df

def encode_features_advanced(df):
    """Advanced encoding - her marka/model ucun spesifik kodlama"""
    print("\n4. Encoding (marka/model combination)...")
    
    # Marka encoder
    marka_encoder = LabelEncoder()
    df['marka_encoded'] = marka_encoder.fit_transform(df['marka'])
    
    # Model encoder
    model_encoder = LabelEncoder()
    df['model_encoded'] = model_encoder.fit_transform(df['model'])
    
    # Yurus kategorisi encoder
    yurus_kat_encoder = LabelEncoder()
    df['yurus_kat_encoded'] = yurus_kat_encoder.fit_transform(df['yurus_kategori'].astype(str))
    
    # Yas kategorisi encoder
    yas_kat_encoder = LabelEncoder()
    df['yas_kat_encoded'] = yas_kat_encoder.fit_transform(df['yas_kategori'].astype(str))
    
    # Marka-Model kombinasyonu (en onemli feature!)
    df['marka_model_combo'] = df['marka'].astype(str) + '_' + df['model'].astype(str)
    combo_encoder = LabelEncoder()
    df['combo_encoded'] = combo_encoder.fit_transform(df['marka_model_combo'])
    
    print(f"   Marka classes: {len(marka_encoder.classes_)}")
    print(f"   Model classes: {len(model_encoder.classes_)}")
    print(f"   Marka-Model kombinasyonlari: {len(combo_encoder.classes_)}")
    
    encoders = {
        'marka_encoder': marka_encoder,
        'model_encoder': model_encoder,
        'combo_encoder': combo_encoder,
        'yurus_kat_encoder': yurus_kat_encoder,
        'yas_kat_encoder': yas_kat_encoder
    }
    
    return df, encoders

def train_advanced_model(df):
    """Advanced model training - daha cox feature ile"""
    print("\n5. Advanced Model Training...")
    
    # Feature selection - butun onemli features
    feature_columns = [
        'marka_encoded',
        'model_encoded',
        'combo_encoded',  # Marka-Model kombinasyonu - EN ONEMLI!
        'il',
        'yas',
        'yurus',
        'yillik_yurus',
        'log_yurus',
        'muherrik',
        'log_muherrik',
        'muherrik_yas_ratio',
        'yurus_kat_encoded',
        'yas_kat_encoded'
    ]
    
    X = df[feature_columns]
    y = df['qiymet']
    
    print(f"   Features: {len(feature_columns)}")
    print(f"   Samples: {len(X)}")
    
    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"   Train: {len(X_train)} | Test: {len(X_test)}")
    
    # Model 1: RandomForest (daha guclendirilimiş)
    print("\n   Training RandomForest (advanced)...")
    rf_model = RandomForestRegressor(
        n_estimators=200,  # Daha cox agac
        max_depth=25,      # Daha derinlik
        min_samples_split=3,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1,
        verbose=0
    )
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    
    rf_mae = mean_absolute_error(y_test, rf_pred)
    rf_r2 = r2_score(y_test, rf_pred)
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"   RandomForest: MAE={rf_mae:.0f} AZN, R2={rf_r2:.4f}, RMSE={rf_rmse:.0f}")
    print(f"\n   En onemli features:")
    for idx, row in feature_importance.head(5).iterrows():
        print(f"      {row['feature']}: {row['importance']:.3f}")
    
    # Model 2: GradientBoosting
    print("\n   Training GradientBoosting (advanced)...")
    gb_model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.8,
        random_state=42,
        verbose=0
    )
    gb_model.fit(X_train, y_train)
    gb_pred = gb_model.predict(X_test)
    
    gb_mae = mean_absolute_error(y_test, gb_pred)
    gb_r2 = r2_score(y_test, gb_pred)
    gb_rmse = np.sqrt(mean_squared_error(y_test, gb_pred))
    
    print(f"   GradientBoosting: MAE={gb_mae:.0f} AZN, R2={gb_r2:.4f}, RMSE={gb_rmse:.0f}")
    
    # En yaxsi model sec
    if rf_mae < gb_mae:
        best_model = rf_model
        best_name = "RandomForest"
        best_metrics = {"mae": rf_mae, "r2": rf_r2, "rmse": rf_rmse}
    else:
        best_model = gb_model
        best_name = "GradientBoosting"
        best_metrics = {"mae": gb_mae, "r2": gb_r2, "rmse": gb_rmse}
    
    print(f"\n   ✅ En yaxsi model: {best_name}")
    
    return best_model, best_name, best_metrics, feature_columns, X_test, y_test

def save_advanced_model(model, encoders, feature_columns, model_name, metrics):
    """Advanced model saxla"""
    print("\n6. Model saxlanilir...")
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Model
    model_file = f'car_price_model_{timestamp}.pkl'
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
    print(f"   Model: {model_file}")
    
    # Encoders
    encoders_file = f'encoders_{timestamp}.pkl'
    with open(encoders_file, 'wb') as f:
        pickle.dump(encoders, f)
    print(f"   Encoders: {encoders_file}")
    
    # Metadata
    metadata = {
        'model_name': model_name,
        'timestamp': timestamp,
        'version': 'advanced_v2',
        'metrics': {
            'mae': float(metrics['mae']),
            'r2': float(metrics['r2']),
            'rmse': float(metrics['rmse'])
        },
        'features': feature_columns,
        'target': 'qiymet',
        'n_brands': len(encoders['marka_encoder'].classes_),
        'n_models': len(encoders['model_encoder'].classes_),
        'n_combinations': len(encoders['combo_encoder'].classes_)
    }
    
    metadata_file = f'model_metadata_{timestamp}.json'
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"   Metadata: {metadata_file}")
    
    return model_file, encoders_file, metadata_file

def load_and_prepare_data():
    """CSV yukle ve hazirla"""
    print("\n" + "="*60)
    print("ADVANCED CAR PRICE PREDICTION - TRAINING")
    print("="*60)
    
    print("\n1. CSV yuklenilir...")
    df = pd.read_csv('car_data.csv', encoding='utf-8')
    
    print(f"   Toplam: {len(df)} masin")
    print(f"   Markalar: {df['marka'].nunique()}")
    print(f"   Modeller: {df['model'].nunique()}")
    
    # Temizleme
    print("\n2. Data temizlenilir...")
    df = df.dropna()
    df = df[df['qiymet'] > 0]
    df = df[df['il'] >= 1990]
    df = df[df['il'] <= 2026]
    df = df[df['yurus'] >= 0]
    df = df[df['muherrik'] > 0]
    
    print(f"   Temiz data: {len(df)} masin")
    
    return df

def main():
    # 1. Load data
    df = load_and_prepare_data()
    
    # 2. Create advanced features
    df = create_advanced_features(df)
    
    # 3. Encode
    df, encoders = encode_features_advanced(df)
    
    # 4. Train
    model, model_name, metrics, feature_columns, X_test, y_test = train_advanced_model(df)
    
    # 5. Save
    model_file, encoders_file, metadata_file = save_advanced_model(
        model, encoders, feature_columns, model_name, metrics
    )
    
    print("\n" + "="*60)
    print("TRAINING TAMAMLANDI!")
    print("="*60)
    print(f"\nModel: {model_name} (Advanced v2)")
    print(f"MAE: {metrics['mae']:,.0f} AZN")
    print(f"R2 Score: {metrics['r2']:.4f}")
    print(f"RMSE: {metrics['rmse']:,.0f} AZN")
    print(f"\nFiles:")
    print(f"  - {model_file}")
    print(f"  - {encoders_file}")
    print(f"  - {metadata_file}")
    print("\n✅ Her marka/model oz patterns ile train edildi!")
    print("\n")

if __name__ == '__main__':
    main()
