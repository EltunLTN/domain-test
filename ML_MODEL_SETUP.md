# 🚗 Avtomobil Qiymət Hesablama - ML Model Setup

## 📋 Addım-addım təlimat

### 1️⃣ Python Environment Hazırlamaq

```bash
# Python 3.9+ yükləyin (python.org)

# Virtual environment yaradın
cd scripts
python -m venv venv

# Activate edin
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Package-ləri yükləyin
pip install -r requirements.txt
```

### 2️⃣ Turbo.az-dan Məlumat Toplamaq (Scraping)

**⚠️ VACIB:** Scraping etməzdən əvvəl turbo.az-ın HTML strukturunu yoxlayın. Sayt strukturu dəyişə bilər.

```bash
# Scraper scripti işə salın
python scrape_turbo_az.py
```

**Nə edəcək:**
- turbo.az saytından ~2000-3000 avtomobil məlumatını scrape edəcək
- `car_data_raw.csv` faylı yaradacaq (xam məlumatlar)
- `car_data_cleaned.csv` faylı yaradacaq (təmizlənmiş məlumatlar)

**Scrape olunan məlumatlar:**
- Marka (brand)
- Model
- İstehsal ili (year)
- Yürüş (mileage)
- Qiymət (price)
- Mühərrik həcmi (engine_size)
- Yanacaq növü (fuel_type)
- Sürətlər qutusu (transmission)
- Şəhər (city)

### 3️⃣ ML Model Train Etmək

```bash
# Model train scripti işə salın
python train_model.py
```

**Nə edəcək:**
- `car_data_cleaned.csv` faylını oxuyacaq
- Gradient Boosting Regressor model train edəcək
- Model performansını göstərəcək (MAE, RMSE, R²)
- Model fayllarını `ml_model/` qovluğunda saxlayacaq:
  - `car_price_model.pkl` - ML model
  - `scaler.pkl` - Feature scaler
  - `label_encoders.pkl` - Kateqorik encoder-lər
  - `metadata.json` - Model metadata

**Gözlənilən performans:**
- MAE (Mean Absolute Error): ~2000-3000 AZN
- R² Score: ~0.85-0.92

### 4️⃣ Model-i Test Etmək

```bash
# Test prediction
python predict_price.py '{"brand":"Mercedes-Benz","model":"E 200","year":2020,"mileage":50000,"engine_size":2.0,"fuel_type":"benzin","transmission":"avtomat","condition":"yaxsi","city":"Bakı","owners":1}'
```

### 5️⃣ Next.js-ə İnteqrasiya

Model train olunduqdan sonra:

1. **ml_model/** qovluğunu **scripts/** içində saxlayın
2. Next.js server API-dan avtomatik istifadə edəcək
3. Əgər model yoxdursa, fallback hesablama işləyəcək

```bash
# Next.js-i başladın
pnpm dev
```

4. Brauzerdə açın: http://localhost:3000/car-valuation
5. Maşın məlumatlarını daxil edin
6. "Qiyməti Hesabla" düyməsini basın

---

## 🔧 Alternativ: Hazır Dataset İstifadə Etmək

Əgər scraping işləməzsə, hazır dataset istifadə edin:

1. Kaggle-dan Azərbaycan avtomobil dataseti axtarın
2. Və ya CSV faylını əllə hazırlayın:

```csv
brand,model,year,mileage,engine_size,fuel_type,transmission,condition,city,price
Mercedes-Benz,E 200,2020,50000,2.0,benzin,avtomat,yaxsi,Bakı,45000
BMW,320i,2019,70000,2.0,benzin,avtomat,yaxsi,Bakı,40000
Toyota,Camry,2018,80000,2.5,benzin,avtomat,yaxsi,Bakı,35000
...
```

3. `car_data_cleaned.csv` olaraq saxlayın
4. `python train_model.py` işə salın

---

## 📊 Model Təkmilləşdirmə

**Daha yaxşı nəticələr üçün:**

1. **Daha çox məlumat toplayın** (10,000+ idealdir)
2. **Əlavə feature-lər əlavə edin:**
   - Rəng (color)
   - Ban növü (body_type)
   - Vəziyyət (accident_history)
   - Sahiblərin sayı (owners)

3. **Hiperparametr tuning:**
```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [100, 200, 300],
    'learning_rate': [0.05, 0.1, 0.15],
    'max_depth': [5, 7, 10],
}

grid_search = GridSearchCV(GradientBoostingRegressor(), param_grid, cv=5)
grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_
```

---

## 🐛 Troubleshooting

### Python script işləmir
```bash
# Python yolunu yoxlayın
where python
# və ya
which python

# Package-lərin yüklənməsini yoxlayın
pip list
```

### Scraping işləmir
- turbo.az-ın HTML strukturu dəyişmiş ola bilər
- `scrape_turbo_az.py`-də selector-ları yeniləyin
- Browser DevTools ilə yeni class name-ləri tapın

### Model accuracy aşağıdır
- Daha çox məlumat toplayın
- Outlier-ləri silin
- Feature engineering edin
- Fərqli model-lər sınayın (XGBoost, LightGBM)

---

## 📈 Production Deploy

Vercel-ə deploy edərkən:

1. **Python runtime yoxdur** - Vercel Node.js-dir
2. **İki variant:**

**Variant A: Serverless Function (Python)**
- Vercel Python runtime istifadə edin
- `api/predict.py` yaradın

**Variant B: External API (Tövsiyə olunur)**
- Model-i ayrı Python server-də host edin (Flask/FastAPI)
- Heroku, Railway və ya AWS Lambda istifadə edin
- Next.js API-dan external API-ya request göndərin

---

## 🎯 Nəticə

✅ Scraping script hazırdır
✅ ML training script hazırdır  
✅ Prediction API hazırdır
✅ Frontend UI hazırdır

**Qalan addım:** 
1. `python scrape_turbo_az.py` işə salın
2. `python train_model.py` işə salın
3. Model hazır! 🎉
