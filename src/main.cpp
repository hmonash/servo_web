#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;

void setup() {
  Serial.begin(9600);
  // Start detached (0 degrees)
}

int currentAngle = 0;

void loop() {
  if (Serial.available() > 0) {
    int angle = Serial.parseInt();
    while (Serial.available() > 0) {
      Serial.read();
    }
    
    // Only update if the change is significant (at least 1 degree) to reduce jitter
    if (angle == 0) {
      if (myServo.attached()) {
        myServo.detach();
        currentAngle = 0;
      }
    } else if (angle > 0 && angle <= 180) {
      if (abs(angle - currentAngle) >= 1) { // 1-degree deadzone
        if (!myServo.attached()) {
          myServo.attach(servoPin);
        }
        myServo.write(angle);
        currentAngle = angle;
      }
    }
  }
}
