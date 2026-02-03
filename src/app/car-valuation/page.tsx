'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Car, Sparkles, TrendingUp } from 'lucide-react';

// Turbo.az-dan toplanan real məlumatlar
const CAR_DATA: { [brand: string]: string[] } = {
  'Mercedes': ['E-Class', 'C-Class', 'S-Class', 'GLE', 'GLC', 'GLA', 'A-Class', 'CLS', 'ML', 'E 220 d', 'E 240', 'E 350 4MATIC', 'GLE 53 AMG 4MATIC+ Coupe'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X5', 'X3', 'X1', 'X6', 'X7', '428', '528', '530', '525'],
  'Toyota': ['Camry', 'Corolla', 'Land Cruiser', 'Land Cruiser Prado', 'RAV4', 'Highlander', 'Yaris', 'Prius', 'Aqua', 'Frontlander'],
  'Hyundai': ['Sonata', 'Elantra', 'Tucson', 'Santa Fe', 'Accent', 'i30', 'Creta'],
  'Lexus': ['RX', 'ES', 'LX', 'GX', 'IS', 'NX', 'RX 350', 'RX 200t', 'LX 570'],
  'Kia': ['Sportage', 'Rio', 'Cerato', 'Sorento', 'Soul', 'Optima'],
  'Nissan': ['X-Trail', 'Qashqai', 'Juke', 'Patrol', 'Altima', 'Murano'],
  'Volkswagen': ['Passat', 'Golf', 'Tiguan', 'Jetta', 'Polo', 'Touareg'],
  'Ford': ['Focus', 'Fiesta', 'Kuga', 'Mondeo', 'Ranger', 'Transit', 'F-150'],
  'Mazda': ['3', '6', 'CX-5', 'CX-9', 'CX-3'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Jazz'],
  'Chevrolet': ['Cruze', 'Malibu', 'Aveo', 'Captiva', 'Tahoe'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8'],
  'Land Rover': ['Range Rover', 'Discovery', 'Defender', 'Evoque', 'Rover Discovery', 'Rover Range Rover'],
  'BYD': ['Seal', 'Atto 3', 'Han', 'Tang', 'Song Plus DM-i', 'Seal 05', 'Destroyer 05', 'Song Plus DM-İ'],
  'Porsche': ['Cayenne', 'Macan', '911', 'Panamera', 'Macan S'],
  'Mitsubishi': ['Outlander', 'ASX', 'Pajero', 'Lancer', 'L200'],
  'Subaru': ['Forester', 'Outback', 'XV', 'Legacy', 'Impreza'],
  'Opel': ['Astra', 'Insignia', 'Corsa', 'Mokka', 'Zafira'],
  'Jaguar': ['F-Pace', 'XF', 'XE', 'E-Pace', 'F-Type'],
  'Isuzu': ['D-Max', 'MU-X', 'NP 37'],
  'Changan': ['CS75', 'Eado', 'CS35', 'CS55'],
  'LADA': ['Vesta', 'Granta', 'Niva', 'Priora', '(VAZ) 2107'],
};

const BRANDS = Object.keys(CAR_DATA).sort();

export default function CarValuationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: 'benzin',
    transmission: 'avtomat',
    engineSize: '',
    condition: 'yaxsi',
    color: '',
    owners: '1',
  });

  // Seçilmiş markaya görə modelləri filtrlə
  const availableModels = useMemo(() => {
    return formData.brand ? CAR_DATA[formData.brand] || [] : [];
  }, [formData.brand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Marka dəyişdikdə modeli sıfırla
    if (name === 'brand') {
      setFormData(prev => ({ ...prev, brand: value, model: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Qiymət hesablanmadı');
      }

      if (data.success && data.prediction) {
        setResult(data.prediction.estimated_price);
      } else {
        throw new Error('Nəticə alınmadı');
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      alert(error.message || 'Xəta baş verdi. Zəhmət olmasa bütün sahələri düzgün doldurun və yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Süni İntellekt ilə</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Avtomobil Qiymət Hesablama
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Maşınınızın dəqiq bazar qiymətini öyrənin. Real bazar məlumatları əsasında hazırlanmış süni intellekt modeli.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6 text-purple-600" />
                  Avtomobil Məlumatları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Brand & Model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand" className="text-sm font-semibold text-gray-700">
                        Marka *
                      </Label>
                      <select
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Marka seçin</option>
                        {BRANDS.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="model" className="text-sm font-semibold text-gray-700">
                        Model *
                      </Label>
                      <select
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        disabled={!formData.brand}
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.brand ? 'Model seçin' : 'Əvvəl marka seçin'}
                        </option>
                        {availableModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Year & Mileage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year" className="text-sm font-semibold text-gray-700">
                        İstehsal İli *
                      </Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        placeholder="məs: 2020"
                        value={formData.year}
                        onChange={handleChange}
                        min="1990"
                        max="2026"
                        required
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage" className="text-sm font-semibold text-gray-700">
                        Yürüş (km) *
                      </Label>
                      <Input
                        id="mileage"
                        name="mileage"
                        type="number"
                        placeholder="məs: 85000"
                        value={formData.mileage}
                        onChange={handleChange}
                        min="0"
                        required
                        className="mt-1.5 h-11"
                      />
                    </div>
                  </div>

                  {/* Row 3: Fuel Type & Transmission */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fuelType" className="text-sm font-semibold text-gray-700">
                        Yanacaq Növü *
                      </Label>
                      <select
                        id="fuelType"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="benzin">Benzin</option>
                        <option value="dizel">Dizel</option>
                        <option value="qaz">Qaz</option>
                        <option value="hibrid">Hibrid</option>
                        <option value="elektrik">Elektrik</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="transmission" className="text-sm font-semibold text-gray-700">
                        Sürətlər Qutusu *
                      </Label>
                      <select
                        id="transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="avtomat">Avtomat</option>
                        <option value="mexaniki">Mexaniki</option>
                        <option value="robot">Robot</option>
                        <option value="variator">Variator</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Engine Size & Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="engineSize" className="text-sm font-semibold text-gray-700">
                        Mühərrik Həcmi (L) *
                      </Label>
                      <Input
                        id="engineSize"
                        name="engineSize"
                        type="number"
                        step="0.1"
                        placeholder="məs: 2.0"
                        value={formData.engineSize}
                        onChange={handleChange}
                        min="0.5"
                        max="10"
                        required
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition" className="text-sm font-semibold text-gray-700">
                        Vəziyyət *
                      </Label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="ela">Əla</option>
                        <option value="yaxsi">Yaxşı</option>
                        <option value="orta">Orta</option>
                        <option value="pisdir">Pis</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Color & Owners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color" className="text-sm font-semibold text-gray-700">
                        Rəng
                      </Label>
                      <Input
                        id="color"
                        name="color"
                        placeholder="məs: Ağ"
                        value={formData.color}
                        onChange={handleChange}
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="owners" className="text-sm font-semibold text-gray-700">
                        Sahiblərin Sayı *
                      </Label>
                      <select
                        id="owners"
                        name="owners"
                        value={formData.owners}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="1">1 Sahib</option>
                        <option value="2">2 Sahib</option>
                        <option value="3">3 Sahib</option>
                        <option value="4+">4+ Sahib</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Hesablanır...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-5 w-5" />
                        Qiyməti Hesabla
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Result Card */}
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5" />
                    Qiymətləndirmə Nəticəsi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm opacity-90 mb-2">Təxmini Bazar Qiyməti</p>
                        <div className="text-5xl font-bold mb-1">
                          {result.toLocaleString('az-AZ')}
                        </div>
                        <p className="text-2xl opacity-90">AZN</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Minimum:</span>
                          <span className="font-semibold">{(result * 0.85).toLocaleString('az-AZ')} AZN</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-90">Maksimum:</span>
                          <span className="font-semibold">{(result * 1.15).toLocaleString('az-AZ')} AZN</span>
                        </div>
                      </div>
                      <p className="text-xs opacity-75 text-center">
                        * Bu qiymət təxminidir və real bazar qiymətindən fərqlənə bilər
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 opacity-75">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Formu doldurun və hesabla düyməsini basın</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">Necə işləyir?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold flex-shrink-0">
                      1
                    </div>
                    <p>Avtomobilinizin məlumatlarını daxil edin</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold flex-shrink-0">
                      2
                    </div>
                    <p>Süni intellekt real bazar məlumatlarını analiz edir</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold flex-shrink-0">
                      3
                    </div>
                    <p>Bazara uyğun dəqiq qiymət təklifi alırsınız</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
