import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

type ModelStats = {
  avg_price: number;
  min_price: number;
  max_price: number;
  count: number;
  avg_il: number;
  avg_yurus: number;
  avg_muherrik: number;
};

let modelStatsCache: Record<string, ModelStats> | null = null;

function loadModelStats(): Record<string, ModelStats> {
  if (modelStatsCache) return modelStatsCache;

  try {
    const statsPath = path.join(process.cwd(), 'scripts', 'model_stats.json');
    if (fs.existsSync(statsPath)) {
      const raw = fs.readFileSync(statsPath, 'utf-8');
      modelStatsCache = JSON.parse(raw) as Record<string, ModelStats>;
      return modelStatsCache;
    }
  } catch (error) {
    console.error('Model stats load error:', error);
  }

  modelStatsCache = {};
  return modelStatsCache;
}

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
    if (!brand || !model || !year || mileage === undefined || mileage === null || !engineSize) {
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

    // Try to use Logarithmic Python ML model in development
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'predict_log.py');
      
      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        console.log('Log model script tapılmadı, fallback istifadə edilir');
        throw new Error('Python script tapılmadı');
      }

      // Prepare car data for Python script
      const carData = {
        brand: brand,
        model: model,
        year: parseInt(year),
        mileage: parseInt(mileage) || 0,
        engineSize: parseFloat(engineSize),
      };

      // Write JSON to temp file to avoid shell escaping issues
      const tempFile = path.join(process.cwd(), 'scripts', 'temp_input.json');
      fs.writeFileSync(tempFile, JSON.stringify(carData));

      // Run Logarithmic Python prediction script with temp file
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const scriptDir = path.join(process.cwd(), 'scripts');
      const { stdout, stderr } = await execAsync(
        `${pythonCmd} -c "import sys; sys.path.insert(0, '${scriptDir.replace(/\\/g, '\\\\')}'); import json; from predict_log import predict_from_json; data=open('${tempFile.replace(/\\/g, '\\\\')}').read(); print(predict_from_json(data))"`,
        { maxBuffer: 1024 * 1024, cwd: scriptDir }
      );
      
      // Clean up temp file
      try { fs.unlinkSync(tempFile); } catch {}

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
          min_price: Math.round(result.predicted_price * 0.90),
          max_price: Math.round(result.predicted_price * 1.10),
          confidence: 'çox yüksək', // Advanced ML model (99.6% accuracy)
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

  const statsMap = loadModelStats();
  const statsKey = `${brand}||${model}`;
  const modelStats = statsMap[statsKey];

  let basePrice = modelStats?.avg_price ?? (brandPrices[brand] || 20000);

  if (modelStats) {
    const yearValue = parseInt(year);
    const mileageValue = parseInt(mileage);
    const engineValue = parseFloat(engineSize);

    // Year adjustment relative to model average
    const yearDiff = yearValue - modelStats.avg_il;
    const yearFactor = 1 + Math.max(-0.5, Math.min(0.5, yearDiff * 0.04));
    basePrice *= yearFactor;

    // Mileage adjustment relative to model average
    if (modelStats.avg_yurus > 0) {
      const mileageRatio = mileageValue / modelStats.avg_yurus;
      const mileageFactor = 1 - Math.max(-0.2, Math.min(0.4, (mileageRatio - 1) * 0.2));
      basePrice *= mileageFactor;
    }

    // Engine size adjustment relative to model average
    if (modelStats.avg_muherrik > 0) {
      const engineRatio = engineValue / modelStats.avg_muherrik;
      const engineFactor = 1 + Math.max(-0.2, Math.min(0.3, (engineRatio - 1) * 0.15));
      basePrice *= engineFactor;
    }
  } else {
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

  if (modelStats) {
    const minAllowed = Math.max(3000, modelStats.min_price * 0.6);
    const maxAllowed = modelStats.max_price * 1.4;
    const clamped = Math.min(Math.max(basePrice, minAllowed), maxAllowed);
    return Math.round(clamped);
  }

  // Ensure minimum price
  return Math.max(3000, Math.round(basePrice));
}

function calculateFallbackPrice(data: any): number {
  // Keep old function for compatibility
  return calculateEnhancedPrice(data);
}
