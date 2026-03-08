#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;
unsigned long lastMoveTime = 0;
const int moveDelay = 800; // Increased to ensure completion
int currentTarget = -1;
bool isMoving = false;

void setup() {
  pinMode(servoPin, OUTPUT);
  digitalWrite(servoPin, LOW); 
  Serial.begin(9600);
}

void loop() {
  // 1. Better Serial Parser: Collect digits until newline
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    
    if (input.length() > 0) {
      int newAngle = input.toInt();
      
      if (newAngle >= 0 && newAngle <= 180) {
        currentTarget = newAngle;
        
        if (currentTarget == 0) {
          myServo.detach();
          digitalWrite(servoPin, LOW);
          isMoving = false;
          // Serial.println("DEBUG: Detached (OFF)");
        } else {
          if (!myServo.attached()) {
            myServo.attach(servoPin);
          }
          myServo.write(currentTarget);
          lastMoveTime = millis();
          isMoving = true;
          // Serial.print("DEBUG: Moving to ");
          // Serial.println(currentTarget);
        }
      }
    }
  }

  // 2. Stop and detach once the move is complete
  if (isMoving && (millis() - lastMoveTime > moveDelay)) {
    myServo.detach();
    digitalWrite(servoPin, LOW); // Hold the signal low
    isMoving = false;
    // Serial.println("DEBUG: Motion finished, detached.");
  }
}