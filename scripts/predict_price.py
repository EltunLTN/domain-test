"""
Car Price Prediction - car_data.csv ile train edilmis model
"""

import sys
import json
import pickle
import pandas as pd
import numpy as np
from pathlib import Path

def load_latest_model():
    """En yeni model ve encoders yukle"""
    script_dir = Path(__file__).parent
    
    # En yeni model fayllarini tap
    model_files = list(script_dir.glob('car_price_model_*.pkl'))
    encoder_files = list(script_dir.glob('encoders_*.pkl'))
    
    if not model_files or not encoder_files:
        raise FileNotFoundError("Model faylları tapılmadı! Train edin: python train_model.py")
    
    # En yeni faylları seç
    latest_model = max(model_files, key=lambda p: p.stat().st_mtime)
    latest_encoders = max(encoder_files, key=lambda p: p.stat().st_mtime)
    
    # Yükle
    with open(latest_model, 'rb') as f:
        model = pickle.load(f)
    
    with open(latest_encoders, 'rb') as f:
        encoders = pickle.load(f)
    
    print(f"Model yüklendi: {latest_model.name}")
    print(f"Encoders yüklendi: {latest_encoders.name}")
    
    return model, encoders['marka_encoder'], encoders['model_encoder']

def predict_price(marka, model_name, il, yurus, muherrik):
    """Masin qiymetini predict et"""
    
    # Model ve encoders yukle
    model, marka_encoder, model_encoder = load_latest_model()
    
    print(f"\nInput:")
    print(f"  Marka: {marka}")
    print(f"  Model: {model_name}")
    print(f"  İl: {il}")
    print(f"  Yürüş: {yurus:,} km")
    print(f"  Mühərrik: {muherrik} L")
    
    try:
        # Marka encode
        marka_encoded = marka_encoder.transform([marka])[0]
    except ValueError:
        print(f"\n❌ Xəta: '{marka}' markası tanınmır!")
        print(f"Mövcud markalar: {', '.join(marka_encoder.classes_[:10])}...")
        return None
    
    try:
        # Model encode
        model_encoded = model_encoder.transform([model_name])[0]
    except ValueError:
        print(f"\n❌ Xəta: '{model_name}' modeli tanınmır!")
        # Bu marka ucun modelleri goster
        df = pd.read_csv(Path(__file__).parent / 'car_data.csv', encoding='utf-8')
        available_models = df[df['marka'] == marka]['model'].unique()[:10]
        print(f"{marka} üçün mövcud modellər: {', '.join(available_models)}...")
        return None
    
    # Features hazırla
    features = [[marka_encoded, model_encoded, il, yurus, muherrik]]
    
    # Predict
    predicted_price = model.predict(features)[0]
    
    print(f"\n💰 Predicted Price: {predicted_price:,.0f} AZN")
    
    # Dataset-den benzer mashınların qiymetlerini tap
    df = pd.read_csv(Path(__file__).parent / 'car_data.csv', encoding='utf-8')
    similar = df[
        (df['marka'] == marka) & 
        (df['model'] == model_name) & 
        (df['il'] >= il - 2) & 
        (df['il'] <= il + 2)
    ]
    
    if len(similar) > 0:
        print(f"\n📊 Bənzər maşınlar (dataset-də {len(similar)} ədəd):")
        print(f"  Orta qiymət: {similar['qiymet'].mean():,.0f} AZN")
        print(f"  Min: {similar['qiymet'].min():,.0f} AZN")
        print(f"  Max: {similar['qiymet'].max():,.0f} AZN")
    
    return predicted_price

def predict_from_json(json_str):
    """JSON input-dan predict et (API ucun)"""
    data = json.loads(json_str)
    
    marka = data.get('brand') or data.get('marka')
    model_name = data.get('model')
    il = int(data.get('year') or data.get('il'))
    yurus = int(data.get('mileage') or data.get('yurus'))
    muherrik = float(data.get('engineSize') or data.get('muherrik'))
    
    model, marka_encoder, model_encoder = load_latest_model()
    
    try:
        marka_encoded = marka_encoder.transform([marka])[0]
        model_encoded = model_encoder.transform([model_name])[0]
        features = [[marka_encoded, model_encoded, il, yurus, muherrik]]
        predicted_price = model.predict(features)[0]
        
        return {
            'success': True,
            'predicted_price': max(0, float(predicted_price)),
            'currency': 'AZN'
        }
    except ValueError as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # JSON input (API mode)
        result = predict_from_json(sys.argv[1])
        print(json.dumps(result))
    else:
        # Test mode
        print("=" * 60)
        print("CAR PRICE PREDICTION TEST")
        print("=" * 60)
        
        # Test cases
        test_cases = [
            ('Mercedes', 'E 200', 2020, 50000, 2.0),
            ('BMW', '320', 2019, 80000, 2.0),
            ('Toyota', 'Camry', 2021, 30000, 2.5),
            ('Hyundai', 'Elantra', 2018, 90000, 2.0),
        ]
        
        for marka, model, il, yurus, muherrik in test_cases:
            print("\n" + "-" * 60)
            predict_price(marka, model, il, yurus, muherrik)
        
        print("\n" + "=" * 60)
