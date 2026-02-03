"""
ML Model Training Script
Bu script car_data.csv faylından ML model train edir.
Yeni 67,432 məlumat ilə train olunur.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import joblib
import json
from datetime import datetime

class CarPricePredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        # Yeni CSV sütun adlarına uyğun
        self.categorical_columns = ['marka', 'model']
        self.numerical_columns = ['il', 'yurus', 'muherrik']
        
    def load_data(self, filepath='car_data.csv'):
        """CSV-dən məlumatları yükləyir"""
        print(f"Məlumatlar yüklənir: {filepath}")
        df = pd.read_csv(filepath)
        print(f"✓ Yükləndi: {len(df)} sətir, {len(df.columns)} sütun")
        print(f"Sütunlar: {list(df.columns)}")
        
        # İlk 5 sətiri göstər
        print("\nİlk 5 sətir:")
        print(df.head())
        
        return df
    
    def clean_data(self, df):
        """Məlumatları təmizləyir"""
        print("\nMəlumatlar təmizlənir...")
        df_clean = df.copy()
        
        # Null dəyərləri sil
        before = len(df_clean)
        df_clean = df_clean.dropna()
        after = len(df_clean)
        print(f"✓ Null dəyərlər silindi: {before - after} sətir")
        
        # Qeyri-real qiymətləri sil (çox aşağı və ya çox yüksək)
        df_clean = df_clean[df_clean['qiymet'] > 1000]
        df_clean = df_clean[df_clean['qiymet'] < 500000]
        print(f"✓ Qeyri-real qiymətlər silindi")
        
        # Yürüşü int-ə çevir
        df_clean['yurus'] = df_clean['yurus'].astype(int)
        df_clean['il'] = df_clean['il'].astype(int)
        
        # 1990-dan əvvəl və 2026-dan sonra olan maşınları sil
        df_clean = df_clean[(df_clean['il'] >= 1990) & (df_clean['il'] <= 2026)]
        
        print(f"✓ Təmizləndikdən sonra: {len(df_clean)} sətir")
        
        return df_clean
    
    def preprocess_data(self, df):
        """Məlumatları preprocessing edir"""
        print("\nPreprocessing başladı...")
        
        # Kopyasını götür
        df_processed = df.copy()
        
        # Kateqorik dəyərləri encode et
        for col in self.categorical_columns:
            if col in df_processed.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    df_processed[col + '_encoded'] = self.label_encoders[col].fit_transform(df_processed[col].astype(str))
                else:
                    df_processed[col + '_encoded'] = self.label_encoders[col].transform(df_processed[col].astype(str))
        
        # Feature sütunlarını seç
        self.feature_columns = []
        for col in self.categorical_columns:
            if col in df_processed.columns:
                self.feature_columns.append(col + '_encoded')
        for col in self.numerical_columns:
            if col in df_processed.columns:
                self.feature_columns.append(col)
        
        print(f"✓ Preprocessing tamamlandı. Feature sayı: {len(self.feature_columns)}")
        print(f"Features: {self.feature_columns}")
        return df_processed
    
    def train(self, df, target_column='qiymet', test_size=0.2):
        """Modeli train edir"""
        print("\n" + "="*60)
        print("MODEL TRAİNİNG BAŞLADI")
        print("="*60)
        
        # Məlumatları təmizlə
        df_clean = self.clean_data(df)
        
        # Preprocessing
        df_processed = self.preprocess_data(df_clean)
        
        # Features və target
        X = df_processed[self.feature_columns]
        y = df_processed[target_column]
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        print(f"Train data: {len(X_train)} samples")
        print(f"Test data: {len(X_test)} samples")
        
        # Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Model seçimi - Gradient Boosting daha yaxşı nəticələr verir
        print("\nGradient Boosting Regressor train edilir...")
        self.model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=7,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            verbose=1
        )
        
        # Train
        self.model.fit(X_train_scaled, y_train)
        
        # Predictions
        y_train_pred = self.model.predict(X_train_scaled)
        y_test_pred = self.model.predict(X_test_scaled)
        
        # Metrics
        print("\n=== MODEL PERFORMANSI ===")
        print(f"\nTrain Metrics:")
        print(f"  MAE: {mean_absolute_error(y_train, y_train_pred):.2f} AZN")
        print(f"  RMSE: {np.sqrt(mean_squared_error(y_train, y_train_pred)):.2f} AZN")
        print(f"  R²: {r2_score(y_train, y_train_pred):.4f}")
        
        print(f"\nTest Metrics:")
        print(f"  MAE: {mean_absolute_error(y_test, y_test_pred):.2f} AZN")
        print(f"  RMSE: {np.sqrt(mean_squared_error(y_test, y_test_pred)):.2f} AZN")
        print(f"  R²: {r2_score(y_test, y_test_pred):.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nƏn Vacib Features:")
        print(feature_importance.head(10).to_string(index=False))
        
        return {
            'train_mae': mean_absolute_error(y_train, y_train_pred),
            'test_mae': mean_absolute_error(y_test, y_test_pred),
            'train_r2': r2_score(y_train, y_train_pred),
            'test_r2': r2_score(y_test, y_test_pred),
        }
    
    def save_model(self, model_dir='ml_model'):
        """Modeli saxlayır"""
        import os
        os.makedirs(model_dir, exist_ok=True)
        
        # Model
        joblib.dump(self.model, f'{model_dir}/car_price_model.pkl')
        print(f"✓ Model saxlanıldı: {model_dir}/car_price_model.pkl")
        
        # Scaler
        joblib.dump(self.scaler, f'{model_dir}/scaler.pkl')
        print(f"✓ Scaler saxlanıldı: {model_dir}/scaler.pkl")
        
        # Label encoders
        joblib.dump(self.label_encoders, f'{model_dir}/label_encoders.pkl')
        print(f"✓ Label encoders saxlanıldı: {model_dir}/label_encoders.pkl")
        
        # Feature columns və metadata
        metadata = {
            'feature_columns': self.feature_columns,
            'categorical_columns': self.categorical_columns,
            'numerical_columns': self.numerical_columns,
            'trained_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        }
        
        with open(f'{model_dir}/metadata.json', 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        print(f"✓ Metadata saxlanıldı: {model_dir}/metadata.json")
    
    def load_model(self, model_dir='ml_model'):
        """Modeli yükləyir"""
        self.model = joblib.load(f'{model_dir}/car_price_model.pkl')
        self.scaler = joblib.load(f'{model_dir}/scaler.pkl')
        self.label_encoders = joblib.load(f'{model_dir}/label_encoders.pkl')
        
        with open(f'{model_dir}/metadata.json', 'r', encoding='utf-8') as f:
            metadata = json.load(f)
            self.feature_columns = metadata['feature_columns']
            self.categorical_columns = metadata['categorical_columns']
            self.numerical_columns = metadata['numerical_columns']
        
        print("✓ Model yükləndi")
    
    def predict(self, car_data):
        """Bir maşının qiymətini predict edir"""
        # DataFrame-ə çevir
        df = pd.DataFrame([car_data])
        
        # Preprocess
        df_processed = self.preprocess_data(df)
        
        # Features
        X = df_processed[self.feature_columns]
        
        # Scale
        X_scaled = self.scaler.transform(X)
        
        # Predict
        prediction = self.model.predict(X_scaled)[0]
        
        return max(0, prediction)  # Mənfi dəyər olmasın


def main():
    """Ana funksiya"""
    print("=== CAR PRICE PREDICTION MODEL TRAINING ===\n")
    
    # Predictor yaradır
    predictor = CarPricePredictor()
    
    # Məlumatları yükləyir
    df = predictor.load_data()
    
    # Train edir
    metrics = predictor.train(df)
    
    # Saxlayır
    predictor.save_model('ml_model')
    
    print("\n=== TEST PREDICTION ===")
    # Test prediction (yeni struktur)
    test_car = {
        'marka': 'Mercedes',
        'model': 'E 200',
        'il': 2020,
        'yurus': 50000,
        'muherrik': 2.0
    }
    
    predicted_price = predictor.predict(test_car)
    print(f"\nTest Maşın: {test_car['marka']} {test_car['model']} ({test_car['il']})")
    print(f"Predicted Qiymət: {predicted_price:,.0f} AZN")
    
    print("\n🎉 Model train tamamlandı!")
    print("Model faylları 'ml_model/' qovluğunda saxlanıldı")


if __name__ == "__main__":
    main()
