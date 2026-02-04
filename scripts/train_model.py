"""
Car Price Prediction Model - 67k Data
6 Features: marka, model, il, yurus, muherrik, qiymet
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import pickle
import json
from datetime import datetime

def load_and_prepare_data():
    """CSV yukle ve hazirla"""
    print("\n" + "="*60)
    print("CAR PRICE PREDICTION MODEL - TRAINING")
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
    
    print(f"   Temiz data: {len(df)} masin")
    
    return df

def encode_features(df):
    """Marka ve Model encode et"""
    print("\n3. Features encode edilir...")
    
    # Marka encoder
    marka_encoder = LabelEncoder()
    df['marka_encoded'] = marka_encoder.fit_transform(df['marka'])
    
    # Model encoder
    model_encoder = LabelEncoder()
    df['model_encoded'] = model_encoder.fit_transform(df['model'])
    
    print(f"   Marka classes: {len(marka_encoder.classes_)}")
    print(f"   Model classes: {len(model_encoder.classes_)}")
    
    return df, marka_encoder, model_encoder

def train_models(df):
    """2 model train et - RandomForest ve GradientBoosting"""
    print("\n4. Models training...")
    
    # Features ve Target
    X = df[['marka_encoded', 'model_encoded', 'il', 'yurus', 'muherrik']]
    y = df['qiymet']
    
    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"   Train: {len(X_train)} samples")
    print(f"   Test: {len(X_test)} samples")
    
    # RandomForest
    print("\n   Training RandomForest...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    
    rf_mae = mean_absolute_error(y_test, rf_pred)
    rf_r2 = r2_score(y_test, rf_pred)
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred))
    
    print(f"   RandomForest: MAE={rf_mae:.0f} AZN, R2={rf_r2:.4f}, RMSE={rf_rmse:.0f}")
    
    # GradientBoosting
    print("\n   Training GradientBoosting...")
    gb_model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=7,
        learning_rate=0.1,
        random_state=42
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
    
    print(f"\n   En yaxsi model: {best_name}")
    
    return best_model, best_name, best_metrics, X_test, y_test

def save_model(model, marka_encoder, model_encoder, model_name, metrics):
    """Model ve encoders saxla"""
    print("\n5. Model saxlanilir...")
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Model
    model_file = f'car_price_model_{timestamp}.pkl'
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
    print(f"   Model: {model_file}")
    
    # Encoders
    encoders = {
        'marka_encoder': marka_encoder,
        'model_encoder': model_encoder
    }
    encoders_file = f'encoders_{timestamp}.pkl'
    with open(encoders_file, 'wb') as f:
        pickle.dump(encoders, f)
    print(f"   Encoders: {encoders_file}")
    
    # Metadata
    metadata = {
        'model_name': model_name,
        'timestamp': timestamp,
        'metrics': {
            'mae': float(metrics['mae']),
            'r2': float(metrics['r2']),
            'rmse': float(metrics['rmse'])
        },
        'features': ['marka', 'model', 'il', 'yurus', 'muherrik'],
        'target': 'qiymet',
        'n_brands': len(marka_encoder.classes_),
        'n_models': len(model_encoder.classes_)
    }
    
    metadata_file = f'model_metadata_{timestamp}.json'
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"   Metadata: {metadata_file}")
    
    return model_file, encoders_file, metadata_file

def test_predictions(model, marka_encoder, model_encoder, df):
    """Test predictions"""
    print("\n6. Test predictions:")
    
    test_cases = [
        {'marka': 'Mercedes', 'model': 'E 200', 'il': 2020, 'yurus': 50000, 'muherrik': 2.0},
        {'marka': 'BMW', 'model': '320', 'il': 2019, 'yurus': 80000, 'muherrik': 2.0},
        {'marka': 'Toyota', 'model': 'Camry', 'il': 2021, 'yurus': 30000, 'muherrik': 2.5},
    ]
    
    for i, car in enumerate(test_cases, 1):
        try:
            marka_enc = marka_encoder.transform([car['marka']])[0]
            model_enc = model_encoder.transform([car['model']])[0]
            
            features = [[marka_enc, model_enc, car['il'], car['yurus'], car['muherrik']]]
            prediction = model.predict(features)[0]
            
            print(f"\n   Test {i}: {car['marka']} {car['model']} {car['il']}")
            print(f"   Yurus: {car['yurus']} km, Muherrik: {car['muherrik']} L")
            print(f"   Predicted price: {prediction:,.0f} AZN")
            
        except Exception as e:
            print(f"\n   Test {i}: Error - {e}")

def main():
    # 1. Load data
    df = load_and_prepare_data()
    
    # 2. Encode
    df, marka_encoder, model_encoder = encode_features(df)
    
    # 3. Train
    model, model_name, metrics, X_test, y_test = train_models(df)
    
    # 4. Save
    model_file, encoders_file, metadata_file = save_model(
        model, marka_encoder, model_encoder, model_name, metrics
    )
    
    # 5. Test
    test_predictions(model, marka_encoder, model_encoder, df)
    
    print("\n" + "="*60)
    print("TRAINING TAMAMLANDI!")
    print("="*60)
    print(f"\nModel: {model_name}")
    print(f"MAE: {metrics['mae']:,.0f} AZN")
    print(f"R2 Score: {metrics['r2']:.4f}")
    print(f"RMSE: {metrics['rmse']:,.0f} AZN")
    print(f"\nFiles:")
    print(f"  - {model_file}")
    print(f"  - {encoders_file}")
    print(f"  - {metadata_file}")
    print("\n")

if __name__ == '__main__':
    main()
