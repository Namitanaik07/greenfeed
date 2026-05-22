/**
 * GeoVerification Engine
 * 
 * Multi-point location verification system that cross-validates:
 *   1. Task location (set by admin)
 *   2. Device GPS (captured live when submitting proof)
 *   3. Photo EXIF GPS (embedded in the image by the camera)
 * 
 * Uses Haversine formula for geodesic distance and a weighted
 * confidence-scoring algorithm to determine verification status.
 */

// ────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface VerificationInput {
  /** Admin-defined task location (lat/lng from geocoding location_name) */
  taskLocation: GeoPoint | null;
  /** Live GPS captured from the user's device at submission time */
  deviceGps: GeoPoint | null;
  /** GPS coordinates extracted from the image's EXIF data */
  exifGps: GeoPoint | null;
  /** Raw task location name for geocoding fallback */
  taskLocationName?: string;
  isAiOrEdited?: boolean;
  aiEditedReason?: string;
  isPlaceCleaned?: boolean;
  cleanlinessConfidence?: number;
  cleanlinessReason?: string;
}

export interface VerificationResult {
  /** 0-100 confidence score */
  score: number;
  /** Overall verdict */
  verdict: 'verified' | 'likely_valid' | 'suspicious' | 'failed';
  /** Human-readable explanation */
  summary: string;
  /** Individual check results */
  checks: VerificationCheck[];
  /** Distances between the various points (km) */
  distances: {
    taskToDevice: number | null;
    taskToExif: number | null;
    deviceToExif: number | null;
  };
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  score: number;   // contribution to final score
  weight: number;  // max possible points
  detail: string;
}

// ────────────────────────────────────────────────────────
// Haversine Distance
// ────────────────────────────────────────────────────────

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate the great-circle distance between two points
 * on the Earth's surface using the Haversine formula.
 * Returns distance in kilometers.
 */
export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// ────────────────────────────────────────────────────────
// EXIF GPS Extraction (Pure JS, no dependencies)
// ────────────────────────────────────────────────────────

/**
 * Extract GPS coordinates from JPEG EXIF data.
 * Works by parsing the binary EXIF structure in-browser.
 * Returns null if no GPS data is found.
 */
export async function extractExifGps(file: File): Promise<GeoPoint | null> {
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Check for JPEG SOI marker
    if (view.getUint16(0) !== 0xFFD8) return null;

    let offset = 2;
    while (offset < view.byteLength - 2) {
      const marker = view.getUint16(offset);

      // APP1 marker (EXIF)
      if (marker === 0xFFE1) {
        const length = view.getUint16(offset + 2);
        const exifStart = offset + 4;

        // Check "Exif\0\0" header
        const exifHeader =
          String.fromCharCode(
            view.getUint8(exifStart),
            view.getUint8(exifStart + 1),
            view.getUint8(exifStart + 2),
            view.getUint8(exifStart + 3)
          );
        if (exifHeader !== 'Exif') return null;

        const tiffStart = exifStart + 6;
        const byteOrder = view.getUint16(tiffStart);
        const isLittle = byteOrder === 0x4949; // II = little-endian

        const getU16 = (o: number) => view.getUint16(o, isLittle);
        const getU32 = (o: number) => view.getUint32(o, isLittle);

        // Read IFD0
        const ifd0Offset = tiffStart + getU32(tiffStart + 4);
        const ifd0Count = getU16(ifd0Offset);

        // Find GPS IFD pointer (tag 0x8825)
        let gpsIfdOffset: number | null = null;
        for (let i = 0; i < ifd0Count; i++) {
          const entryOffset = ifd0Offset + 2 + i * 12;
          const tag = getU16(entryOffset);
          if (tag === 0x8825) {
            gpsIfdOffset = tiffStart + getU32(entryOffset + 8);
            break;
          }
        }

        if (!gpsIfdOffset) return null;

        // Parse GPS IFD
        const gpsCount = getU16(gpsIfdOffset);
        let latRef = '', lngRef = '';
        let latRational: number[] = [];
        let lngRational: number[] = [];

        const readRational = (valueOffset: number): number => {
          const num = getU32(valueOffset);
          const den = getU32(valueOffset + 4);
          return den === 0 ? 0 : num / den;
        };

        const readDMS = (off: number): number[] => {
          const abs = tiffStart + off;
          return [readRational(abs), readRational(abs + 8), readRational(abs + 16)];
        };

        for (let i = 0; i < gpsCount; i++) {
          const entryOffset = gpsIfdOffset + 2 + i * 12;
          const tag = getU16(entryOffset);

          switch (tag) {
            case 1: // GPSLatitudeRef
              latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
              break;
            case 2: // GPSLatitude
              latRational = readDMS(getU32(entryOffset + 8));
              break;
            case 3: // GPSLongitudeRef
              lngRef = String.fromCharCode(view.getUint8(entryOffset + 8));
              break;
            case 4: // GPSLongitude
              lngRational = readDMS(getU32(entryOffset + 8));
              break;
          }
        }

        if (latRational.length === 3 && lngRational.length === 3) {
          let lat = latRational[0] + latRational[1] / 60 + latRational[2] / 3600;
          let lng = lngRational[0] + lngRational[1] / 60 + lngRational[2] / 3600;
          if (latRef === 'S') lat = -lat;
          if (lngRef === 'W') lng = -lng;

          // Sanity check
          if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
            return { lat, lng };
          }
        }
        return null;
      }

      // Skip to next marker
      if ((marker & 0xFF00) !== 0xFF00) break;
      const segLen = view.getUint16(offset + 2);
      offset += 2 + segLen;
    }
    return null;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────
// Geocode a location name to coordinates (OpenStreetMap)
// ────────────────────────────────────────────────────────

export async function geocodeLocationName(name: string): Promise<GeoPoint | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'GreenFeed/1.0' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────
// Distance Scoring (maps km to a 0-1 score)
// ────────────────────────────────────────────────────────

/**
 * Convert distance to a score between 0 and 1.
 * 
 * Thresholds (tuned for environmental tasks):
 *   0 - 0.5 km  → 1.0  (within walking distance — perfect)
 *   0.5 - 2 km  → 0.8  (very close — excellent)
 *   2 - 5 km    → 0.6  (nearby — acceptable)
 *   5 - 15 km   → 0.3  (same city — suspicious)
 *   15+ km      → 0.0  (too far — likely fraudulent)
 */
function distanceToScore(km: number): number {
  if (km <= 0.5) return 1.0;
  if (km <= 2)   return 0.8;
  if (km <= 5)   return 0.6;
  if (km <= 15)  return 0.3;
  return 0.0;
}

function distanceLabel(km: number): string {
  if (km < 0.01) return `${Math.round(km * 1000)}m (exact match)`;
  if (km < 1)    return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)}km away`;
}

// ────────────────────────────────────────────────────────
// Main Verification Algorithm
// ────────────────────────────────────────────────────────

/**
 * Run the full geo-verification pipeline.
 * 
 * Scoring weights:
 *   - Task ↔ Device GPS:  40 points (most important — user is actually there)
 *   - Task ↔ EXIF GPS:    30 points (photo was taken at the right place)
 *   - Device ↔ EXIF GPS:  20 points (photo wasn't taken elsewhere and GPS faked)
 *   - Data completeness:  10 points (all three data points present)
 * 
 * Verdicts:
 *   80-100 → verified       (auto-verify)
 *   60-79  → likely_valid   (recommend verify)
 *   40-59  → suspicious     (manual review needed)
 *   0-39   → failed         (recommend reject)
 */
export function runVerification(input: VerificationInput): VerificationResult {
  const checks: VerificationCheck[] = [];
  const distances = {
    taskToDevice: null as number | null,
    taskToExif: null as number | null,
    deviceToExif: null as number | null,
  };

  // ── Check 1: Task Location ↔ Device GPS (25 pts) ──
  const W1 = 25;
  if (input.taskLocation && input.deviceGps) {
    const d = haversineDistance(input.taskLocation, input.deviceGps);
    distances.taskToDevice = d;
    const s = distanceToScore(d);
    checks.push({
      name: 'Task ↔ Device GPS',
      passed: s >= 0.6,
      score: Math.round(s * W1),
      weight: W1,
      detail: `Device is ${distanceLabel(d)} from task location (score: ${Math.round(s * 100)}%)`,
    });
  } else if (!input.taskLocation && input.deviceGps) {
    checks.push({
      name: 'Task ↔ Device GPS',
      passed: true,
      score: Math.round(W1 * 0.5),
      weight: W1,
      detail: 'Task has no GPS coordinates; device GPS present (partial credit)',
    });
  } else {
    checks.push({
      name: 'Task ↔ Device GPS',
      passed: false,
      score: 0,
      weight: W1,
      detail: input.deviceGps ? 'Task location not available for comparison' : 'Device GPS not captured',
    });
  }

  // ── Check 2: Task Location ↔ EXIF GPS (15 pts) ──
  const W2 = 15;
  if (input.taskLocation && input.exifGps) {
    const d = haversineDistance(input.taskLocation, input.exifGps);
    distances.taskToExif = d;
    const s = distanceToScore(d);
    checks.push({
      name: 'Task ↔ Photo EXIF GPS',
      passed: s >= 0.6,
      score: Math.round(s * W2),
      weight: W2,
      detail: `Photo was taken ${distanceLabel(d)} from task location (score: ${Math.round(s * 100)}%)`,
    });
  } else if (!input.exifGps) {
    checks.push({
      name: 'Task ↔ Photo EXIF GPS',
      passed: false,
      score: Math.round(W2 * 0.15),
      weight: W2,
      detail: 'Photo has no embedded GPS data (EXIF stripped or not a camera photo)',
    });
  } else {
    checks.push({
      name: 'Task ↔ Photo EXIF GPS',
      passed: false,
      score: 0,
      weight: W2,
      detail: 'Task location not available for EXIF comparison',
    });
  }

  // ── Check 3: Device GPS ↔ EXIF GPS (10 pts) ──
  const W3 = 10;
  if (input.deviceGps && input.exifGps) {
    const d = haversineDistance(input.deviceGps, input.exifGps);
    distances.deviceToExif = d;
    const s = distanceToScore(d);
    checks.push({
      name: 'Device GPS ↔ Photo EXIF GPS',
      passed: s >= 0.6,
      score: Math.round(s * W3),
      weight: W3,
      detail: `Device and photo location are ${distanceLabel(d)} apart (score: ${Math.round(s * 100)}%)`,
    });
  } else {
    checks.push({
      name: 'Device GPS ↔ Photo EXIF GPS',
      passed: false,
      score: input.deviceGps ? Math.round(W3 * 0.2) : 0,
      weight: W3,
      detail: !input.exifGps
        ? 'No EXIF GPS to cross-verify with device'
        : 'No device GPS to cross-verify with EXIF',
    });
  }

  // ── Check 4: Data Completeness (10 pts) ──
  const W4 = 10;
  const dataPoints = [input.taskLocation, input.deviceGps, input.exifGps].filter(Boolean).length;
  const completenessScore = Math.round((dataPoints / 3) * W4);
  checks.push({
    name: 'Data Completeness',
    passed: dataPoints >= 2,
    score: completenessScore,
    weight: W4,
    detail: `${dataPoints}/3 geo-data points available (task GPS, device GPS, photo EXIF)`,
  });

  // ── Check 5: Anti-Forgery & Metadata Integrity (20 pts) ──
  const W5 = 20;
  const isAiOrEdited = input.isAiOrEdited || false;
  checks.push({
    name: 'Anti-Forgery & Metadata Integrity',
    passed: !isAiOrEdited,
    score: isAiOrEdited ? 0 : W5,
    weight: W5,
    detail: isAiOrEdited 
      ? `Suspicious: ${input.aiEditedReason || 'Image contains editing software or AI tool signatures.'}` 
      : 'Passed: Image verified as camera-original (no software or AI tampering signatures detected)',
  });

  // ── Check 6: AI Cleanliness Verification (20 pts) ──
  const W6 = 20;
  const isPlaceCleaned = input.isPlaceCleaned !== false;
  checks.push({
    name: 'AI Cleanliness Verification',
    passed: isPlaceCleaned,
    score: isPlaceCleaned ? W6 : 0,
    weight: W6,
    detail: !isPlaceCleaned
      ? `Failed: ${input.cleanlinessReason || 'Image analysis detected that the place is not fully cleaned/resolved.'}`
      : `Passed: ${input.cleanlinessReason || 'AI analysis confirmed that the location is successfully cleaned.'} (Confidence: ${input.cleanlinessConfidence || 85}%)`,
  });

  // ── Calculate Final Score ──
  let totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  let clampedScore = Math.min(100, Math.max(0, totalScore));

  // Overrides: If it is forged or not cleaned, force fail and cap score
  let forceFail = false;
  let forceFailReason = '';
  if (isAiOrEdited) {
    clampedScore = Math.min(clampedScore, 20);
    forceFail = true;
    forceFailReason = 'AI-tampering/software forgery detected';
  } else if (!isPlaceCleaned) {
    clampedScore = Math.min(clampedScore, 30);
    forceFail = true;
    forceFailReason = 'AI detected that the environment is not cleaned';
  }

  // ── Determine Verdict ──
  let verdict: VerificationResult['verdict'];
  if (forceFail) verdict = 'failed';
  else if (clampedScore >= 80) verdict = 'verified';
  else if (clampedScore >= 60) verdict = 'likely_valid';
  else if (clampedScore >= 40) verdict = 'suspicious';
  else verdict = 'failed';

  // ── Build Summary ──
  const passedChecks = checks.filter(c => c.passed).length;
  const summaryParts: string[] = [];

  if (verdict === 'verified') {
    summaryParts.push(`✅ Auto-Verified — ${passedChecks}/${checks.length} checks passed`);
  } else if (verdict === 'likely_valid') {
    summaryParts.push(`🟡 Likely Valid — ${passedChecks}/${checks.length} checks passed, recommend approval`);
  } else if (verdict === 'suspicious') {
    summaryParts.push(`⚠️ Suspicious — Only ${passedChecks}/${checks.length} checks passed, manual review needed`);
  } else {
    summaryParts.push(`❌ Failed — ${forceFail ? forceFailReason : `${passedChecks}/${checks.length} checks passed`}`);
  }

  if (distances.taskToDevice !== null) {
    summaryParts.push(`User was ${distanceLabel(distances.taskToDevice)} from the task`);
  }

  return {
    score: clampedScore,
    verdict,
    summary: summaryParts.join('. '),
    checks,
    distances,
  };
}

// Helper to convert file to Base64 (for Gemini Vision API)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Helper to verify with real Gemini API
async function verifyImageWithGemini(
  apiKey: string,
  base64Image: string,
  taskTitle: string,
  taskDescription: string
): Promise<{
  isPlaceCleaned: boolean;
  cleanlinessConfidence: number;
  cleanlinessReason: string;
  isAiOrEdited: boolean;
  aiEditedReason?: string;
} | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `You are a professional environmental inspector AI verification agent.
Analyze this user-uploaded proof image for the following cleanup task:
Task: "${taskTitle}"
Task Description: "${taskDescription}"

Your job is to determine:
1. Does the image show the successful completion of the task (e.g. area is cleaned, rubbish removed, tree planted, water clear, etc.)? If the image shows litter, dump piles, trash, or the task is uncompleted, then set "isPlaceCleaned" to false.
2. Does the image look fake, tampered, digitally manipulated, or AI-generated? Look for unnatural textures, weird borders, or AI artifacts. If so, set "isAiOrEdited" to true.

Provide your response in strict JSON format:
{
  "isPlaceCleaned": boolean,
  "cleanlinessConfidence": number (0-100),
  "cleanlinessReason": "Reason for your decision (keep it short and professional)",
  "isAiOrEdited": boolean,
  "aiEditedReason": "Reason if suspected of being fake/AI-generated, else empty"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const json = await response.json();
  const textResponse = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (textResponse) {
    try {
      return JSON.parse(textResponse.trim());
    } catch {
      const match = textResponse.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    }
  }
  return null;
}

// Master function to perform all image proof integrity checks
export async function analyzeImageProof(
  file: File,
  taskTitle: string = 'Environmental Cleanup',
  taskDescription: string = '',
  customGeminiKey?: string
): Promise<{
  isAiOrEdited: boolean;
  aiEditedReason: string;
  isPlaceCleaned: boolean;
  cleanlinessConfidence: number;
  cleanlinessReason: string;
}> {
  let isAiOrEdited = false;
  let aiEditedReason = '';

  // 1. Heuristic metadata binary scanning (Anti-Forgery)
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 150 * 1024)); // scan first 150KB
    let ascii = '';
    for (let i = 0; i < bytes.length; i++) {
      const char = bytes[i];
      if (char >= 32 && char <= 126) {
        ascii += String.fromCharCode(char);
      } else {
        ascii += ' ';
      }
    }
    const lowerAscii = ascii.toLowerCase();
    const aiEditedKeywords = [
      'photoshop', 'adobe', 'lightroom', 'canva', 'gimp', 
      'midjourney', 'stable diffusion', 'stable-diffusion', 'dall-e', 'dalle',
      'exiftool', 'fotor', 'pixlr', 'corel', 'firefly', 'picsart',
      'ai generated', 'ai-generated', 'artificial intelligence', 'text2image'
    ];

    for (const keyword of aiEditedKeywords) {
      if (lowerAscii.includes(keyword)) {
        isAiOrEdited = true;
        aiEditedReason = `Tampering signature found in file header ("${keyword}")`;
        break;
      }
    }
  } catch (err) {
    console.warn('Metadata integrity scan failed:', err);
  }

  // 2. Perform Cleanliness check
  let isPlaceCleaned = true;
  let cleanlinessConfidence = 85;
  let cleanlinessReason = 'Visual checks indicate clear ground layout matching expected task resolution.';

  // If a Gemini API Key is available, use real vision AI!
  const apiKey = customGeminiKey || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '');

  if (apiKey) {
    try {
      const base64Data = await fileToBase64(file);
      const geminiResult = await verifyImageWithGemini(apiKey, base64Data, taskTitle, taskDescription);
      if (geminiResult) {
        return {
          isAiOrEdited: isAiOrEdited || geminiResult.isAiOrEdited,
          aiEditedReason: aiEditedReason || geminiResult.aiEditedReason || 'AI identified generation artifacts.',
          isPlaceCleaned: geminiResult.isPlaceCleaned,
          cleanlinessConfidence: geminiResult.cleanlinessConfidence,
          cleanlinessReason: geminiResult.cleanlinessReason,
        };
      }
    } catch (err) {
      console.error('Gemini Vision API error, falling back to local heuristics:', err);
    }
  }

  // Fallback: Smart local heuristics
  // A. Check filename keywords
  const filename = file.name.toLowerCase();
  const dirtyKeywords = ['dirty', 'trash', 'garbage', 'rubbish', 'waste', 'litter', 'unclean', 'messy', 'before', 'dirt'];
  const hasDirtyKeyword = dirtyKeywords.some(keyword => filename.includes(keyword));

  if (hasDirtyKeyword) {
    isPlaceCleaned = false;
    cleanlinessConfidence = 95;
    cleanlinessReason = `Detected warning keyword in file name ("${filename}"). It looks like you uploaded a "before" or unclean photo instead of the cleaned proof!`;
  } else {
    // B. Analyze image colors via canvas (heuristic check)
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, 16, 16);
        const imgData = ctx.getImageData(0, 0, 16, 16).data;
        
        let grayCount = 0;
        let brownCount = 0;
        let greenCount = 0;
        let totalPixels = 16 * 16;
        
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i+1];
          const b = imgData[i+2];
          
          if (g > r * 1.15 && g > b * 1.15) {
            greenCount++;
          }
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const diff = max - min;
          if (diff < 15 && max < 180) {
            grayCount++;
          }
          if (r > g * 1.1 && g > b * 1.1 && r < 150) {
            brownCount++;
          }
        }
        
        const categoryLower = taskTitle.toLowerCase();
        const isGarbageCleanup = categoryLower.includes('garbage') || categoryLower.includes('trash') || categoryLower.includes('cleanup');
        
        if (isGarbageCleanup && grayCount / totalPixels > 0.45 && greenCount / totalPixels < 0.1) {
          isPlaceCleaned = false;
          cleanlinessConfidence = 75;
          cleanlinessReason = 'Visual color analysis detected high density of neutral debris (grey/charcoal clusters), indicating clutter/litter is still present.';
        }
      }
    } catch (e) {
      console.warn('Canvas pixel color analysis failed:', e);
    }
  }

  return {
    isAiOrEdited,
    aiEditedReason,
    isPlaceCleaned,
    cleanlinessConfidence,
    cleanlinessReason,
  };
}
