#include <Arduino.h>
#include <Servo.h>

Servo myServo;
const int SERVO_PIN = 9;
int currentAngle = 0; // Keep track of where we are

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(5);
  
  // Start at 0
  myServo.attach(SERVO_PIN);
  myServo.write(0);
  delay(500);
  myServo.detach();
  digitalWrite(SERVO_PIN, LOW);
  
  Serial.println("READY: Proportional Jitter-Free Controller");
}

void loop() {
  if (Serial.available() > 0) {
    int targetAngle = Serial.parseInt();
    targetAngle = constrain(targetAngle, 0, 180);
    
    // Calculate distance to move
    int angleDiff = abs(targetAngle - currentAngle);
    
    // Calculate dynamic delay: 150ms base + 2.5ms per degree of travel
    // This ensures we hold just long enough to get there.
    int dynamicDelay = 150 + (angleDiff * 2.5);

    Serial.print("MOVING: ");
    Serial.print(currentAngle);
    Serial.print(" -> ");
    Serial.print(targetAngle);
    Serial.print(" (Delay: ");
    Serial.print(dynamicDelay);
    Serial.println("ms)");

    myServo.attach(SERVO_PIN);
    myServo.write(targetAngle);
    
    delay(dynamicDelay);
    
    myServo.detach();
    digitalWrite(SERVO_PIN, LOW);
    
    currentAngle = targetAngle; // Update our tracker
    Serial.println("DONE");

    while (Serial.available() > 0) Serial.read();
  }
}
