#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int servoPin = 9;

void setup() {
  Serial.begin(9600);
  myServo.attach(servoPin);
  myServo.write(90); // Start at middle position
}

void loop() {
  if (Serial.available() > 0) {
    int angle = Serial.parseInt();
    // Flush any remaining characters in the buffer
    while (Serial.available() > 0) {
      Serial.read();
    }
    
    if (angle >= 0 && angle <= 180) {
      myServo.write(angle);
    }
  }
}
