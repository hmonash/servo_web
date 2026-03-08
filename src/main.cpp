#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;

unsigned long lastMoveTime = 0;
const int moveDelay = 600; // Time in ms to allow servo to reach position
int targetAngle = 0;

void setup() {
  pinMode(servoPin, OUTPUT);
  digitalWrite(servoPin, LOW); 
  Serial.begin(9600);
  Serial.setTimeout(10);
}

void loop() {
  // 1. Check for Serial Data
  if (Serial.available() > 0) {
    if (isDigit(Serial.peek())) {
      int newAngle = Serial.parseInt();
      
      while (Serial.available() > 0 && !isDigit(Serial.peek())) {
        Serial.read();
      }
      
      if (newAngle >= 0 && newAngle <= 180) {
        targetAngle = newAngle;
        
        if (targetAngle == 0) {
          if (myServo.attached()) myServo.detach();
          digitalWrite(servoPin, LOW);
        } else {
          if (!myServo.attached()) myServo.attach(servoPin);
          myServo.write(targetAngle);
          lastMoveTime = millis(); // Reset timer
        }
      }
    } else {
      Serial.read();
    }
  }

  // 2. Auto-detach after movement to stop jitter
  if (myServo.attached() && targetAngle > 0) {
    if (millis() - lastMoveTime > moveDelay) {
      myServo.detach();
      digitalWrite(servoPin, LOW); // Hold signal quiet
    }
  }
}
