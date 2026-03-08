let port;
let connectBtn;
let targetAngle = 90;
let lastSentAngle = 90;
let lastSentTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  connectBtn = select('#connectBtn');
  connectBtn.mousePressed(connectToSerial);
  
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

async function connectToSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    connectBtn.html("Connected");
    connectBtn.style('background-color', '#eee');
    connectBtn.style('color', '#333');
  } catch (err) {
    console.error("Error connecting to serial:", err);
  }
}

function draw() {
  background(255);
  
  let sliderX = width / 2;
  let sliderY = height / 2;
  let sliderWidth = min(width * 0.8, 500);
  let sliderHeight = 4;
  
  // Logic: Update angle when clicking/dragging
  if (mouseIsPressed) {
    targetAngle = map(constrain(mouseX, sliderX - sliderWidth/2, sliderX + sliderWidth/2), 
                      sliderX - sliderWidth/2, sliderX + sliderWidth/2, 0, 180);
  }
  
  // 1. Draw Slider Track
  noStroke();
  fill(240);
  rect(sliderX, sliderY, sliderWidth, sliderHeight);
  
  // 2. Draw Handle (Thumb)
  let handleX = map(targetAngle, 0, 180, sliderX - sliderWidth/2, sliderX + sliderWidth/2);
  fill(0);
  circle(handleX, sliderY, 20);
  
  // 3. Draw Angle Text
  fill(0);
  textSize(64);
  textFont('monospace');
  let angleDisplay = floor(targetAngle);
  if (angleDisplay === 0) {
    text(`OFF`, width / 2, height / 2 - 100);
  } else {
    text(`${angleDisplay}°`, width / 2, height / 2 - 100);
  }
  
  // 4. Status
  textSize(12);
  fill(150);
  let statusText = port ? "SYNCING TO ARDUINO" : "OFFLINE - CLICK CONNECT";
  text(statusText, width / 2, height / 2 + 60);
  
  // 5. Serial Communication (Throttled)
  if (port && port.writable) {
    let now = millis();
    if (abs(floor(targetAngle) - lastSentAngle) >= 1 && now - lastSentTime > 50) {
      sendToSerial(floor(targetAngle));
      lastSentAngle = floor(targetAngle);
      lastSentTime = now;
    }
  }
}

async function sendToSerial(val) {
  try {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(val + "\n"));
    writer.releaseLock();
  } catch (err) {}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
