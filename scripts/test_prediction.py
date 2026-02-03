from train_model import CarPricePredictor

# Load model
p = CarPricePredictor()
p.load_model('ml_model')

# Test predictions
test_cars = [
    {'marka': 'Mercedes', 'model': 'E 200', 'il': 2020, 'yurus': 50000, 'muherrik': 2.0},
    {'marka': 'BMW', 'model': '320', 'il': 2019, 'yurus': 80000, 'muherrik': 2.0},
    {'marka': 'Toyota', 'model': 'Camry', 'il': 2021, 'yurus': 30000, 'muherrik': 2.5},
]

print("\n=== TEST PREDICTIONS ===\n")
for car in test_cars:
    price = p.predict(car)
    print(f"{car['marka']} {car['model']} ({car['il']}) - {car['yurus']} km - {car['muherrik']}L")
    print(f"Predicted: {price:,.0f} AZN\n")
