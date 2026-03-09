#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;
const int moveDelay = 800; 

void setup() {
  // 1. Force signal line to LOW immediately
  pinMode(servoPin, OUTPUT);
  digitalWrite(servoPin, LOW); 
  
  Serial.begin(9600);
  Serial.setTimeout(20); // Short timeout for faster parsing
  
  // 2. Clear any garbage data that came in during power-on
  while(Serial.available() > 0) Serial.read();
}

void loop() {
  // 3. Ignore all Serial data for the first 2 seconds after reset
  // This prevents random noise during port opening from triggering a move.
  if (millis() < 2000) {
    if (Serial.available() > 0) Serial.read();
    return;
  }

  if (Serial.available() > 0) {
    // Only proceed if the first character is a digit
    if (isDigit(Serial.peek())) {
      int targetAngle = Serial.parseInt();
      
      // Consume any remaining characters in the buffer (newlines, etc)
      while (Serial.available() > 0 && !isDigit(Serial.peek())) {
        Serial.read();
      }

      if (targetAngle > 0 && targetAngle <= 180) {
        // 4. Set the angle BEFORE attaching. 
        // This prevents the servo from jumping to 90 degrees before reaching your target.
        myServo.write(targetAngle);
        myServo.attach(servoPin);
        
        delay(moveDelay); 
        
        // 5. Detach and kill signal immediately
        myServo.detach();
        digitalWrite(servoPin, LOW);
      }
    } else {
      // Discard non-numeric noise
      Serial.read();
    }
  }
}