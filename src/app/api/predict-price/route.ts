import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

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

    // Python script path
    const scriptPath = path.join(process.cwd(), 'scripts', 'predict_price.py');

    // Prepare car data for Python script
    const carData = JSON.stringify({
      brand,
      model,
      year: parseInt(year),
      mileage: parseInt(mileage),
      engine_size: parseFloat(engineSize),
      fuel_type: fuelType || 'benzin',
      transmission: transmission || 'avtomat',
      condition: condition || 'yaxsi',
      city: 'Bakı',
      owners: parseInt(owners) || 1,
    });

    // Run Python prediction script
    const { stdout, stderr } = await execAsync(
      `python "${scriptPath}" '${carData.replace(/'/g, "\\'")}'`
    );

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // Parse prediction result
    const result = JSON.parse(stdout.trim());

    return NextResponse.json({
      success: true,
      prediction: {
        estimated_price: Math.round(result.predicted_price),
        min_price: Math.round(result.predicted_price * 0.85),
        max_price: Math.round(result.predicted_price * 1.15),
        confidence: result.confidence || 'orta',
      },
    });
  } catch (error: any) {
    console.error('Prediction error:', error);

    // If Python/ML model not available, use fallback calculation
    const fallbackPrice = calculateFallbackPrice(await request.json());

    return NextResponse.json({
      success: true,
      prediction: {
        estimated_price: fallbackPrice,
        min_price: Math.round(fallbackPrice * 0.85),
        max_price: Math.round(fallbackPrice * 1.15),
        confidence: 'aşağı',
      },
      note: 'ML model yüklənmədiyi üçün təxmini hesablama istifadə olundu',
    });
  }
}

function calculateFallbackPrice(data: any): number {
  // Simple fallback calculation if ML model is not available
  const {
    year = 2015,
    mileage = 100000,
    engineSize = 1.6,
    condition = 'yaxsi',
    fuelType = 'benzin',
    transmission = 'avtomat',
  } = data;

  let basePrice = 15000;

  // Year depreciation
  const carAge = 2026 - parseInt(year);
  basePrice -= carAge * 800;

  // Mileage depreciation
  basePrice -= (parseInt(mileage) / 1000) * 50;

  // Engine size premium
  basePrice += parseFloat(engineSize) * 2000;

  // Condition adjustment
  if (condition === 'ela') basePrice += 3000;
  else if (condition === 'orta') basePrice -= 2000;
  else if (condition === 'pisdir') basePrice -= 5000;

  // Fuel type adjustment
  if (fuelType === 'dizel') basePrice += 2000;
  else if (fuelType === 'hibrid') basePrice += 4000;
  else if (fuelType === 'elektrik') basePrice += 5000;

  // Transmission adjustment
  if (transmission === 'avtomat') basePrice += 2000;
  else if (transmission === 'robot') basePrice += 1500;

  return Math.max(5000, Math.round(basePrice));
}
