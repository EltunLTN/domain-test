"""
Advanced Car Price Prediction
Her marka/model ucun ozellikli predictions
"""

import sys
import json
import pickle
import pandas as pd
import numpy as np
from pathlib import Path

def load_latest_model():
    """En yeni advanced model ve encoders yukle"""
    script_dir = Path(__file__).parent
    
    # En yeni model fayllarini tap
    model_files = list(script_dir.glob('car_price_model_*.pkl'))
    encoder_files = list(script_dir.glob('encoders_*.pkl'))
    metadata_files = list(script_dir.glob('model_metadata_*.json'))
    
    if not model_files or not encoder_files:
        raise FileNotFoundError("Model fayllari tapilmadi! Train edin: python train_advanced.py")
    
    # En yeni faylları seç
    latest_model = max(model_files, key=lambda p: p.stat().st_mtime)
    latest_encoders = max(encoder_files, key=lambda p: p.stat().st_mtime)
    latest_metadata = max(metadata_files, key=lambda p: p.stat().st_mtime) if metadata_files else None
    
    # Yükle
    with open(latest_model, 'rb') as f:
        model = pickle.load(f)
    
    with open(latest_encoders, 'rb') as f:
        encoders = pickle.load(f)
    
    metadata = None
    if latest_metadata:
        with open(latest_metadata, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
    
    print(f"Model yuklendi: {latest_model.name}")
    if metadata and 'version' in metadata:
        print(f"Version: {metadata['version']}")
    
    return model, encoders, metadata

def create_features_for_prediction(marka, model_name, il, yurus, muherrik):
    """Prediction ucun features hazirla"""
    current_year = 2026
    yas = current_year - il
    yillik_yurus = yurus / max(yas, 1)
    muherrik_yas_ratio = muherrik / max(yas, 1)
    log_yurus = np.log1p(yurus)
    log_muherrik = np.log1p(muherrik)
    
    # Yurus kategorisi
    if yurus < 50000:
        yurus_kategori = 'az'
    elif yurus < 100000:
        yurus_kategori = 'orta'
    elif yurus < 200000:
        yurus_kategori = 'cox'
    else:
        yurus_kategori = 'coxcox'
    
    # Yas kategorisi
    if yas < 3:
        yas_kategori = 'yeni'
    elif yas < 7:
        yas_kategori = 'yaxsi'
    elif yas < 15:
        yas_kategori = 'orta'
    else:
        yas_kategori = 'kohne'
    
    return {
        'yas': yas,
        'yillik_yurus': yillik_yurus,
        'muherrik_yas_ratio': muherrik_yas_ratio,
        'log_yurus': log_yurus,
        'log_muherrik': log_muherrik,
        'yurus_kategori': yurus_kategori,
        'yas_kategori': yas_kategori,
        'marka_model_combo': f"{marka}_{model_name}"
    }

def predict_price(marka, model_name, il, yurus, muherrik):
    """Advanced masin qiymetini predict et"""
    
    # Model ve encoders yukle
    model, encoders, metadata = load_latest_model()
    
    print(f"\nInput:")
    print(f"  Marka: {marka}")
    print(f"  Model: {model_name}")
    print(f"  Il: {il}")
    print(f"  Yurus: {yurus:,} km")
    print(f"  Muherrik: {muherrik} L")
    
    # Features hazirla
    features_dict = create_features_for_prediction(marka, model_name, il, yurus, muherrik)
    
    try:
        # Encode marka
        marka_encoded = encoders['marka_encoder'].transform([marka])[0]
    except ValueError:
        print(f"\n❌ Xeta: '{marka}' markasi taninmir!")
        print(f"Movcud markalar: {', '.join(encoders['marka_encoder'].classes_[:10])}...")
        return None
    
    try:
        # Encode model
        model_encoded = encoders['model_encoder'].transform([model_name])[0]
    except ValueError:
        print(f"\n❌ Xeta: '{model_name}' modeli taninmir!")
        df = pd.read_csv(Path(__file__).parent / 'car_data.csv', encoding='utf-8')
        available_models = df[df['marka'] == marka]['model'].unique()[:10]
        if len(available_models) > 0:
            print(f"{marka} ucun movcud modeller: {', '.join(available_models)}...")
        return None
    
    try:
        # Encode marka-model combo
        combo_encoded = encoders['combo_encoder'].transform([features_dict['marka_model_combo']])[0]
    except ValueError:
        # Eger bu kombinasyon yoxdursa, default deyeri istifade et
        combo_encoded = 0
    
    try:
        # Encode kategoriyalar
        yurus_kat_encoded = encoders['yurus_kat_encoder'].transform([features_dict['yurus_kategori']])[0]
        yas_kat_encoded = encoders['yas_kat_encoder'].transform([features_dict['yas_kategori']])[0]
    except:
        yurus_kat_encoded = 0
        yas_kat_encoded = 0
    
    # Features array hazirla
    feature_values = [
        marka_encoded,
        model_encoded,
        combo_encoded,
        il,
        features_dict['yas'],
        yurus,
        features_dict['yillik_yurus'],
        features_dict['log_yurus'],
        muherrik,
        features_dict['log_muherrik'],
        features_dict['muherrik_yas_ratio'],
        yurus_kat_encoded,
        yas_kat_encoded
    ]
    
    features = [feature_values]
    
    # Predict
    predicted_price = model.predict(features)[0]
    
    print(f"\n💰 Predicted Price: {predicted_price:,.0f} AZN")
    print(f"   Yas: {features_dict['yas']} il")
    print(f"   Yillik yurus: {features_dict['yillik_yurus']:,.0f} km")
    print(f"   Kateqoriya: {features_dict['yas_kategori']} / {features_dict['yurus_kategori']}")
    
    # Dataset-den benzer mashınların qiymetlerini tap
    df = pd.read_csv(Path(__file__).parent / 'car_data.csv', encoding='utf-8')
    similar = df[
        (df['marka'] == marka) & 
        (df['model'] == model_name)
    ]
    
    if len(similar) > 0:
        print(f"\n📊 Dataset-de {marka} {model_name} ({len(similar)} eded):")
        print(f"  Orta qiymet: {similar['qiymet'].mean():,.0f} AZN")
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
    
    model, encoders, metadata = load_latest_model()
    
    try:
        # Features hazirla
        features_dict = create_features_for_prediction(marka, model_name, il, yurus, muherrik)
        
        # Encode
        marka_encoded = encoders['marka_encoder'].transform([marka])[0]
        model_encoded = encoders['model_encoder'].transform([model_name])[0]
        
        try:
            combo_encoded = encoders['combo_encoder'].transform([features_dict['marka_model_combo']])[0]
        except:
            combo_encoded = 0
        
        try:
            yurus_kat_encoded = encoders['yurus_kat_encoder'].transform([features_dict['yurus_kategori']])[0]
            yas_kat_encoded = encoders['yas_kat_encoder'].transform([features_dict['yas_kategori']])[0]
        except:
            yurus_kat_encoded = 0
            yas_kat_encoded = 0
        
        # Features
        feature_values = [
            marka_encoded, model_encoded, combo_encoded,
            il, features_dict['yas'], yurus,
            features_dict['yillik_yurus'], features_dict['log_yurus'],
            muherrik, features_dict['log_muherrik'],
            features_dict['muherrik_yas_ratio'],
            yurus_kat_encoded, yas_kat_encoded
        ]
        
        features = [feature_values]
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
        print("ADVANCED CAR PRICE PREDICTION TEST")
        print("=" * 60)
        
        # Test cases - screenshot-dan
        test_cases = [
            ('Mercedes', 'E 240', 2002, 280000, 2.6),  # Screenshot example
            ('Toyota', 'Camry', 2021, 30000, 2.5),
            ('BMW', '320', 2019, 80000, 2.0),
        ]
        
        for marka, model, il, yurus, muherrik in test_cases:
            print("\n" + "-" * 60)
            predict_price(marka, model, il, yurus, muherrik)
        
        print("\n" + "=" * 60)
