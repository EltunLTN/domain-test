import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brand,
      model,
      year,
      mileage,
      engineSize,
      fuelType,
      transmission,
      condition,
      color,
      owners,
    } = body;

    // Validate required fields
    if (!brand || !model || !year || !mileage || !engineSize) {
      return NextResponse.json(
        { error: 'Bütün məlumatlar doldurulmalıdır' },
        { status: 400 }
      );
    }

    // Check if running in production (Vercel doesn't support Python execution)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

    if (isProduction) {
      // Use enhanced fallback in production
      const price = calculateEnhancedPrice(body);
      
      return NextResponse.json({
        success: true,
        prediction: {
          estimated_price: price,
          min_price: Math.round(price * 0.85),
          max_price: Math.round(price * 1.15),
          confidence: 'orta',
        },
      });
    }

    // Try to use Python ML model in development
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'predict_price.py');
      
      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        throw new Error('Python script tapılmadı');
      }

      // Prepare car data for Python script (car_data.csv strukturu)
      const carData = {
        brand: brand,
        model: model,
        year: parseInt(year),
        mileage: parseInt(mileage),
        engineSize: parseFloat(engineSize),
      };

      const carDataJson = JSON.stringify(carData).replace(/"/g, '\\"');

      // Run Python prediction script
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const { stdout, stderr } = await execAsync(
        `cd "${path.join(process.cwd(), 'scripts')}" && ${pythonCmd} predict_price.py "${carDataJson}"`,
        { maxBuffer: 1024 * 1024 }
      );

      if (stderr && !stdout) {
        console.error('Python stderr:', stderr);
        throw new Error(stderr);
      }

      // Parse prediction result - son sətri tap (JSON)
      const lines = stdout.trim().split('\n');
      const jsonLine = lines[lines.length - 1];
      const result = JSON.parse(jsonLine);

      if (!result.success) {
        throw new Error(result.error || 'Prediction uğursuz oldu');
      }

      return NextResponse.json({
        success: true,
        prediction: {
          estimated_price: Math.round(result.predicted_price),
          min_price: Math.round(result.predicted_price * 0.85),
          max_price: Math.round(result.predicted_price * 1.15),
          confidence: 'yüksək', // ML model istifadə edilir
        },
      });
    } catch (pythonError: any) {
      console.error('Python execution error:', pythonError);
      // Fall back to enhanced calculation
      const price = calculateEnhancedPrice(body);
      
      return NextResponse.json({
        success: true,
        prediction: {
          estimated_price: price,
          min_price: Math.round(price * 0.85),
          max_price: Math.round(price * 1.15),
          confidence: 'orta', // Fallback formula istifadə edilir
        },
      });
    }
  } catch (error: any) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.' },
      { status: 500 }
    );
  }
}

function calculateEnhancedPrice(data: any): number {
  // Enhanced calculation based on real market data patterns
  const {
    brand = '',
    model = '',
    year = 2015,
    mileage = 100000,
    engineSize = 1.6,
    condition = 'yaxsi',
    fuelType = 'benzin',
    transmission = 'avtomat',
  } = data;

  // Brand base prices (based on turbo.az data analysis)
  const brandPrices: { [key: string]: number } = {
    'Mercedes': 45000,
    'BMW': 42000,
    'Lexus': 48000,
    'Toyota': 32000,
    'Land Rover': 55000,
    'Porsche': 65000,
    'Audi': 38000,
    'Hyundai': 25000,
    'Kia': 23000,
    'Volkswagen': 20000,
    'Ford': 22000,
    'Nissan': 21000,
    'Mazda': 19000,
    'Honda': 24000,
    'Chevrolet': 18000,
    'Mitsubishi': 20000,
    'Subaru': 22000,
    'Opel': 12000,
    'BYD': 27000,
    'Jaguar': 50000,
    'Isuzu': 28000,
    'Changan': 20000,
    'LADA': 8000,
  };

  let basePrice = brandPrices[brand] || 20000;

  // Year depreciation (more realistic)
  const carAge = 2026 - parseInt(year);
  const depreciationRate = carAge <= 3 ? 0.12 : carAge <= 5 ? 0.10 : 0.08;
  basePrice = basePrice * Math.pow(1 - depreciationRate, carAge);

  // Mileage impact (non-linear)
  const mileageKm = parseInt(mileage);
  if (mileageKm < 50000) {
    basePrice *= 1.15; // Low mileage premium
  } else if (mileageKm < 100000) {
    basePrice *= 1.05;
  } else if (mileageKm > 200000) {
    basePrice *= 0.75; // High mileage penalty
  } else if (mileageKm > 150000) {
    basePrice *= 0.85;
  }

  // Engine size impact
  const engine = parseFloat(engineSize);
  if (engine >= 3.0) {
    basePrice *= 1.25;
  } else if (engine >= 2.0) {
    basePrice *= 1.15;
  } else if (engine <= 1.2) {
    basePrice *= 0.90;
  }

  // Condition adjustment
  const conditionMultipliers: { [key: string]: number } = {
    'ela': 1.15,
    'yaxsi': 1.0,
    'orta': 0.85,
    'pisdir': 0.65,
  };
  basePrice *= conditionMultipliers[condition] || 1.0;

  // Fuel type adjustment
  const fuelMultipliers: { [key: string]: number } = {
    'benzin': 1.0,
    'dizel': 1.08,
    'hibrid': 1.20,
    'elektrik': 1.25,
    'qaz': 0.95,
  };
  basePrice *= fuelMultipliers[fuelType] || 1.0;

  // Transmission adjustment
  const transmissionMultipliers: { [key: string]: number } = {
    'avtomat': 1.10,
    'robot': 1.05,
    'variator': 1.08,
    'mexaniki': 1.0,
  };
  basePrice *= transmissionMultipliers[transmission] || 1.0;

  // Ensure minimum price
  return Math.max(3000, Math.round(basePrice));
}

function calculateFallbackPrice(data: any): number {
  // Keep old function for compatibility
  return calculateEnhancedPrice(data);
}
