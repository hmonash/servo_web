# P5.js Servo Web Controller

A simple and interactive way to control a servo motor from your web browser using p5.js and the Web Serial API.

## Hardware Setup

- **Arduino Uno**
- **Servo Motor**
  - **Red (VCC):** 5V on Arduino
  - **Black/Brown (GND):** GND on Arduino
  - **Yellow/Orange (Signal):** Digital Pin 9 on Arduino

## Getting Started

### 1. Upload Arduino Code

Use PlatformIO to build and upload the firmware to your Arduino Uno:

```bash
pio run --target upload
```

Alternatively, you can manually upload the contents of `src/main.cpp` using the Arduino IDE.

### 2. Run the Web Interface

Since this uses the **Web Serial API**, you need to open `index.html` in a modern browser like **Google Chrome** or **Microsoft Edge**.

To serve it locally, you can use any static server:

```bash
# Using Python
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### 3. Usage

1. Click the **"Connect to Arduino"** button in the browser.
2. Select your Arduino Uno's serial port.
3. Move your mouse horizontally across the canvas to rotate the servo (0° to 180°).

## Project Structure

- `src/main.cpp`: Arduino firmware to receive serial data and control the servo.
- `index.html`: The web page structure.
- `sketch.js`: p5.js logic for interaction and Web Serial communication.
- `platformio.ini`: PlatformIO configuration for the project.
