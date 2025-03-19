#ifdef ESP32
#include <WiFi.h>
#include <HTTPClient.h>
#else
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#endif
#include <SPI.h>
#include <MFRC522.h>

const char* ssid = "realme GT 6T"; // wifi name
const char* password = "7001844407"; // wifi password
WiFiClient wifiClient;
String serverName = "http://192.168.18.174:3000/addattendance"; // put ip address

#define SS_PIN D4
#define RST_PIN D0
MFRC522 rfid(SS_PIN, RST_PIN);  // Instance of the class
MFRC522::MIFARE_Key key;
// Init array that will store new NUID
byte nuidPICC[4];
void setup() {
  pinMode(D1, OUTPUT); // already present
  pinMode(D2, OUTPUT); // denied
  pinMode(D3, OUTPUT); // granted
  pinMode(D8, OUTPUT); // Buzzer
  Serial.begin(9600);
  SPI.begin();  // Init SPI bus
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  Serial.println(WiFi.status());
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  rfid.PCD_Init();  // Init MFRC522
  Serial.println();
  Serial.print(F("Reader :"));
  rfid.PCD_DumpVersionToSerial();
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  Serial.println();
  Serial.println(F("This code scan the MIFARE Classic NUID."));
  Serial.print(F("Using the following key:"));
  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
}
void loop() {
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!rfid.PICC_IsNewCardPresent())
    return;
  // Verify if the NUID has been readed
  if (!rfid.PICC_ReadCardSerial())
    return;
  Serial.print(F("PICC type: "));
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.println(rfid.PICC_GetTypeName(piccType));
  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI && piccType != MFRC522::PICC_TYPE_MIFARE_1K && piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return;
  }
  if (rfid.uid.uidByte[0] != nuidPICC[0] || rfid.uid.uidByte[1] != nuidPICC[1] || rfid.uid.uidByte[2] != nuidPICC[2] || rfid.uid.uidByte[3] != nuidPICC[3]) {
    Serial.println(F("A new card has been detected."));
    // Store NUID into nuidPICC array
    for (byte i = 0; i < 4; i++) {
      nuidPICC[i] = rfid.uid.uidByte[i];
    }
    Serial.println(F("The NUID tag is:"));
    Serial.print(F("In hex: "));
    printHex(rfid.uid.uidByte, rfid.uid.size);

    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uid += String(rfid.uid.uidByte[i], HEX);
    }

    Serial.println("RFID UID: " + uid);
    sendToNodeJS(uid);


    // Serial.print(F("In dec: "));
    // printDec(rfid.uid.uidByte, rfid.uid.size);
    // Serial.println();
  }  else {
    Serial.println(F("Card read previously."));
    //sendToNodeJS(uid);
    digitalWrite(D1, HIGH);
    digitalWrite(D8, HIGH);
    delay(300);
    digitalWrite(D1, LOW);
    digitalWrite(D8, LOW);
    delay(300);
    digitalWrite(D2, HIGH);
    digitalWrite(D8, HIGH);
    delay(300);
    digitalWrite(D2, LOW);
    digitalWrite(D8, LOW);
    delay(300);
    digitalWrite(D1, HIGH);
    digitalWrite(D8, HIGH);
    delay(300);
    digitalWrite(D1, LOW);
    digitalWrite(D8, LOW);
    delay(300);
    digitalWrite(D2, HIGH);
    digitalWrite(D8, HIGH);
    delay(300);
    digitalWrite(D2, LOW);
    digitalWrite(D8, LOW);
    delay(300);


  // Halt PICC
    rfid.PICC_HaltA();
  //Stop encryption on PCD
    rfid.PCD_StopCrypto1();
  }
}
/**
 		Helper routine to dump a byte array as hex values to Serial.
*/
void printHex(byte* buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}
/**
 		Helper routine to dump a byte array as dec values to Serial.
*/
void printDec(byte* buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], DEC);
  }
}

void sendToNodeJS(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    String httpRequestData = "&rfid="+ uid +"&status=approved";
    int httpCode = http.POST(httpRequestData);
    Serial.println(http.getString());

    if(http.getString() == "denied") {
      digitalWrite(D2, HIGH);
      digitalWrite(D8, HIGH);
      delay(300);
      digitalWrite(D2, LOW);
      digitalWrite(D8, LOW);
      delay(300);
      digitalWrite(D2, HIGH);
      digitalWrite(D8, HIGH);
      delay(300);
      digitalWrite(D2, LOW);
      digitalWrite(D8, LOW);
      delay(300);
      digitalWrite(D2, HIGH);
      digitalWrite(D8, HIGH);
      delay(300);
      digitalWrite(D2, LOW);
      digitalWrite(D8, LOW);
      delay(300);
      digitalWrite(D2, HIGH);
      digitalWrite(D8, HIGH);
      delay(300);
      digitalWrite(D2, LOW);
      digitalWrite(D8, LOW);
      delay(300);
    } else if(http.getString() == "granted") {
      digitalWrite(D3, HIGH);
      digitalWrite(D8, HIGH);
      delay(1000);
      digitalWrite(D3, LOW);
      digitalWrite(D8, LOW);
      delay(1000);
      // digitalWrite(D3, HIGH);
      // delay(300);
      // digitalWrite(D3, LOW);
      // delay(1000);
    } else {
      // digitalWrite(D1, HIGH);
      // digitalWrite(D8, HIGH);
      // delay(300);
      // digitalWrite(D1, LOW);
      // digitalWrite(D8, LOW);
      // delay(300);
      // digitalWrite(D1, HIGH);
      // digitalWrite(D8, HIGH);
      // delay(300);
      // digitalWrite(D1, LOW);
      // digitalWrite(D8, LOW);
      // delay(300);
    }
    Serial.print("HTTP Response code: ");
    Serial.println(httpCode);
    // Free resources
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}


// #ifdef ESP32
// #include <WiFi.h>
// #include <HTTPClient.h>
// #else
// #include <ESP8266WiFi.h>
// #include <ESP8266HTTPClient.h>
// #include <WiFiClient.h>
// #endif
// #include <SPI.h>
// #include <MFRC522.h>

// const char* ssid = "Bristi"; // wifi name
// const char* password = "0192837465"; // wifi password
// WiFiClient wifiClient;
// String serverName = "http://192.168.152.174:3000/addattendance"; // put ip address

// #define SS_PIN D4
// #define RST_PIN D0
// MFRC522 rfid(SS_PIN, RST_PIN);  // Instance of the class
// MFRC522::MIFARE_Key key;
// // Init array that will store new NUID
// byte nuidPICC[4];
// void setup() {
//   pinMode(D1, OUTPUT); // already present
//   pinMode(D2, OUTPUT); // denied
//   pinMode(D3, OUTPUT); // granted
//   pinMode(D8, OUTPUT); // Buzzer
//   Serial.begin(9600);
//   SPI.begin();  // Init SPI bus
//   WiFi.begin(ssid, password);
//   Serial.println("Connecting");
//   Serial.println(WiFi.status());
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }
//   Serial.println("");
//   Serial.print("Connected to WiFi network with IP Address: ");
//   Serial.println(WiFi.localIP());

//   rfid.PCD_Init();  // Init MFRC522
//   Serial.println();
//   Serial.print(F("Reader :"));
//   rfid.PCD_DumpVersionToSerial();
//   for (byte i = 0; i < 6; i++) {
//     key.keyByte[i] = 0xFF;
//   }
//   Serial.println();
//   Serial.println(F("This code scans the MIFARE Classic NUID."));
//   Serial.print(F("Using the following key:"));
//   printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
// }
// void loop() {
//   // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
//   if (!rfid.PICC_IsNewCardPresent())
//     return;
//   // Verify if the NUID has been read
//   if (!rfid.PICC_ReadCardSerial())
//     return;
//   Serial.print(F("PICC type: "));
//   MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
//   Serial.println(rfid.PICC_GetTypeName(piccType));
//   // Check if the PICC is of Classic MIFARE type
//   if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI && piccType != MFRC522::PICC_TYPE_MIFARE_1K && piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
//     Serial.println(F("Your tag is not of type MIFARE Classic."));
//     return;
//   }

//   String uid = "";
//   for (byte i = 0; i < rfid.uid.size; i++) {
//     uid += String(rfid.uid.uidByte[i], HEX);
//   }

//   Serial.println("RFID UID: " + uid);
//   String response = sendToNodeJS(uid);

//   if (response == "denied") {
//       digitalWrite(D2, HIGH);
//       digitalWrite(D8, HIGH);
//       delay(300);
//       digitalWrite(D2, LOW);
//       digitalWrite(D8, LOW);
//       delay(300);
//       digitalWrite(D2, HIGH);
//       digitalWrite(D8, HIGH);
//       delay(300);
//       digitalWrite(D2, LOW);
//       digitalWrite(D8, LOW);
//       delay(300);
//       digitalWrite(D2, HIGH);
//       digitalWrite(D8, HIGH);
//       delay(300);
//       digitalWrite(D2, LOW);
//       digitalWrite(D8, LOW);
//       delay(300);
//       digitalWrite(D2, HIGH);
//       digitalWrite(D8, HIGH);
//       delay(300);
//       digitalWrite(D2, LOW);
//       digitalWrite(D8, LOW);
//       delay(300);
//   } else if (response == "granted") {
//     if (rfid.uid.uidByte[0] != nuidPICC[0] || rfid.uid.uidByte[1] != nuidPICC[1] || 
//         rfid.uid.uidByte[2] != nuidPICC[2] || rfid.uid.uidByte[3] != nuidPICC[3]) {
//         Serial.println(F("A new card has been detected."));
//         for (byte i = 0; i < 4; i++) {
//             nuidPICC[i] = rfid.uid.uidByte[i];
//         }
//         digitalWrite(D3, HIGH); // Green LED for new card
//         digitalWrite(D8, HIGH); // Buzzer
//         delay(1000);
//         digitalWrite(D3, LOW);
//         digitalWrite(D8, LOW);
//     } else {
//         Serial.println(F("Granted card read previously."));
//         // Activate white and red LEDs with buzzer
//         for (int i = 0; i < 3; i++) { // Blink sequence for repeated card
//             digitalWrite(D1, HIGH); // White LED
//             digitalWrite(D2, HIGH); // Red LED
//             digitalWrite(D8, HIGH); // Buzzer
//             delay(300);
//             digitalWrite(D1, LOW);
//             digitalWrite(D2, LOW);
//             digitalWrite(D8, LOW);
//             delay(300);
//         }
//     }
// }


//   // Halt PICC
//   rfid.PICC_HaltA();
//   // Stop encryption on PCD
//   rfid.PCD_StopCrypto1();
// }
// /**
//  		Helper routine to dump a byte array as hex values to Serial.
// */
// void printHex(byte* buffer, byte bufferSize) {
//   for (byte i = 0; i < bufferSize; i++) {
//     Serial.print(buffer[i] < 0x10 ? " 0" : " ");
//     Serial.print(buffer[i], HEX);
//   }
// }
// /**
//  		Helper routine to dump a byte array as dec values to Serial.
// */
// void printDec(byte* buffer, byte bufferSize) {
//   for (byte i = 0; i < bufferSize; i++) {
//     Serial.print(buffer[i] < 0x10 ? " 0" : " ");
//     Serial.print(buffer[i], DEC);
//   }
// }

// String sendToNodeJS(String uid) {
//   if (WiFi.status() == WL_CONNECTED) {
//     HTTPClient http;
//     http.begin(wifiClient, serverName);
//     http.addHeader("Content-Type", "application/x-www-form-urlencoded");
//     String httpRequestData = "&rfid=" + uid + "&status=approved";
//     int httpCode = http.POST(httpRequestData);
//     String response = http.getString();
//     Serial.println(response);
//     Serial.print("HTTP Response code: ");
//     Serial.println(httpCode);
//     // Free resources
//     http.end();
//     return response;
//   } else {
//     Serial.println("WiFi Disconnected");
//     return "error";
//   }
// }
