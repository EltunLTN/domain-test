"""
Hər model üçün ayrı ML model ilə qiymət proqnozu.
Mercedes E 200, Toyota Camry, Lada Priora - hər birinin öz modeli var.
"""

import pandas as pd
import numpy as np
import pickle
import json
import sys
import os
import glob

def load_latest_models():
    """Ən son model fayllarını yüklə"""
    
    # ML modellər
    ml_files = sorted(glob.glob('per_model_ml_*.pkl'), reverse=True)
    if not ml_files:
        raise FileNotFoundError("per_model_ml_*.pkl tapılmadı!")
    
    with open(ml_files[0], 'rb') as f:
        ml_models = pickle.load(f)
    
    # Stats
    stats_files = sorted(glob.glob('per_model_stats_*.pkl'), reverse=True)
    if not stats_files:
        raise FileNotFoundError("per_model_stats_*.pkl tapılmadı!")
    
    with open(stats_files[0], 'rb') as f:
        model_stats = pickle.load(f)
    
    return ml_models, model_stats

def predict_price(marka, model_name, il, yurus, muherrik, verbose=True):
    """
    Verilən parametrlərə əsasən qiymət proqnozu ver.
    
    Args:
        marka: Marka adı (Mercedes, Toyota, LADA)
        model_name: Model adı (E 200, Camry, 2107)
        il: İstehsal ili
        yurus: Yürüş (km)
        muherrik: Mühərrik həcmi (L)
        verbose: Ətraflı çıxış
    
    Returns:
        Proqnoz qiymət (AZN)
    """
    
    ml_models, model_stats = load_latest_models()
    
    # Marka + model birləşdir
    full_model_name = f"{marka} {model_name}"
    
    if verbose:
        print(f"\n{'='*50}")
        print(f"🚗 {full_model_name}")
        print(f"   İl: {il}, Yürüş: {yurus:,} km, Mühərrik: {muherrik}L")
        print(f"{'='*50}")
    
    # Model tapılmadısa
    if full_model_name not in model_stats:
        if verbose:
            print(f"⚠️ Model tapılmadı: {full_model_name}")
            print(f"   Marka ortalaması hesablanır...")
        
        # Eyni marka modellərinin ortalamasını tap
        marka_models = [k for k in model_stats.keys() if k.startswith(marka + ' ')]
        
        if marka_models:
            avg_price = np.mean([model_stats[m]['avg_price'] for m in marka_models])
            if verbose:
                print(f"   Marka ortalaması: {avg_price:,.0f} AZN ({len(marka_models)} model)")
            return avg_price
        else:
            if verbose:
                print(f"❌ Marka da tapılmadı!")
            return None
    
    stats = model_stats[full_model_name]
    
    if verbose:
        print(f"\n📊 Dataset məlumatları:")
        print(f"   Maşın sayı: {stats['n_samples']}")
        print(f"   Ortalama qiymət: {stats['avg_price']:,.0f} AZN")
        print(f"   Min-Max: {stats['min_price']:,.0f} - {stats['max_price']:,.0f} AZN")
        print(f"   Model tipi: {stats['model_type']}")
    
    # ML model varsa
    if stats['model_type'] != 'stats_only' and full_model_name in ml_models:
        ml = ml_models[full_model_name]
        
        # Xüsusiyyətlər yarat
        yas = 2026 - il
        yurus_per_il = yurus / (yas + 1)
        
        features = pd.DataFrame({
            'il': [il],
            'yurus': [yurus],
            'muherrik': [muherrik],
            'yas': [yas],
            'yurus_per_il': [yurus_per_il]
        })
        
        X_scaled = ml['scaler'].transform(features)
        predicted_price = ml['model'].predict(X_scaled)[0]
        
        # Qiyməti məntiqli aralıqda saxla
        min_allowed = stats['min_price'] * 0.5
        max_allowed = stats['max_price'] * 1.5
        predicted_price = np.clip(predicted_price, min_allowed, max_allowed)
        
        if verbose:
            print(f"\n🎯 ML Proqnozu: {predicted_price:,.0f} AZN")
            if stats['mae']:
                print(f"   Model MAE: ±{stats['mae']:,.0f} AZN")
                print(f"   Model R²: {stats['r2']:.4f}")
        
        return predicted_price
    
    else:
        # ML model yoxdur - statistika ilə hesabla
        avg_price = stats['avg_price']
        
        # Yaş düzəlişi
        avg_il = stats['avg_il']
        il_diff = il - avg_il
        
        # Hər il üçün ~5% dəyişiklik
        il_factor = 1 + (il_diff * 0.05)
        
        # Yürüş düzəlişi
        avg_yurus = stats['avg_yurus']
        if avg_yurus > 0:
            yurus_ratio = yurus / avg_yurus
            yurus_factor = 1 - ((yurus_ratio - 1) * 0.15)  # Hər 2x yürüş üçün 15% azalma
        else:
            yurus_factor = 1
        
        # Düzəliş tətbiq et
        adjusted_price = avg_price * il_factor * yurus_factor
        
        # Məntiqli aralıqda saxla
        adjusted_price = np.clip(adjusted_price, stats['min_price'] * 0.5, stats['max_price'] * 1.5)
        
        if verbose:
            print(f"\n🎯 Statistik Proqnoz: {adjusted_price:,.0f} AZN")
            print(f"   (ML model yoxdur - {stats['n_samples']} maşın az sayıdır)")
        
        return adjusted_price


def predict_from_json(json_str):
    """API üçün JSON ilə proqnoz"""
    try:
        data = json.loads(json_str)
        
        marka = data.get('brand') or data.get('marka')
        model_name = data.get('model')
        il = data.get('year') or data.get('il')
        yurus = data.get('mileage') or data.get('yurus') or 0
        muherrik = data.get('engineSize') or data.get('muherrik')
        
        # Validate
        if not marka or not model_name or il is None or muherrik is None:
            return json.dumps({
                'success': False,
                'error': f'Missing fields: marka={marka}, model={model_name}, il={il}, muherrik={muherrik}',
                'model': 'per_model'
            })
        
        il = int(il)
        yurus = int(yurus)
        muherrik = float(muherrik)
        
        predicted_price = predict_price(marka, model_name, il, yurus, muherrik, verbose=False)
        
        if predicted_price is None:
            return json.dumps({
                'success': False,
                'error': 'Model tapılmadı',
                'model': 'per_model'
            })
        
        # Model stats-dan əlavə məlumat al
        ml_models, model_stats = load_latest_models()
        full_model_name = f"{marka} {model_name}"
        
        confidence = 'orta'
        model_type = 'unknown'
        sample_count = 0
        
        if full_model_name in model_stats:
            stats = model_stats[full_model_name]
            sample_count = stats['n_samples']
            model_type = stats['model_type']
            
            if stats['model_type'] == 'random_forest':
                confidence = 'çox yüksək'
            elif stats['model_type'] == 'linear_regression':
                confidence = 'yüksək'
            else:
                confidence = 'orta'
        
        return json.dumps({
            'success': True,
            'predicted_price': float(predicted_price),
            'currency': 'AZN',
            'model': 'per_model',
            'model_type': model_type,
            'confidence': confidence,
            'sample_count': sample_count
        })
        
    except Exception as e:
        return json.dumps({
            'success': False,
            'error': str(e),
            'model': 'per_model'
        })


def main():
    """Test və ya API rejimi"""
    
    if len(sys.argv) > 1:
        # JSON argument varsa - API rejimi
        # Bütün argumentləri birləşdir (boşluqlu JSON üçün)
        json_str = ' '.join(sys.argv[1:])
        
        # Escaped quotes düzəlt
        json_str = json_str.replace('\\"', '"')
        
        # Əgər başında/sonunda tək dırnaq varsa sil
        if json_str.startswith("'") and json_str.endswith("'"):
            json_str = json_str[1:-1]
        
        result = predict_from_json(json_str)
        print(result)
    else:
        # Test rejimi
        print("\n" + "=" * 60)
        print("HƏR MODEL ÜÇÜN AYRI QİYMƏT PROQNOZU")
        print("=" * 60)
        
        test_cases = [
            ('Mercedes', 'E 200', 2020, 50000, 2.0),
            ('Mercedes', 'E 200', 2015, 150000, 2.0),
            ('Mercedes', 'S 500', 2021, 30000, 4.0),
            ('Toyota', 'Camry', 2021, 30000, 2.5),
            ('Toyota', 'Camry', 2010, 250000, 2.5),
            ('LADA (VAZ)', '2107', 2018, 100000, 1.6),
            ('LADA (VAZ)', '2107', 2012, 200000, 1.5),
            ('BMW', 'X5', 2019, 80000, 3.0),
            ('Hyundai', 'Elantra', 2022, 20000, 2.0),
            ('Porsche', 'Cayenne', 2020, 40000, 3.0),
            ('Lamborghini', 'Urus', 2025, 0, 4.0),
        ]
        
        print("\n🧪 TEST NƏTİCƏLƏRİ:")
        
        for marka, model_name, il, yurus, muherrik in test_cases:
            predict_price(marka, model_name, il, yurus, muherrik)


if __name__ == '__main__':
    main()
