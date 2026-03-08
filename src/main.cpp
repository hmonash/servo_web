#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;

void setup() {
  pinMode(servoPin, OUTPUT);
  digitalWrite(servoPin, LOW); // Hold signal low to prevent jitter
  Serial.begin(9600);
  Serial.setTimeout(10); // Faster timeout for more responsive control
}

int currentAngle = -1; // Start at -1 to force first update

void loop() {
  if (Serial.available() > 0) {
    // Check if the next character is actually a number
    if (isDigit(Serial.peek())) {
      int angle = Serial.parseInt();
      
      // Flush any trailing newline/carriage return
      while (Serial.available() > 0 && !isDigit(Serial.peek())) {
        Serial.read();
      }
      
      if (angle == 0) {
        if (myServo.attached()) {
          myServo.detach();
          digitalWrite(servoPin, LOW); // Ensure pin is low when detached
          currentAngle = 0;
        }
      } else if (angle > 0 && angle <= 180) {
        if (abs(angle - currentAngle) >= 1) {
          if (!myServo.attached()) {
            myServo.attach(servoPin);
          }
          myServo.write(angle);
          currentAngle = angle;
        }
      }
    } else {
      // Clear non-numeric garbage
      Serial.read();
    }
  }
}
