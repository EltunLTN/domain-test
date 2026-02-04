"""
Advanced Car Price Prediction
Her marka/modelin ferqli depreciation pattern-lerini nezere alir
"""

import sys
import json
import pickle
import pandas as pd
import numpy as np
from pathlib import Path

def load_latest_advanced_model():
    """En yeni advanced model yukle"""
    script_dir = Path(__file__).parent
    
    model_files = list(script_dir.glob('car_price_model_advanced_*.pkl'))
    encoder_files = list(script_dir.glob('encoders_advanced_*.pkl'))
    stats_files = list(script_dir.glob('brand_stats_*.pkl'))
    
    if not model_files or not encoder_files or not stats_files:
        raise FileNotFoundError("Advanced model faylları tapılmadı! Train edin: python train_model_advanced.py")
    
    latest_model = max(model_files, key=lambda p: p.stat().st_mtime)
    latest_encoders = max(encoder_files, key=lambda p: p.stat().st_mtime)
    latest_stats = max(stats_files, key=lambda p: p.stat().st_mtime)
    
    with open(latest_model, 'rb') as f:
        model = pickle.load(f)
    
    with open(latest_encoders, 'rb') as f:
        encoders = pickle.load(f)
    
    with open(latest_stats, 'rb') as f:
        brand_stats = pickle.load(f)
    
    # Load car_data.csv for lookups
    df = pd.read_csv(script_dir / 'car_data.csv', encoding='utf-8')
    
    return model, encoders, brand_stats, df

def create_prediction_features(marka, model_name, il, yurus, muherrik, encoders, brand_stats, df):
    """Prediction ucun feature-ler yarat"""
    
    current_year = 2026
    yas = current_year - il
    yurus_per_il = yurus / (yas + 1)
    marka_model = f"{marka}_{model_name}"
    
    # Brand/model avg prices
    brand_avg = df[df['marka'] == marka]['qiymet'].mean()
    model_avg = df[(df['marka'] == marka) & (df['model'] == model_name)]['qiymet'].mean()
    
    # Brand new price estimate
    brand_new_df = df[(df['marka'] == marka) & (df['il'] >= 2024)]
    if len(brand_new_df) > 0:
        brand_new_price = brand_new_df['qiymet'].mean()
    else:
        brand_new_price = brand_avg
    
    # Depreciation ratio estimate
    age_factor = 1 - (yas * 0.08)  # Approximate 8% per year
    depreciation_ratio = max(0.1, age_factor)
    
    # Kategoriyalar
    if yas <= 3:
        yas_cat = 'yeni'
    elif yas <= 7:
        yas_cat = 'orta_yeni'
    elif yas <= 15:
        yas_cat = 'orta_kohne'
    else:
        yas_cat = 'kohne'
    
    if yurus <= 50000:
        yurus_cat = 'az'
    elif yurus <= 150000:
        yurus_cat = 'orta'
    elif yurus <= 300000:
        yurus_cat = 'cox'
    else:
        yurus_cat = 'cox_cox'
    
    if muherrik <= 1.8:
        muherrik_cat = 'kicik'
    elif muherrik <= 2.5:
        muherrik_cat = 'orta'
    elif muherrik <= 3.5:
        muherrik_cat = 'boyuk'
    else:
        muherrik_cat = 'cox_boyuk'
    
    # Encode
    try:
        marka_encoded = encoders['marka'].transform([marka])[0]
    except:
        # Unknown brand - use median
        marka_encoded = 0
        brand_avg = df['qiymet'].median()
    
    try:
        model_encoded = encoders['model'].transform([model_name])[0]
    except:
        model_encoded = 0
        model_avg = brand_avg
    
    try:
        marka_model_encoded = encoders['marka_model'].transform([marka_model])[0]
    except:
        marka_model_encoded = 0
    
    try:
        yas_category_encoded = encoders['yas_category'].transform([yas_cat])[0]
    except:
        yas_category_encoded = 0
    
    try:
        yurus_category_encoded = encoders['yurus_category'].transform([yurus_cat])[0]
    except:
        yurus_category_encoded = 0
    
    try:
        muherrik_category_encoded = encoders['muherrik_category'].transform([muherrik_cat])[0]
    except:
        muherrik_category_encoded = 0
    
    # Feature array (train_model_advanced.py-daki feature_cols ile eyni sira)
    features = [[
        marka_encoded,
        model_encoded,
        marka_model_encoded,
        il,
        yas,
        yurus,
        yurus_per_il,
        muherrik,
        brand_avg if not np.isnan(brand_avg) else df['qiymet'].median(),
        model_avg if not np.isnan(model_avg) else brand_avg,
        depreciation_ratio,
        yas_category_encoded,
        yurus_category_encoded,
        muherrik_category_encoded
    ]]
    
    return features, {
        'yas': yas,
        'yurus_per_il': yurus_per_il,
        'brand_avg': brand_avg,
        'model_avg': model_avg,
        'yas_cat': yas_cat,
        'yurus_cat': yurus_cat,
        'muherrik_cat': muherrik_cat
    }

def predict_price(marka, model_name, il, yurus, muherrik, verbose=True):
    """Advanced prediction"""
    
    model, encoders, brand_stats, df = load_latest_advanced_model()
    
    if verbose:
        print(f"\n{'='*60}")
        print(f"ADVANCED PREDICTION")
        print(f"{'='*60}")
        print(f"  Marka: {marka}")
        print(f"  Model: {model_name}")
        print(f"  İl: {il}")
        print(f"  Yürüş: {yurus:,} km")
        print(f"  Mühərrik: {muherrik} L")
    
    # Create features
    features, meta = create_prediction_features(
        marka, model_name, il, yurus, muherrik, 
        encoders, brand_stats, df
    )
    
    # Predict
    predicted_price = model.predict(features)[0]
    predicted_price = max(1000, predicted_price)  # Minimum 1000 AZN
    
    if verbose:
        print(f"\n💰 Predicted Price: {predicted_price:,.0f} AZN")
        print(f"\n📊 Təhlil:")
        print(f"  Yaş: {meta['yas']} il ({meta['yas_cat']})")
        print(f"  İllik yürüş: {meta['yurus_per_il']:,.0f} km")
        print(f"  Yürüş kateqoriyası: {meta['yurus_cat']}")
        print(f"  Mühərrik kateqoriyası: {meta['muherrik_cat']}")
        print(f"  {marka} orta qiymət: {meta['brand_avg']:,.0f} AZN")
        
        if not np.isnan(meta['model_avg']):
            print(f"  {model_name} orta qiymət: {meta['model_avg']:,.0f} AZN")
        
        # Benzer masinlar
        similar = df[
            (df['marka'] == marka) &
            (df['model'] == model_name) &
            (df['il'] >= il - 2) &
            (df['il'] <= il + 2)
        ]
        
        if len(similar) > 0:
            print(f"\n  📈 Dataset-də {len(similar)} bənzər maşın:")
            print(f"     Orta: {similar['qiymet'].mean():,.0f} AZN")
            print(f"     Min: {similar['qiymet'].min():,.0f} AZN")
            print(f"     Max: {similar['qiymet'].max():,.0f} AZN")
    
    return predicted_price

def predict_from_json(json_str):
    """JSON input (API ucun)"""
    data = json.loads(json_str)
    
    marka = data.get('brand') or data.get('marka')
    model_name = data.get('model')
    il = int(data.get('year') or data.get('il'))
    yurus = int(data.get('mileage') or data.get('yurus'))
    muherrik = float(data.get('engineSize') or data.get('muherrik'))
    
    try:
        predicted_price = predict_price(marka, model_name, il, yurus, muherrik, verbose=False)
        
        return {
            'success': True,
            'predicted_price': float(predicted_price),
            'currency': 'AZN',
            'model': 'advanced'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # JSON mode (API)
        result = predict_from_json(sys.argv[1])
        print(json.dumps(result))
    else:
        # Test mode
        print("="*60)
        print("ADVANCED MODEL TEST")
        print("="*60)
        
        test_cases = [
            ('Mercedes', 'E 200', 2020, 50000, 2.0),
            ('Mercedes', 'E 200', 2015, 150000, 2.0),
            ('BMW', '320', 2019, 80000, 2.0),
            ('Toyota', 'Camry', 2021, 30000, 2.5),
            ('Toyota', 'Camry', 2010, 250000, 2.5),
            ('Hyundai', 'Elantra', 2022, 20000, 2.0),
            ('Lada', 'Priora', 2018, 100000, 1.6),
        ]
        
        for marka, model, il, yurus, muherrik in test_cases:
            predict_price(marka, model, il, yurus, muherrik)
            print()
