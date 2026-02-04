"""
Logaritmik transformasiya ilə qiymət proqnozu.
"""

import pandas as pd
import numpy as np
import pickle
import json
import sys
import os
import glob

def load_latest_model():
    """Ən son logaritmik modeli yüklə"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    model_files = sorted(glob.glob(os.path.join(script_dir, 'car_price_model_log_*.pkl')), reverse=True)
    if not model_files:
        raise FileNotFoundError("car_price_model_log_*.pkl tapılmadı!")
    
    with open(model_files[0], 'rb') as f:
        pipeline = pickle.load(f)
    
    return pipeline


def predict_price(marka, model_name, il, yurus, muherrik, verbose=True):
    """
    Qiymət proqnozu ver.
    
    Returns:
        Proqnoz qiymət (AZN)
    """
    
    pipeline = load_latest_model()
    
    # Input data
    input_data = pd.DataFrame([{
        'marka': marka,
        'model': model_name,
        'il': int(il),
        'yurus': int(yurus),
        'muherrik': float(muherrik)
    }])
    
    # Proqnoz (logaritmik)
    log_prediction = pipeline.predict(input_data)
    
    # Logaritmadan geri çevir
    prediction = np.expm1(log_prediction)[0]
    
    if verbose:
        print(f"\n{'='*50}")
        print(f"🚗 {marka} {model_name}")
        print(f"   İl: {il}, Yürüş: {yurus:,} km, Mühərrik: {muherrik}L")
        print(f"{'='*50}")
        print(f"\n🎯 Proqnoz: {prediction:,.0f} AZN")
    
    return prediction


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
                'model': 'log_transform'
            })
        
        il = int(il)
        yurus = int(yurus)
        muherrik = float(muherrik)
        
        predicted_price = predict_price(marka, model_name, il, yurus, muherrik, verbose=False)
        
        return json.dumps({
            'success': True,
            'predicted_price': float(predicted_price),
            'currency': 'AZN',
            'model': 'log_transform',
            'confidence': 'yüksək'
        })
        
    except Exception as e:
        return json.dumps({
            'success': False,
            'error': str(e),
            'model': 'log_transform'
        })


def main():
    """Test və ya API rejimi"""
    
    if len(sys.argv) > 1:
        # JSON argument
        json_str = ' '.join(sys.argv[1:])
        json_str = json_str.replace('\\"', '"')
        if json_str.startswith("'") and json_str.endswith("'"):
            json_str = json_str[1:-1]
        
        result = predict_from_json(json_str)
        print(result)
    else:
        # Test rejimi
        print("\n" + "=" * 60)
        print("LOGARİTMİK MODEL İLƏ QİYMƏT PROQNOZU")
        print("=" * 60)
        
        test_cases = [
            ('Lamborghini', 'Urus', 2025, 0, 4.0),
            ('Lamborghini', 'Urus', 2021, 6000, 4.0),
            ('Mercedes', 'E 200', 2020, 50000, 2.0),
            ('Mercedes', 'E 200', 2015, 150000, 2.0),
            ('Toyota', 'Camry', 2021, 30000, 2.5),
            ('Toyota', 'Camry', 2010, 250000, 2.5),
            ('LADA (VAZ)', '2107', 2018, 100000, 1.6),
            ('LADA (VAZ)', '2107', 2012, 200000, 1.5),
            ('BMW', 'X5', 2019, 80000, 3.0),
            ('Hyundai', 'Elantra', 2022, 20000, 2.0),
            ('Porsche', 'Cayenne', 2020, 40000, 3.0),
            ('Rolls-Royce', 'Cullinan', 2023, 5000, 6.75),
        ]
        
        print("\n🧪 TEST NƏTİCƏLƏRİ:")
        
        for marka, model_name, il, yurus, muherrik in test_cases:
            predict_price(marka, model_name, il, yurus, muherrik)


if __name__ == '__main__':
    main()
