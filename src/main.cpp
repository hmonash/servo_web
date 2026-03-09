#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;
const int moveDelay = 800; // Time allowed for the physical move

void setup() {
  pinMode(servoPin, OUTPUT);
  digitalWrite(servoPin, LOW); 
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    
    if (input.length() > 0) {
      int targetAngle = input.toInt();
      
      if (targetAngle > 0 && targetAngle <= 180) {
        // 1. Attach and Move
        myServo.attach(servoPin);
        myServo.write(targetAngle);
        
        // 2. Wait for completion
        delay(moveDelay); 
        
        // 3. Detach immediately to stop all jitter/hum
        myServo.detach();
        digitalWrite(servoPin, LOW);
      } else if (targetAngle == 0) {
        myServo.detach();
        digitalWrite(servoPin, LOW);
      }
    }
  }
}

