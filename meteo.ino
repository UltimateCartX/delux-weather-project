#include <Wire.h>
#include "rgb_lcd.h"
#include "DHT.h"
#include "Air_Quality_Sensor.h"
#include <SD.h>
#include <TimeLib.h>

#define DHTPIN 2
#define DHTTYPE DHT11

int colorR = 0;
int colorG = 0;
int colorB = 0;

int temps = 0;

rgb_lcd lcd;
DHT dht(DHTPIN, DHTTYPE);
AirQualitySensor sensor(A0);

const int chipSelect = 4;

void setup() 
{
  Serial.begin(9600);
  while (!Serial);

  if (!SD.begin(chipSelect)) {
    Serial.println("SDCard initialization failed.");
    while (true);
  } else {
    Serial.println("SDCard good :)");
  };

  if (SD.exists("UCX/mesure.txt")) {
    SD.remove("UCX/mesure.txt");
  };

  File dataFile = SD.open("UCX/mesure.txt", FILE_WRITE);
  if (dataFile) {
    dataFile.println("\"Horodate\",\"Température\",\"Humidité\",\"Qualité\"");
    dataFile.close();
  } else {
    Serial.println("Error file bruh");  
  };
  
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("hello, world!");
  sensor.init();

  setTime(11,10,0,10,10,2024);
}

void loop()
{
  lcd.setCursor(0, 0);
  lcd.print(String(dht.readTemperature())+"C | "+ String(dht.readHumidity())+"%");

  String qualityText = "";
  int quality = sensor.slope();
  if (quality == AirQualitySensor::FORCE_SIGNAL) {
    qualityText = "ALERTE";
    colorR = 255;
    colorG = 0;
  } else if (quality == AirQualitySensor::HIGH_POLLUTION) {
    qualityText = "Très polluée";
    colorR = 160;
    colorG = 80;
  } else if (quality == AirQualitySensor::LOW_POLLUTION) {
    qualityText = "Polluée";
    colorR = 80;
    colorG = 160;
  } else if (quality == AirQualitySensor::FRESH_AIR) {
    qualityText = "Bonne";
    colorR = 0;
    colorG = 255;
  }
  lcd.setCursor(0, 1);
  lcd.print("Qualite: " + qualityText);
  lcd.setRGB(colorR, colorG, colorB);

  Serial.print("Température:");
  Serial.print(dht.readTemperature());
  Serial.print(",");
  Serial.print("Humidité:");
  Serial.print(dht.readHumidity());
  Serial.print(",");
  Serial.print("Qualité:");
  Serial.println(sensor.getValue());

  File dataFile = SD.open("UCX/mesure.txt", FILE_WRITE);
  if (dataFile) {
    dataFile.println("\"" + String(temps) + "\",\"" + String(dht.readTemperature()) + "\",\"" + String(dht.readHumidity()) + "\",\"" + String(sensor.getValue()) + "\"");
    dataFile.close();
  };
  
  delay(300000);
  temps += 5;
}
