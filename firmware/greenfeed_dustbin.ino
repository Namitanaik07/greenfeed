#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "HX711.h"

// ── CONFIG — change these ──────────────────────────────────
#define WIFI_SSID        "YOUR_WIFI_NAME"
#define WIFI_PASSWORD    "YOUR_WIFI_PASSWORD"
#define DEVICE_ID        "BIN_001"
#define BIN_API_KEY      "paste-api_key-from-smart_dustbins-table"
#define API_ENDPOINT     "https://hbqzmciruusgqwxrjfus.supabase.co/functions/v1/iot-dustbin"
#define WASTE_TYPE       "dry"        // dry | recyclable | e-waste | wet
#define BIN_LATITUDE     12.2958
#define BIN_LONGITUDE    76.6394

// ── PINS ───────────────────────────────────────────────────
#define HX711_DT   4
#define HX711_SCK  5
#define QR_RX      16
#define QR_TX      17
#define BUZZER     25
#define LED_PIN    26

// ── TUNING ─────────────────────────────────────────────────
#define CAL_FACTOR      -7050.0   // adjust during calibration
#define MIN_WEIGHT_G    10.0
#define STABLE_READS    5
#define STABLE_TOL_G    5.0
#define QR_TIMEOUT_MS   30000

// ── STATE ──────────────────────────────────────────────────
enum State { IDLE, WAIT_QR, WEIGHING, SENDING, DONE };
State     state = IDLE;
String    qrToken = "";
float     stableWeight = 0;
unsigned long stateTime = 0;

HX711 scale;
HardwareSerial qrSerial(2);

void beep(int n, int ms) {
  for (int i = 0; i < n; i++) { digitalWrite(BUZZER, HIGH); delay(ms); digitalWrite(BUZZER, LOW); delay(80); }
}

void setState(State s) {
  state = s; stateTime = millis();
  digitalWrite(LED_PIN, s == WEIGHING ? HIGH : LOW);
}

void sendToAPI() {
  if (WiFi.status() != WL_CONNECTED) { setState(IDLE); return; }
  HTTPClient http;
  http.begin(API_ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-bin-api-key", BIN_API_KEY);

  StaticJsonDocument<256> doc;
  doc["device_id"]    = DEVICE_ID;
  doc["qr_token"]     = qrToken;
  doc["waste_type"]   = WASTE_TYPE;
  doc["weight_grams"] = stableWeight;
  doc["latitude"]     = BIN_LATITUDE;
  doc["longitude"]    = BIN_LONGITUDE;

  String body; serializeJson(doc, body);
  int code = http.POST(body);

  if (code == 200) {
    String resp = http.getString();
    StaticJsonDocument<256> r;
    if (!deserializeJson(r, resp)) {
      int pts = r["points_awarded"] | 0;
      Serial.printf("SUCCESS: +%d pts\n", pts);
      // Celebration: rising beeps
      int notes[] = {262,330,392,523};
      for (int n : notes) { tone(BUZZER,n,120); delay(140); }
      noTone(BUZZER);
    }
  } else {
    Serial.printf("API error: %d\n", code);
    beep(3, 50);
  }
  http.end();
  setState(DONE);
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  scale.begin(HX711_DT, HX711_SCK);
  scale.set_scale(CAL_FACTOR);
  scale.tare();
  Serial.println("Scale ready");

  qrSerial.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
  Serial.println("QR scanner ready");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected!");
  beep(1, 200);
  setState(IDLE);
}

void loop() {
  switch (state) {

    case IDLE:
      if (scale.is_ready() && scale.get_units(3) > MIN_WEIGHT_G) {
        Serial.println("Object detected — scan your QR!");
        beep(2, 80);
        setState(WAIT_QR);
      }
      break;

    case WAIT_QR:
      if (qrSerial.available()) {
        String token = qrSerial.readStringUntil('\n');
        token.trim();
        if (token.length() > 8) {
          qrToken = token;
          Serial.printf("QR scanned: %s\n", qrToken.c_str());
          beep(1, 200);
          setState(WEIGHING);
        }
      }
      if (millis() - stateTime > QR_TIMEOUT_MS) { scale.tare(); setState(IDLE); }
      break;

    case WEIGHING: {
      static float reads[STABLE_READS] = {};
      static int idx = 0;
      if (scale.is_ready()) {
        reads[idx] = scale.get_units(1);
        idx = (idx + 1) % STABLE_READS;
        float mn = reads[0], mx = reads[0];
        for (int i = 1; i < STABLE_READS; i++) { mn = min(mn,reads[i]); mx = max(mx,reads[i]); }
        if (mx - mn < STABLE_TOL_G && reads[0] > MIN_WEIGHT_G) {
          float sum = 0; for (float r : reads) sum += r;
          stableWeight = sum / STABLE_READS;
          Serial.printf("Stable: %.1fg\n", stableWeight);
          setState(SENDING);
        }
      }
      delay(100);
      break;
    }

    case SENDING:
      sendToAPI();
      break;

    case DONE:
      if (millis() - stateTime > 3000) {
        scale.tare(); qrToken = ""; stableWeight = 0;
        setState(IDLE);
      }
      break;
  }
  delay(50);
}