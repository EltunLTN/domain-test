'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Car, Sparkles, TrendingUp } from 'lucide-react';

// car_data.csv-dən çəkilmiş tam marka və model məlumatları (67,430 maşın)
// 154 unikal marka, 1486 unikal model
const CAR_DATA: { [brand: string]: string[] } = {
  'AODES': ['Desertcross 1000-6 HVAC', 'Workcross 650-3'],
  'Abarth': ['124 Spider', '500', '595'],
  'Acura': ['MDX', 'TSX'],
  'Alfa': ['Romeo Giulia', 'Romeo Stelvio'],
  'Aprilia': ['RS 125'],
  'Aston': ['Martin DBX'],
  'Audi': ['200', '80', 'A3', 'A4', 'A5', 'A5 Sportback', 'A6', 'A6 allroad', 'A7', 'A7 Sportback', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS Q8', 'RS7'],
  'Avatr': ['07', '11', '12'],
  'BMW': ['118', '125', '228', '316', '318', '320', '323', '325', '328', '330', '330e', '335', '340', '420', '428', '430', '520', '520e', '523', '525', '528', '530', '530e', '535', '540', '545', '640', '645', '650', '728', '730', '735', '740', '740Le', '745', '750', '750e xDrive', '760', '840', 'M3', 'M4', 'M5', 'M6', 'M760e xDrive', 'M8', 'S 1000 RR', 'X1', 'X2', 'X3', 'X4', 'X5', 'X5 M', 'X6', 'X6 M', 'X7', 'XM', 'XM 50e', 'Z3', 'Z4', 'i8'],
  'BRP': ['Renegade X mr 1000R TR'],
  'BYD': ['Destroyer 05', 'F3', 'Frigate 07', 'Han', 'Han L', 'Leopard 5', 'Leopard 8', 'Qin Plus', 'Sea Lion 05', 'Sea Lion 07', 'Seal 05', 'Seal 06', 'Seal 07', 'Song L', 'Song Plus DM-İ', 'Song Pro', 'Tang', 'Tang L', 'Yangwang U7', 'Yangwang U8'],
  'Baic': ['A115', 'M20', 'M60', 'Senova D50', 'X3', 'X55', 'X55 II', 'X7'],
  'Bajaj': ['Dominar 250', 'Dominar 400', 'Pulsar NS 200', 'Pulsar RS 200'],
  'Benda': ['LFC 700', 'LFC 700 Pro', 'Napoleon 250', 'Napoleon 500'],
  'Bentley': ['Bentayga', 'Continental Flying Spur', 'Continental GT', 'Flying Spur', 'Mulsanne'],
  'Bestune': ['B70', 'T55', 'T77', 'T99'],
  'Bull': ['Motors Nova Maxx'],
  'C.Moto': ['CM250R-HY', 'CM400R-18', 'CM400R-F8', 'CM400R-HY', 'CMR-RZ', 'CMR-SY'],
  'CFMOTO': ['250 NK', '250 SR', '300 SR-S', '450 SR-S', '500SR VOOM', '650 NK', '700 CL-X Heritage', 'U10 PRO HIGHLAND', 'ZFORCE 1000 Sport', 'ZFORCE 1000 Sport R', 'ZFORCE 950 Sport'],
  'Cadillac': ['ATS', 'BLS', 'CT5', 'CTS', 'DeVille', 'Escalade', 'SRX'],
  'Can-Am': ['Maverick', 'Spyder RS', 'Spyder ST'],
  'Changan': ['Alsvin', 'Alsvin V3', 'Alsvin V5', 'Benni', 'CS 15', 'CS 35', 'CS 35 Plus', 'CS 55 Plus', 'CS 75', 'CS 75 Plus', 'CS 85', 'CS 95', 'CS 95 Plus', 'CX 20', 'Deepal G318', 'Deepal S05', 'Deepal S09', 'Deepal S7', 'Deepal SL03', 'Eado', 'Eado Plus', 'F70 (Hunter)', 'K50 (Hunter)', 'Nevo A05', 'Nevo Q05', 'Oshan X5 Plus', 'Oshan Z6', 'Peak View RV', 'Qiyuan A05', 'Qiyuan A06', 'Qiyuan A07', 'Qiyuan Q05', 'Qiyuan Q07', 'Uni-K', 'Uni-K iDD', 'Uni-T', 'Uni-V', 'Uni-V iDD', 'Uni-Z', 'X7 Plus'],
  'Chery': ['Amulet (A15)', 'Arrizo 5', 'Tiggo (T11)', 'Tiggo 2', 'Tiggo 2 Pro', 'Tiggo 2 Pro Max', 'Tiggo 3', 'Tiggo 5', 'Tiggo 7', 'Tiggo 7 Pro', 'Tiggo 8 Pro e+'],
  'Chevrolet': ['Aveo', 'Camaro', 'Captiva', 'Chevette', 'Cobalt', 'Cruze', 'Damas', 'Epica', 'Equinox', 'Labo', 'Lacetti', 'Lanos', 'Malibu', 'Monza', 'Nexia', 'Niva', 'Onix', 'Orlando', 'Sonic', 'Spark', 'Tracker', 'TrailBlazer', 'Traverse', 'Trax', 'Volt'],
  'Chrysler': ['200', '300C', 'Crossfire', 'New Yorker', 'Town & Country', 'Voyager'],
  'Citroen': ['C-Elysee', 'C3 Picasso', 'C5 Aircross', 'DS5'],
  'DAF': ['105 XF', '95 XF', 'LF 45.180', 'XF 440 FT', 'XF 460 FT'],
  'DFSK': ['C-32 S', 'C-35', 'D51', 'D71 Plus', 'E5', 'Fengon 380', 'Glory 330 S', 'Glory 330 S Cargo'],
  'Dacia': ['Lodgy', 'Logan'],
  'Daewoo': ['Ace (Super Salon)', 'BH117', 'BS090', 'Damas', 'Espero', 'Gentra', 'Lanos', 'Leganza', 'Matiz', 'Nexia', 'Tico'],
  'Daihatsu': ['Sirion'],
  'Dayun': ['DY150-16D', 'DY200T-11'],
  'Denza': ['N9', 'Z9', 'Z9 GT'],
  'Dodge': ['Caliber', 'Challenger', 'Charger', 'Durango', 'Neon', 'Ram'],
  'DongFeng': ['Aeolus Huge', 'Aeolus Mage HEV', 'Aeolus S30', 'Aeolus Shine Max', 'EQ1020TF', 'EQ5081JSQG', 'Landian E5', 'YiPay 007'],
  'Ducati': ['Diavel'],
  'FAW': ['J6P dumper 6x4', 'J6P dumper 8x4', 'Tiger VH', 'Tiger VH-L', 'Tiger VN', 'Tiger VR'],
  'Ferrari': ['296 GTB'],
  'Fiat': ['500', '500L', 'Albea', 'Doblo', 'Ducato', 'Fiorino', 'Linea', 'Marea', 'Qubo', 'Tipo'],
  'Ford': ['Bronco', 'Bronco Sport', 'C-MAX', 'Capri', 'Cargo', 'Courier', 'Custom', 'Ecosport', 'Edge', 'Escape', 'Explorer', 'F-150', 'Fiesta', 'Focus', 'Fusion', 'Fusion (North America)', 'Galaxie', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'Tourneo Connect', 'Tourneo Courier', 'Tourneo Custom', 'Transit', 'Transit Connect', 'Transit Custom'],
  'Foton': ['Forland'],
  'Freedom': ['JET 49', 'MX 49', 'Ninja 200 S', 'SKY 49'],
  'GAC': ['E8', 'ES9', 'Emkoo', 'Empow', 'GS3 Emzoom', 'GS8', 'M8', 'S7', 'Trumpchi GS3 Power', 'Trumpchi GS4'],
  'GAZ': ['12 ZIM', '21 "Volga"', '221717', '24 "Volga"', '27527-745', '2757', '3102 "Volga"', '31029 "Volga"', '3110 "Volga"', '31105 "Volga"', '3307', '3308', '3309-352', '53', '67', '69', 'Biznes 27527', 'GAZel (2705)', 'GAZel (2705-757)', 'GAZel (27057)', 'GAZel (32212)', 'GAZel (322173)', 'GAZel (3302-18)', 'GAZel (3302-288)', 'GAZel (3302-744)', 'GAZel (330200)', 'GAZel (330202-740)', 'GAZel (33021)', 'GAZel (33023-744)', 'GAZel (330232-744)', 'GAZel (33027)', 'GAZel Next A21R22-30', 'GAZel Next A21R32-30', 'GAZel Next A22R22-30', 'GAZel Next A23R22', 'GAZel Next A31R22', 'GAZel Next A31R32', 'Gazon C41R33', 'M-20 "Pobeda"', 'M-21', 'Sadko C42A43', 'Sobol'],
  'GMC': ['Acadia', 'Terrain'],
  'GWM': ['(Great Wall Motor) Hover M2', '(Great Wall Motor) Hover M4', '(Great Wall Motor) Poer', '(Great Wall Motor) Tank 300', '(Great Wall Motor) Tank 400', '(Great Wall Motor) Tank 500', '(Great Wall Motor) Voleex C30', '(Great Wall Motor) Wey 03', '(Great Wall Motor) Wey 07', '(Great Wall Motor) Wey 80'],
  'Geely': ['Atlas Pro', 'CK', 'Coolray', 'Emgrand', 'Emgrand L', 'Emgrand X7', 'Galaxy A7', 'Galaxy L6', 'Galaxy L7', 'Galaxy Starship 7', 'MK', 'Monjaro', 'Okavango', 'TX4', 'Tugella'],
  'Genesis': ['G70', 'G80', 'GV70', 'GV80'],
  'HOWO': ['371', 'Sinotruk', 'TX'],
  'Haojue': ['DL160', 'DR160S', 'HJ125-18', 'KA150', 'UHR 150'],
  'Harley-Davidson': ['CVO Convertible', 'FLD Dyna Switchback', 'FLHX Street Glide', 'FLTRX Road Glide', 'Low Rider ST', 'Nightster special', 'Sportster Custom 1200', 'Sportster Forty Eight', 'Sportster Roadster', 'Sportster S', 'Sportster SuperLow XL883L', 'Touring Electra Glide', 'XL 1200 NS', 'XL883N Sportster Iron 883'],
  'Haval': ['Dargo', 'F7x', 'H2', 'H3', 'H5', 'H6', 'H6 GT', 'H9', 'Jolion', 'Jolion Pro', 'M6', 'Raptor'],
  'Honda': ['Accord', 'CB650R', 'CBR 1000', 'CBR 600', 'CR-V', 'CTX 1300', 'City', 'Civic', 'Clarity', 'HR-V', 'Insight', 'Pilot', 'Talon 1000X'],
  'Hongqi': ['H5', 'HS5'],
  'Hummer': ['H2', 'H3'],
  'Hyundai': ['Accent', 'Avante', 'Azera', 'County', 'Coupe', 'Creta', 'Custin', 'Elantra', 'Elantra GT', 'Elantra N', 'Elantra N Line', 'Equus', 'Galloper', 'Genesis', 'Genesis Coupe', 'Getz', 'Grand Santa Fe', 'Grandeur', 'H 100', 'H 350', 'H-1', 'HD-120', 'HD-35', 'HD-45', 'HD-65', 'HD-72', 'HD-78', 'IONIQ', 'Kona', 'Matrix', 'Maxcruz', 'Mighty EX5', 'Palisade', 'Santa Fe', 'Sonata', 'Sonata N Line', 'Staria', 'Terracan', 'Tucson', 'Tucson L', 'Veloster', 'Venue', 'Veracruz', 'Verna', 'i10', 'i20', 'i30', 'i40', 'ix35', 'ix55'],
  'IJ': ['2126 Oda', 'Planeta 5'],
  'Ikarus': ['256'],
  'Indian': ['Motorcycle Challenger', 'Motorcycle Scout'],
  'Infiniti': ['EX35', 'FX', 'FX35', 'FX37', 'G35', 'G37', 'G37S', 'I30', 'M37', 'Q30', 'Q50', 'Q50S', 'QX30', 'QX4', 'QX50', 'QX55', 'QX56', 'QX60', 'QX70', 'QX70S', 'QX80'],
  'Iran': ['Khodro Runna', 'Khodro Samand', 'Khodro Soren'],
  'Isuzu': ['ELF', 'Ecobus', 'Forward', 'NHR 55 E', 'NKR 55 E', 'NMR 85 H', 'NP 37', 'NPR 66 L', 'NPR 66 P', 'NPR 75', 'NPR 75 K', 'NPR 75 L', 'NPR75L-K', 'NQR 71 PL', 'NQR 75', 'NovoCiti', 'Rodeo', 'Turkuaz'],
  'Iveco': ['35 S11', 'Daily', 'Daily 35C12H', 'Otoyol', 'Stralis'],
  'JAC': ['Ankai', 'HFC1083K', 'HFC5061', 'J7', 'JS2', 'JS3', 'JS4', 'JS6', 'JS8', 'LD1A2', 'LD3A3', 'LE745', 'LE79Z', 'Sunray', 'T8', 'T8 Pro', 'T9', 'X200'],
  'JETOUR': ['Dashing', 'T1', 'T2', 'X70', 'X70 PLUS', 'X70C-DM', 'X90 PLUS'],
  'JMC': ['Carrying 4x2', 'Conquer 4x2', 'D77', 'Grand Avenue', 'Grand Avenue Pro', 'Touring', 'Vigus Plus'],
  'Jaguar': ['Daimler Double-Six', 'E-Pace', 'F-Pace', 'F-Pace R', 'F-Type', 'XE', 'XF', 'XJ', 'XJ L'],
  'Jeep': ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Grand Commander', 'Liberty', 'Patriot', 'Wrangler'],
  'Jiangmen': ['RGMT', 'Wolvarine 800'],
  'Jianshe': ['N49'],
  'Jinlang': ['Fs125', 'St150'],
  'KAIYI': ['E5', 'X3', 'X7'],
  'KG': ['Mobility Torres'],
  'KamAz': ['43101', '5320', '53212', '53213', '53215', '53229', '5410', '5511', '55111', '65115', '6520', '65201'],
  'Kawasaki': ['Ninja 400', 'Ninja 500', 'Ninja 650', 'Ninja ZX-14', 'Z1000'],
  'Khazar': ['LD', 'LX', 'SD'],
  'Kia': ['Avella', 'Bongo', 'Cadenza', 'Carens', 'Carnival', 'Ceed', 'Ceed SW', 'Cerato', 'Cerato Koup', 'Clarus', 'Forte', 'K3', 'K5', 'K7', 'K8', 'KX1', 'Magentis', 'Mohave', 'Morning', 'Niro', 'Opirus', 'Optima', 'Pegas', 'Picanto', 'Pregio', 'Pride', 'ProCeed', 'Quoris', 'Rio', 'Rio X-Line', 'Seltos', 'Sephia', 'Soluto', 'Sonet', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic'],
  'King': ['Long XMQ6112AY'],
  'Kuba': ['X-boss'],
  'LADA': ['(VAZ) 2101', '(VAZ) 21011', '(VAZ) 21013', '(VAZ) 2102', '(VAZ) 2103', '(VAZ) 2104', '(VAZ) 21045', '(VAZ) 2105', '(VAZ) 2106', '(VAZ) 2107', '(VAZ) 2108', '(VAZ) 2109', '(VAZ) 21099', '(VAZ) 2110', '(VAZ) 2111', '(VAZ) 2112', '(VAZ) 2114', '(VAZ) 2115', '(VAZ) Granta', '(VAZ) Granta Sport', '(VAZ) Kalina', '(VAZ) Kalina Cross', '(VAZ) Largus', '(VAZ) Niva', '(VAZ) Niva Bronto', '(VAZ) Oka', '(VAZ) Priora', '(VAZ) Vesta', '(VAZ) Vesta Cross', '(VAZ) Vesta SW Cross', '(VAZ) XRAY Cross'],
  'Lamborghini': ['Urus', 'Urus SE'],
  'Land': ['Rover Defender', 'Rover Discovery', 'Rover Discovery Sport', 'Rover Freelander', 'Rover RR Evoque', 'Rover RR Sport', 'Rover RR Velar', 'Rover Range Rover'],
  'Leapmotor': ['C01', 'C11', 'C16'],
  'Lexus': ['CT 200h', 'ES 200', 'ES 250', 'ES 300h', 'ES 350', 'GS 200t', 'GS 300', 'GS 300h', 'GX 460', 'GX 470', 'GX 550', 'IS 200', 'IS 200t', 'IS 250', 'IS 300', 'LM 350h', 'LS 350', 'LS 400', 'LS 460', 'LS 460L', 'LS 500', 'LX 450', 'LX 450d', 'LX 470', 'LX 500d', 'LX 570', 'LX 600', 'LX 700h', 'NX 200', 'NX 200t', 'NX 300', 'NX 300h', 'NX 350', 'RX 200t', 'RX 300', 'RX 330', 'RX 350', 'RX 350L', 'RX 350h', 'RX 500h', 'UX 250h'],
  'Li': ['Auto L6', 'Auto L7', 'Auto L9'],
  'Lifan': ['320', '620', '720', 'Breez (520)', 'V16', 'X60'],
  'Lincoln': ['MKZ', 'Navigator'],
  'Lynk': ['& Co 05', '& Co 06', '& Co 07', '& Co 08', '& Co 09', '& Co 900'],
  'M-Hero': ['917'],
  'MAN': ['19.414', '41.364', 'F 2000', 'TGA 18.310', 'TGA 18.410', 'TGA 18.440', 'TGA 18.480', 'TGA 440', 'TGA 480', 'TGX 18.400', 'TGX 18.440', 'TGX 18.480', 'TGX 18.520'],
  'MAZ': ['551605', '5549', '650108'],
  'MG': ['3', '350', '7', 'RX8'],
  'Mack': ['LR'],
  'Maserati': ['Ghibli', 'Grecale 300', 'Grecale Modena', 'Levante', 'Levante S', 'Quattroporte'],
  'Mazda': ['2', '3', '6', '626', 'CX-5', 'CX-60', 'CX-7', 'CX-9', 'CX-90', 'EZ-6', 'MX-5', 'MX-6', 'RX-8'],
  'Mercedes': ['0403', '190', '200', '200 D', '200 E', '208 D', '210 D', '220 E', '230 E', '250', '250 D', '280 SE', '300 D', '408 D', '410 D', '609 D', '612 D', '711 D', 'A 160', 'A 170', 'A 200', 'A 220', 'A 250 4MATIC', 'A 250 e', 'AMG GT 43 4MATIC+', 'AMG GT 53 4MATIC+', 'AMG GT 63 S 4MATIC+', 'AMG GT S', 'Actros 1840', 'Actros 1841', 'Actros 1844', 'Actros 1846', 'Actros 1848', 'Actros 2544', 'Actros 3235', 'Atego 1018', 'Atego 1217', 'Atego 1218', 'Atego 1223', 'Atego 1224', 'Atego 1318', 'Atego 1828', 'Atego 811', 'Atego 814', 'Atego 815', 'Atego 816', 'Atego 817', 'Atego 818', 'Axor 1828', 'Axor 1829', 'Axor 1833', 'Axor 1840', 'Axor 1843', 'Axor 2529', 'Axor 2533', 'B 170', 'B 180', 'B 200', 'Brabus ML 63 Biturbo', 'C 160', 'C 180', 'C 180 d', 'C 200', 'C 200 d', 'C 220', 'C 220 d', 'C 230', 'C 240', 'C 250', 'C 250 4MATIC', 'C 270', 'C 280', 'C 300', 'C 300 4MATIC', 'C 300 d 4MATIC', 'C 320', 'C 350 e', 'C 43 AMG 4MATIC', 'C 63 AMG', 'C 63 AMG S E Performance', 'CL 500', 'CL 63 AMG', 'CLA 180', 'CLA 200', 'CLA 250', 'CLA 250 4MATIC', 'CLA 250 e', 'CLA 45 AMG 4MATIC', 'CLK 200', 'CLK 230', 'CLK 320', 'CLS 250 CDI', 'CLS 300', 'CLS 350', 'CLS 450', 'CLS 450 4MATIC', 'CLS 53 AMG 4MATIC+', 'CLS 55 AMG', 'CLS 550', 'CLS 63 AMG', 'E 180', 'E 200', 'E 200 4MATIC', 'E 200 d', 'E 220', 'E 220 4MATIC', 'E 220 d', 'E 220 d 4MATIC', 'E 230', 'E 240', 'E 250', 'E 250 4MATIC', 'E 260', 'E 270', 'E 280', 'E 290', 'E 300', 'E 300 4MATIC', 'E 300 de', 'E 300 e', 'E 300 e 4MATIC', 'E 320', 'E 320 4MATIC', 'E 350', 'E 350 4MATIC', 'E 350 e', 'E 400', 'E 420', 'E 430', 'E 500', 'E 55 AMG', 'E 63 AMG', 'E 63 S 4MATIC+', 'G 300', 'G 320', 'G 350', 'G 450 d', 'G 500', 'G 55 AMG', 'G 55 Brabus K8', 'G 63 AMG', 'GL 320 4MATIC', 'GL 350', 'GL 350 4MATIC', 'GL 400 4MATIC', 'GL 420 4MATIC', 'GL 450 4MATIC', 'GL 500 4MATIC', 'GL 550', 'GL 63 AMG 4MATIC', 'GL Brabus Widestar', 'GLA 200', 'GLA 250', 'GLA 250 4MATIC', 'GLA 45 AMG 4MATIC', 'GLB 200 4MATIC', 'GLB 250 4MATIC', 'GLB 35 AMG', 'GLC 200 4MATIC', 'GLC 200 4MATIC+ Coupe', 'GLC 220 d 4MATIC Coupe', 'GLC 250 4MATIC', 'GLC 250 4MATIC Coupe', 'GLC 300', 'GLC 300 4MATIC', 'GLC 300 4MATIC Coupe', 'GLC 300 e 4MATIC+ Coupe', 'GLC 350 e 4MATIC+', 'GLC 350 e 4MATIC+ Coupe', 'GLE 250 4MATIC', 'GLE 350', 'GLE 350 4MATIC', 'GLE 350 4MATIC Coupe', 'GLE 350 de 4MATIC', 'GLE 350 de 4MATIC AMG COUPE', 'GLE 400 4MATIC', 'GLE 400 4MATIC Coupe', 'GLE 400 e 4MATIC Coupe', 'GLE 400 e Coupe', 'GLE 43 AMG 4MATIC Coupe', 'GLE 43 AMG Coupe', 'GLE 450 4MATIC', 'GLE 450 4MATIC Coupe', 'GLE 53 4MATIC+', 'GLE 53 AMG', 'GLE 53 AMG 4MATIC Coupe', 'GLE 53 AMG Coupe', 'GLK 250 4MATIC', 'GLS 400', 'GLS 450 4MATIC', 'GLS 500 4MATIC', 'GLS 580 4MATIC', 'ML 270', 'ML 270 4MATIC', 'ML 300', 'ML 300 4MATIC', 'ML 320 4MATIC', 'ML 350', 'ML 350 4MATIC', 'ML 400 4MATIC', 'ML 500 4MATIC', 'ML 63 AMG', 'Metris', 'R 300 4MATIC', 'R 320', 'S 300', 'S 320', 'S 350', 'S 350 4MATIC', 'S 350 d', 'S 350 d 4MATIC', 'S 400', 'S 400 4MATIC', 'S 420', 'S 450', 'S 450 4MATIC', 'S 500', 'S 500 4MATIC', 'S 500 Coupe', 'S 55 AMG', 'S 550', 'S 560 4MATIC', 'S 580 4MATIC', 'S 63 AMG', 'S 63 AMG 4MATIC', 'S 63 AMG Coupe', 'S 65 AMG', 'SL 55 4MATIC+', 'SLS AMG', 'Sprinter 208', 'Sprinter 212', 'Sprinter 215', 'Sprinter 308', 'Sprinter 310', 'Sprinter 311', 'Sprinter 312', 'Sprinter 313', 'Sprinter 314', 'Sprinter 315', 'Sprinter 316', 'Sprinter 318', 'Sprinter 412', 'Sprinter 413', 'Sprinter 513', 'Sprinter 515', 'Sprinter 516', 'Sprinter 517', 'Sprinter 518', 'Sprinter 519', 'Sprinter 524', 'V 220', 'V 230', 'V 250', 'V 280', 'V 300', 'Vario', 'Viano', 'Vito', 'Vito 109', 'Vito 109 CDI', 'Vito 110', 'Vito 110 D', 'Vito 111', 'Vito 111 CDI', 'Vito 113', 'Vito 113 CDI', 'Vito 114', 'Vito 115', 'Vito 115 CDI', 'Vito 116', 'Vito 116 CDI', 'Vito 120 CDI', 'Vito 121', 'W123', 'X 250D', 'X 250D 4MATIC'],
  'Mercedes-Maybach': ['GLS 600 4MATIC', 'S 400', 'S 580 4MATIC', 'S 600'],
  'Mikilon': ['HAMMER 200L', 'HAMMER 200L Pro'],
  'Mini': ['Cabrio', 'Clubman', 'Cooper', 'Countryman', 'Countryman Cooper S'],
  'Minsk': ['D4 125', 'SCR 250', 'X250'],
  'Mitsubishi': ['3000 GT', 'ASX', 'Airtrek', 'Attrage', 'Canter', 'Chariot', 'Colt', 'Eclipse', 'Eclipse Cross', 'Fuso Canter', 'Galant', 'Grandis', 'L200', 'Lancer', 'Lancer Ralliart', 'Mirage', 'Montero Sport', 'Outlander', 'Outlander Sport', 'Pajero', 'Pajero Sport', 'Pajero io'],
  'Moskvich': ['2715', '401', '407', '408', '412'],
  'Muravey': ['Muravey- 2 01', 'Muravey- 2 02', 'TG200', 'TGA200', 'TGA200-01', 'TGA200-01P'],
  'Neta': ['L', 'S'],
  'Nissan': ['AD', 'Almera', 'Altima', 'Armada', 'Juke', 'Kicks', 'Latio', 'Magnite', 'March', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'Pathfinder', 'Patrol', 'Primera', 'Qashqai', 'Rogue', 'Sentra', 'Sunny', 'Teana', 'Terrano II', 'Tiida', 'Urvan', 'Versa', 'Wingroad', 'X-Trail', 'Xterra'],
  'Opel': ['Antara', 'Astra', 'Combo', 'Corsa', 'Crossland X', 'Frontera', 'Insignia', 'Meriva', 'Mokka', 'Omega', 'Signum', 'Sintra', 'Tigra', 'Vectra', 'Vita', 'Zafira'],
  'Peugeot': ['206', '207', '3008', '307', '308', '405', '406', '607', 'Bipper', 'Boxer', 'Expert', 'Khazar 406', 'Pars', 'Partner', 'RCZ', 'Rifter'],
  'Polad': ['S 50'],
  'Polaris': ['RZR XP 1000', 'Sportsman Touring 850 SP'],
  'Porsche': ['911 Carrera 4 GTS', '911 Carrera 4S', 'Cayenne', 'Cayenne Coupe', 'Cayenne E-Hybrid', 'Cayenne GTS', 'Cayenne GTS Coupe', 'Cayenne S', 'Cayenne Turbo', 'Cayenne Turbo S', 'Macan', 'Macan S', 'Macan T', 'Macan Turbo', 'Panamera', 'Panamera 4', 'Panamera 4 E-Hybrid', 'Panamera 4S', 'Panamera GTS', 'Panamera Turbo', 'Panamera Turbo S'],
  'QJMotor': ['SRK 125 R', 'SRT 900 S'],
  'RKS': ['Blazer 50'],
  'ROX': ['(Polar Stone) 01'],
  'Ravon': ['Nexia R3', 'R2', 'R4'],
  'Renault': ['12 Toros', '19', '21', 'Arkana', 'Captur', 'Clio', 'Dokker', 'Duster', 'Espace', 'Grand Scenic', 'Kangoo', 'Kaptur', 'Laguna', 'Logan', 'Megane', 'Megane Scenic', 'Sandero', 'Sandero Stepway', 'Scenic', 'Symbol', 'Talisman', 'Tondar'],
  'Rolls-Royce': ['Wraith'],
  'Royal': ['Enfield Classic 350', 'Enfield Hunter 350', 'Enfield Meteor 350', 'Enfield Super Meteor 650'],
  'SEAT': ['Exeo', 'Ibiza', 'Leon', 'Toledo'],
  'SYM': ['Crox 150'],
  'Saipa': ['132', 'Saina', 'Tiba'],
  'SamAuto': ['HC40', 'HD50'],
  'Scania': ['R420', 'R480'],
  'Seres': ['Aito M5', 'Aito M7', 'Aito M9'],
  'Shacman': ['F2000', 'F3000'],
  'Skoda': ['Fabia', 'Felicia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Superb'],
  'Smart': ['Fortwo'],
  'Soueast': ['S07', 'S09'],
  'Ssang': ['Yong Actyon', 'Yong Korando', 'Yong Kyron', 'Yong Rexton'],
  'Subaru': ['BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Impreza WRX STi', 'Legacy', 'Outback', 'XV'],
  'Suzuki': ['Baleno', 'Burgman', 'DL 650', 'Ertiga', 'Fronx', 'GSX-8R', 'GSX-R 750', 'GSX-S1000', 'GSX-S1000GT', 'Grand Vitara', 'Intruder M1800R', 'Jimny', 'S-Cross', 'SFV 650 Gladius', 'SV 650', 'Swift', 'V-Strom 650', 'Xbee'],
  'TVS': ['Apache RTR 160 4V', 'Apache RTR 200', 'Raider'],
  'Textron': ['Tracker 800 sx'],
  'Tofas': ['Dogan', 'Kartal', 'Sahin'],
  'Toyota': ['4Runner', 'Alphard', 'Aqua', 'Aurion', 'Auris', 'Avalon', 'Avensis', 'C-HR', 'Camry', 'Corolla', 'Corolla Axio', 'Corolla Cross', 'Corolla Fielder', 'Corolla Levin', 'Corolla Verso', 'Crown', 'Esquire', 'FJ Cruiser', 'Fortuner', 'Frontlander', 'GT 86', 'Grand Highlander', 'Harrier', 'Highlander', 'Hilux', 'Hilux Surf', 'Land Cruiser', 'Land Cruiser Prado', 'Prius', 'Prius C', 'Prius PHV', 'Prius Prime', 'Prius V', 'Proace City', 'RAV4', 'Ractis', 'Rush', 'Sequoia', 'Sienta', 'Venza', 'Vitz', 'Yaris', 'Yaris Cross', 'Yaris iA'],
  'Triumph': ['Limogino', 'Rocket III GT'],
  'Tufan': ['CUB50 S', 'Istiqlal', 'M50', 'S 150'],
  'UAZ': ['3151', '31512', '31519', '3303', '33036', '39094', '390945', '469', 'Hunter', 'Patriot', 'Pickup', 'Profi'],
  'VGV': ['U70 Pro', 'U75 Plus'],
  'Vespa': ['GTS 300', 'SXL 150', 'VXL 150'],
  'Voge': ['300 ds', '300r', '300rr', 'Ds525x'],
  'Volkswagen': ['Arteon', 'Beetle', 'Bora', 'Caravelle', 'Crafter', 'Eos', 'Golf', 'Golf GTI', 'Golf Plus', 'Jetta', 'LT', 'Multivan', 'Parati', 'Passat', 'Passat (North America)', 'Passat CC', 'Phaeton', 'Polo', 'Scirocco R', 'Tiguan', 'Touareg', 'Transporter', 'Vento'],
  'Volvo': ['460', '760', '850', 'FH 12', 'FH 13', 'FH 16', 'FH 460', 'FH 500', 'S40', 'S60', 'S80', 'S90', 'XC40', 'XC60', 'XC90'],
  'Voyah': ['Dream', 'Free'],
  'Wuling': ['Alvez', 'Starlight', 'Starlight S'],
  'Yamaha': ['FZ-S FI Deluxe', 'FZ-S Fi Hybrid', 'FZ1', 'FZ6N', 'Grizzly 660', 'MT-07', 'MT-15', 'R15', 'R15 V4', 'R15S', 'WR250X', 'XV1900', 'XVS1300A Midnight Star', 'YBR 125', 'YZ125', 'YZF-R6'],
  'Yutong': ['ZK6128H'],
  'ZAZ': ['965', '968M', 'Lanos', 'Slavuta', 'Vida'],
  'ZEEKR': ['9X'],
  'ZIL': ['130', '131', '5301'],
  'ZX': ['Auto Landmark'],
  'ZXMCO': ['ZX150GY'],
  'Zonsen': ['Battlo3', 'Battlo5', 'Battlo5R', 'Carrera', 'MXR', 'RA1', 'Yomi'],
  'Zontes': ['M310', 'Panther ZT150-8A', 'R310', 'ZT155-G1'],
  'iHonzda': ['TG250s'],
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
    engineSize: '',
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
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold">Süni İntellekt ilə</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
            Avtomobil Qiymət Hesablama
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Maşının dəqiq bazar qiymətini öyrənin. Real bazar məlumatları əsasında hazırlanmış süni intellekt modeli.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                  <Car className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  Avtomobil Məlumatları
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Row 1: Brand & Model */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="brand" className="text-xs sm:text-sm font-semibold text-gray-700">
                        Marka *
                      </Label>
                      <select
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="mt-1 sm:mt-1.5 w-full h-10 sm:h-11 rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Marka seçin</option>
                        {BRANDS.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="model" className="text-xs sm:text-sm font-semibold text-gray-700">
                        Model *
                      </Label>
                      <select
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        disabled={!formData.brand}
                        className="mt-1 sm:mt-1.5 w-full h-10 sm:h-11 rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="year" className="text-xs sm:text-sm font-semibold text-gray-700">
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
                        className="mt-1 sm:mt-1.5 h-10 sm:h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage" className="text-xs sm:text-sm font-semibold text-gray-700">
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
                        className="mt-1 sm:mt-1.5 h-10 sm:h-11"
                      />
                    </div>
                  </div>

                  {/* Row 3: Engine Size */}
                  <div>
                    <Label htmlFor="engineSize" className="text-xs sm:text-sm font-semibold text-gray-700">
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
                      className="mt-1 sm:mt-1.5 h-10 sm:h-11"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        Hesablanır...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {/* Result Card */}
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Qiymətləndirmə Nəticəsi
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {result ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-center">
                        <p className="text-xs sm:text-sm opacity-90 mb-2">Təxmini Bazar Qiyməti</p>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">
                          {result.toLocaleString('az-AZ')}
                        </div>
                        <p className="text-lg sm:text-xl md:text-2xl opacity-90">AZN</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="opacity-90">Minimum:</span>
                          <span className="font-semibold">{(result * 0.85).toLocaleString('az-AZ')} AZN</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="opacity-90">Maksimum:</span>
                          <span className="font-semibold">{(result * 1.15).toLocaleString('az-AZ')} AZN</span>
                        </div>
                      </div>
                      <p className="text-[10px] sm:text-xs opacity-75 text-center">
                        * Bu qiymət təxminidir və real bazar qiymətindən fərqlənə bilər
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 opacity-75">
                      <Calculator className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">Formu doldurun və hesabla düyməsini basın</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Necə işləyir?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground px-4 sm:px-6">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <p>Avtomobilinizin məlumatlarını daxil edin</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <p>Süni intellekt real bazar məlumatlarını analiz edir</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
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
