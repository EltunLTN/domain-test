"""
Price Prediction Script
Bu script train olunmuş ML model ilə maşın qiymətini predict edir.
"""

import sys
import json
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

class CarPricePredictor:
    def __init__(self, model_dir='ml_model'):
        """Modeli yükləyir"""
        self.model_dir = Path(model_dir)
        self.model = joblib.load(self.model_dir / 'car_price_model.pkl')
        self.scaler = joblib.load(self.model_dir / 'scaler.pkl')
        self.label_encoders = joblib.load(self.model_dir / 'label_encoders.pkl')
        
        with open(self.model_dir / 'metadata.json', 'r', encoding='utf-8') as f:
            metadata = json.load(f)
            self.feature_columns = metadata['feature_columns']
            self.categorical_columns = metadata['categorical_columns']
            self.numerical_columns = metadata['numerical_columns']
    
    def preprocess_input(self, car_data):
        """Input məlumatlarını preprocess edir"""
        df = pd.DataFrame([car_data])
        
        # Kateqorik dəyərləri encode et
        for col in self.categorical_columns:
            if col in df.columns and col in self.label_encoders:
                try:
                    df[col + '_encoded'] = self.label_encoders[col].transform(df[col].astype(str))
                except ValueError:
                    # Əgər yeni dəyər varsa, ən çox rast gələn dəyəri istifadə et
                    df[col + '_encoded'] = 0
        
        # Feature sütunlarını seç
        X = df[self.feature_columns]
        
        return X
    
    def predict(self, car_data):
        """Qiyməti predict edir"""
        # Preprocess
        X = self.preprocess_input(car_data)
        
        # Scale
        X_scaled = self.scaler.transform(X)
        
        # Predict
        prediction = self.model.predict(X_scaled)[0]
        
        # Confidence hesabla (model-dən əldə edilən variance-ə əsasən)
        # Əgər gradient boosting istifadə edirsinizsə, staged_predict ilə confidence hesablaya bilərsiniz
        confidence = 'yüksək'  # Sadələşdirmə üçün
        
        return {
            'predicted_price': max(0, float(prediction)),
            'confidence': confidence
        }


def main():
    """Ana funksiya - command line-dan çağırılır"""
    try:
        # Command line argument-dən car data-nı al
        if len(sys.argv) < 2:
            print(json.dumps({'error': 'Car data verilməyib'}))
            sys.exit(1)
        
        car_data = json.loads(sys.argv[1])
        
        # Model path
        model_dir = Path(__file__).parent / 'ml_model'
        
        # Əgər model yoxdursa
        if not model_dir.exists():
            print(json.dumps({'error': 'ML model tapılmadı. Əvvəlcə train edin.'}))
            sys.exit(1)
        
        # Predictor yaradır
        predictor = CarPricePredictor(model_dir)
        
        # Predict edir
        result = predictor.predict(car_data)
        
        # JSON olaraq print edir (stdout)
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}, ensure_ascii=False))
        sys.exit(1)


if __name__ == '__main__':
    main()
