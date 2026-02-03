# ML Model Performance Report

## Dataset Information
- **Source**: car_data.csv
- **Total Records**: 67,430 cars
- **After Cleaning**: 66,606 cars (removed 824 outliers)
- **Columns**: 6 (marka, model, il, yurus, muherrik, qiymet)

## Data Structure
```
marka     - Maşın markası (Brand)
model     - Maşın modeli (Model)
il        - İstehsal ili (Year)
yurus     - Kilometr (Mileage in km)
muherrik  - Mühərrik həcmi (Engine size in L)
qiymet    - Qiymət (Price in AZN)
```

## Training Results

### Previous Model (1,524 cars)
- **Test R²**: 0.7600
- **Test MAE**: 8,760 AZN
- **Features**: 11 columns

### New Model (66,606 cars)
- **Test R²**: 0.9731 ✅ (+28% improvement)
- **Test MAE**: 3,297 AZN ✅ (-62% error reduction)
- **Train R²**: 0.9818
- **Train MAE**: 2,987 AZN
- **Train RMSE**: 5,884 AZN
- **Test RMSE**: 7,296 AZN
- **Features**: 5 columns (simpler, more focused)

## Feature Importance
1. **muherrik** (46.3%) - Engine size is the most important factor
2. **il** (24.1%) - Year is second most important
3. **marka_encoded** (12.1%) - Brand matters
4. **yurus** (10.4%) - Mileage affects price
5. **model_encoded** (7.2%) - Specific model has some effect

## Top Brands in Dataset
1. Mercedes - 8,322 cars
2. Hyundai - 7,562 cars
3. Toyota - 5,745 cars
4. Kia - 5,563 cars
5. BMW - 4,910 cars
6. Changan - 4,865 cars
7. LADA - 3,535 cars
8. Chevrolet - 2,853 cars
9. Ford - 2,774 cars
10. Land (Rover) - 2,630 cars

## Sample Predictions
- **Mercedes E 200 (2020)** - 50k km - 2.0L → **69,273 AZN**
- **BMW 320 (2019)** - 80k km - 2.0L → **38,770 AZN**
- **Toyota Camry (2021)** - 30k km - 2.5L → **50,077 AZN**

## Model Files
- `ml_model/car_price_model.pkl` - Gradient Boosting Regressor
- `ml_model/scaler.pkl` - StandardScaler
- `ml_model/label_encoders.pkl` - LabelEncoders for marka/model
- `ml_model/metadata.json` - Feature columns and metadata

## Deployment
The model is ready for production use. The API route automatically uses:
- **Development**: Python ML model
- **Production**: Enhanced fallback calculation (when Python is unavailable)

Both methods now use the new Azerbaijani column names (marka, model, il, yurus, muherrik).

## Key Improvements
✅ 44x more training data (1,524 → 66,606 cars)  
✅ 28% better accuracy (R² 0.76 → 0.97)  
✅ 62% lower error (MAE 8,760 → 3,297 AZN)  
✅ Simpler feature set (11 → 5 columns)  
✅ More reliable predictions  
✅ Better coverage of car market
