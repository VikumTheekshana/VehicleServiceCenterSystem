/**
 * AutoOS Enterprise Bulk Fluid Dispenser Firmware
 * Target: ESP-WROOM-32
 *
 * Hardware Schematic:
 * - GPIO 18: 12V DC Solenoid Valve via Optocoupled Relay (Active LOW)
 * - GPIO 19: Hall-Effect Turbine Flow Sensor (450 pulses/liter)
 * - GPIO 21: Status LED Indicator
 */

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Wi-Fi & MQTT Parameters
const char* ssid = "AutoOS_Workshop_IoT";
const char* password = "Enterprise_Workshop_Key_2026";
const char* mqtt_server = "192.168.1.50";
const int mqtt_port = 1883;

const char* DRUM_ID = "DRUM-01-MOBIL-0W20";
const char* TOPIC_COMMAND = "autoos/drum/01/command";
const char* TOPIC_TELEMETRY = "autoos/drum/01/telemetry";

// Hardware Pins
const int PIN_SOLENOID = 18;
const int PIN_FLOW_SENSOR = 19;
const int PIN_LED = 21;

// Flow Meter Calibration
const float PULSES_PER_LITER = 450.0;

// Volatile variables modified inside Interrupt Service Routine
volatile unsigned long pulseCount = 0;
volatile bool isDispensing = false;

// Dispense target control
unsigned long targetPulses = 0;
String activeLogId = "";
float targetVolumeLiters = 0.0;

WiFiClient espClient;
PubSubClient client(espClient);

// Interrupt Service Routine for Flow Sensor Pulses
void IRAM_ATTR flowSensorISR() {
  if (isDispensing) {
    pulseCount++;
    if (pulseCount >= targetPulses) {
      // Auto-lock solenoid immediately at hardware level
      digitalWrite(PIN_SOLENOID, HIGH); // De-energize relay (active LOW)
      digitalWrite(PIN_LED, LOW);
      isDispensing = false;
    }
  }
}

void lockValve() {
  digitalWrite(PIN_SOLENOID, HIGH); // Locked
  digitalWrite(PIN_LED, LOW);
  isDispensing = false;
  Serial.println("[AUTOOS HARDWARE] Solenoid valve LOCKED.");
}

void unlockValve(float liters, String logId) {
  activeLogId = logId;
  targetVolumeLiters = liters;
  pulseCount = 0;
  targetPulses = (unsigned long)(liters * PULSES_PER_LITER);
  isDispensing = true;

  digitalWrite(PIN_SOLENOID, LOW); // Energize relay (active LOW)
  digitalWrite(PIN_LED, HIGH);
  Serial.printf("[AUTOOS HARDWARE] Solenoid valve UNLOCKED for %.2f L (%lu pulses)\n", liters, targetPulses);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.println("[MQTT] JSON parse error");
    return;
  }

  const char* action = doc["action"];
  if (strcmp(action, "UNLOCK") == 0) {
    float liters = doc["targetLiters"] | 0.0;
    const char* logId = doc["logId"] | "";
    if (liters > 0.0) {
      unlockValve(liters, String(logId));
    }
  } else if (strcmp(action, "LOCK") == 0) {
    lockValve();
  }
}

void reconnectMqtt() {
  while (!client.connected()) {
    Serial.print("[MQTT] Connecting to AutoOS Broker...");
    if (client.connect("ESP32_Dispenser_01")) {
      Serial.println(" connected.");
      client.subscribe(TOPIC_COMMAND);
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SOLENOID, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_FLOW_SENSOR, INPUT_PULLUP);

  lockValve();

  // Attach interrupt for Hall sensor
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), flowSensorISR, RISING);

  // Initialize network
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);

  Serial.println("==================================================");
  Serial.println("🚗 AutoOS ESP32 Zero-Theft Fluid Dispenser Armed");
  Serial.println("==================================================");
}

unsigned long lastTelemetryMs = 0;

void loop() {
  if (!client.connected()) {
    reconnectMqtt();
  }
  client.loop();

  // Publish periodic telemetry every 500ms
  unsigned long now = millis();
  if (now - lastTelemetryMs > 500) {
    lastTelemetryMs = now;

    float currentLiters = (float)pulseCount / PULSES_PER_LITER;

    StaticJsonDocument<256> telemetry;
    telemetry["drumId"] = DRUM_ID;
    telemetry["logId"] = activeLogId;
    telemetry["pulses"] = pulseCount;
    telemetry["volumeLiters"] = serialized(String(currentLiters, 2));
    telemetry["valveState"] = isDispensing ? "UNLOCKED" : "LOCKED";

    char buffer[256];
    serializeJson(telemetry, buffer);
    client.publish(TOPIC_TELEMETRY, buffer);
  }
}
