"""
Advanced Car Price Prediction Model
Her marka ve modelin ferqli depreciation pattern-lerini oyrenir
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

def load_and_clean_data():
    """CSV yukle ve temizle"""
    print("\n" + "="*70)
    print("ADVANCED CAR PRICE PREDICTION - IMPROVED MODEL")
    print("="*70)
    
    print("\n1. Data yuklenir...")
    df = pd.read_csv('car_data.csv', encoding='utf-8')
    print(f"   Orijinal: {len(df)} masin")
    
    # Temizleme
    print("\n2. Data temizlenir...")
    df = df.dropna()
    df = df[df['qiymet'] > 0]
    df = df[df['qiymet'] < 1000000]  # Outlier-leri sil
    df = df[df['il'] >= 1995]  # Cox kohne masinlari sil
    df = df[df['il'] <= 2026]
    df = df[df['yurus'] >= 0]
    df = df[df['muherrik'] > 0]  # Elektrik olmayanlar
    df = df[df['muherrik'] < 10]  # Anomali-leri sil
    
    print(f"   Temizlenmis: {len(df)} masin")
    
    return df

def create_advanced_features(df):
    """Advanced feature engineering"""
    print("\n3. Advanced features yaradilir...")
    
    df = df.copy()
    
    # 1. YAS (Yasamli melumat - car age)
    current_year = 2026
    df['yas'] = current_year - df['il']
    
    # 2. YURUS per YAS (orta illik yurus)
    df['yurus_per_il'] = df['yurus'] / (df['yas'] + 1)  # +1 to avoid division by zero
    
    # 3. MARKA-MODEL birlesdirilmesi (unique combination)
    df['marka_model'] = df['marka'] + '_' + df['model']
    
    # 4. Her MARKA ucun orta qiymet (brand value indicator)
    brand_avg_price = df.groupby('marka')['qiymet'].mean()
    df['marka_avg_price'] = df['marka'].map(brand_avg_price)
    
    # 5. Her MODEL ucun orta qiymet
    model_avg_price = df.groupby('model')['qiymet'].mean()
    df['model_avg_price'] = df['model'].map(model_avg_price)
    
    # 6. YAS kategoriyasi (yeni/orta/kohne)
    df['yas_category'] = pd.cut(df['yas'], 
                                  bins=[0, 3, 7, 15, 100], 
                                  labels=['yeni', 'orta_yeni', 'orta_kohne', 'kohne'])
    
    # 7. YURUS kategoriyasi
    df['yurus_category'] = pd.cut(df['yurus'],
                                    bins=[0, 50000, 150000, 300000, 10000000],
                                    labels=['az', 'orta', 'cox', 'cox_cox'])
    
    # 8. MUHERRIK kategoriyasi
    df['muherrik_category'] = pd.cut(df['muherrik'],
                                       bins=[0, 1.8, 2.5, 3.5, 10],
                                       labels=['kicik', 'orta', 'boyuk', 'cox_boyuk'])
    
    # 9. DEPRECIATION RATE (her marka ucun)
    # Yeni masinlarin orta qiymetine gore depreciation
    brand_new_price = df[df['yas'] <= 2].groupby('marka')['qiymet'].mean()
    df['brand_new_price'] = df['marka'].map(brand_new_price)
    df['depreciation_ratio'] = df['qiymet'] / (df['brand_new_price'] + 1)
    
    print(f"   Yaradilan feature-ler: yas, yurus_per_il, marka_model, kategoriyalar")
    print(f"   Brand value indicators: marka_avg_price, model_avg_price, depreciation_ratio")
    
    return df

def encode_all_features(df):
    """Butun kateqorik feature-leri encode et"""
    print("\n4. Features encode edilir...")
    
    encoders = {}
    
    # Marka
    encoders['marka'] = LabelEncoder()
    df['marka_encoded'] = encoders['marka'].fit_transform(df['marka'])
    
    # Model
    encoders['model'] = LabelEncoder()
    df['model_encoded'] = encoders['model'].fit_transform(df['model'])
    
    # Marka-Model kombinasiyasi
    encoders['marka_model'] = LabelEncoder()
    df['marka_model_encoded'] = encoders['marka_model'].fit_transform(df['marka_model'])
    
    # Yas kategoriyasi
    encoders['yas_category'] = LabelEncoder()
    df['yas_category_encoded'] = encoders['yas_category'].fit_transform(df['yas_category'].astype(str))
    
    # Yurus kategoriyasi
    encoders['yurus_category'] = LabelEncoder()
    df['yurus_category_encoded'] = encoders['yurus_category'].fit_transform(df['yurus_category'].astype(str))
    
    # Muherrik kategoriyasi
    encoders['muherrik_category'] = LabelEncoder()
    df['muherrik_category_encoded'] = encoders['muherrik_category'].fit_transform(df['muherrik_category'].astype(str))
    
    print(f"   Encoded: {len(encoders)} kateqorik feature")
    
    return df, encoders

def train_advanced_model(df):
    """Advanced model train et"""
    print("\n5. Advanced model training...")
    
    # Feature selection - butun yeni feature-ler
    feature_cols = [
        'marka_encoded',
        'model_encoded',
        'marka_model_encoded',
        'il',
        'yas',
        'yurus',
        'yurus_per_il',
        'muherrik',
        'marka_avg_price',
        'model_avg_price',
        'depreciation_ratio',
        'yas_category_encoded',
        'yurus_category_encoded',
        'muherrik_category_encoded'
    ]
    
    X = df[feature_cols].fillna(0)
    y = df['qiymet']
    
    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"   Train: {len(X_train)} samples")
    print(f"   Test: {len(X_test)} samples")
    print(f"   Features: {len(feature_cols)}")
    
    # RandomForest with better hyperparameters
    print("\n   Training RandomForest (advanced)...")
    rf_model = RandomForestRegressor(
        n_estimators=200,  # Daha cox tree
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
    
    print(f"   RandomForest: MAE={rf_mae:.0f} AZN, R2={rf_r2:.4f}, RMSE={rf_rmse:.0f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n   En vacib feature-ler:")
    for idx, row in feature_importance.head(5).iterrows():
        print(f"      {row['feature']}: {row['importance']:.4f}")
    
    # GradientBoosting
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
    
    return best_model, best_name, best_metrics, feature_cols, feature_importance

def save_advanced_model(model, encoders, model_name, metrics, feature_cols, feature_importance, df):
    """Advanced model ve butun metadata-ni saxla"""
    print("\n6. Model saxlanilir...")
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Model
    model_file = f'car_price_model_advanced_{timestamp}.pkl'
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
    print(f"   Model: {model_file}")
    
    # Encoders
    encoders_file = f'encoders_advanced_{timestamp}.pkl'
    with open(encoders_file, 'wb') as f:
        pickle.dump(encoders, f)
    print(f"   Encoders: {encoders_file}")
    
    # Brand statistics (prediction ucun lazim)
    brand_stats = df.groupby('marka').agg({
        'qiymet': ['mean', 'std', 'count'],
        'yas': 'mean',
        'yurus': 'mean',
        'muherrik': 'mean'
    }).to_dict()
    
    stats_file = f'brand_stats_{timestamp}.pkl'
    with open(stats_file, 'wb') as f:
        pickle.dump(brand_stats, f)
    print(f"   Brand Stats: {stats_file}")
    
    # Metadata
    metadata = {
        'model_name': model_name,
        'timestamp': timestamp,
        'metrics': {
            'mae': float(metrics['mae']),
            'r2': float(metrics['r2']),
            'rmse': float(metrics['rmse'])
        },
        'feature_columns': feature_cols,
        'n_features': len(feature_cols),
        'n_brands': df['marka'].nunique(),
        'n_models': df['model'].nunique(),
        'training_samples': len(df),
        'feature_importance': feature_importance.head(10).to_dict('records')
    }
    
    metadata_file = f'model_metadata_advanced_{timestamp}.json'
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"   Metadata: {metadata_file}")
    
    return model_file, encoders_file, stats_file, metadata_file

def main():
    # 1. Load & Clean
    df = load_and_clean_data()
    
    # 2. Create Advanced Features
    df = create_advanced_features(df)
    
    # 3. Encode
    df, encoders = encode_all_features(df)
    
    # 4. Train Advanced Model
    model, model_name, metrics, feature_cols, feature_importance = train_advanced_model(df)
    
    # 5. Save Everything
    model_file, encoders_file, stats_file, metadata_file = save_advanced_model(
        model, encoders, model_name, metrics, feature_cols, feature_importance, df
    )
    
    print("\n" + "="*70)
    print("✅ ADVANCED MODEL TRAINING TAMAMLANDI!")
    print("="*70)
    print(f"\nModel: {model_name}")
    print(f"MAE: {metrics['mae']:,.0f} AZN (orta xeta)")
    print(f"R2 Score: {metrics['r2']:.4f} ({metrics['r2']*100:.2f}% deqiqlik)")
    print(f"RMSE: {metrics['rmse']:,.0f} AZN")
    print(f"\nFeatures: {len(feature_cols)} (advanced)")
    print(f"Training samples: {len(df):,}")
    print(f"\nFiles:")
    print(f"  - {model_file}")
    print(f"  - {encoders_file}")
    print(f"  - {stats_file}")
    print(f"  - {metadata_file}")
    print("\n")

if __name__ == '__main__':
    main()
