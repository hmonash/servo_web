#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;

void setup() {
  Serial.begin(9600);
  // Start detached (0 degrees)
}

void loop() {
  if (Serial.available() > 0) {
    int angle = Serial.parseInt();
    while (Serial.available() > 0) {
      Serial.read();
    }
    
    if (angle == 0) {
      if (myServo.attached()) {
        myServo.detach();
      }
    } else if (angle > 0 && angle <= 180) {
      if (!myServo.attached()) {
        myServo.attach(servoPin);
      }
      myServo.write(angle);
    }
  }
}
