let port;
let connectBtn, disconnectBtn, forgetBtn;
let targetAngle = 0;
let connectionTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  connectBtn = select('#connectBtn');
  connectBtn.mousePressed(connectToSerial);
  
  disconnectBtn = select('#disconnectBtn');
  disconnectBtn.mousePressed(disconnectSerial);

  forgetBtn = select('#forgetBtn');
  forgetBtn.mousePressed(forgetAllPorts);
  
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

async function forgetAllPorts() {
  const ports = await navigator.serial.getPorts();
  for (const p of ports) {
    await p.forget();
  }
  alert("All paired ports forgotten. Please re-connect.");
  location.reload();
}

async function connectToSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    connectionTime = millis();
    connectBtn.html("Connected");
    connectBtn.style('background-color', '#eee');
    disconnectBtn.style('display', 'inline-block');
    
    // Start listening for incoming data
    readSerial(); 
  } catch (err) {
    console.error("Error connecting to serial:", err);
  }
}

async function readSerial() {
  while (port && port.readable) {
    const reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const decoded = new TextDecoder().decode(value);
        console.log("Arduino says:", decoded);
      }
    } catch (err) {
      console.error("Read failed:", err);
    } finally {
      reader.releaseLock();
    }
  }
}

async function disconnectSerial() {
  if (port) {
    try {
      await port.close();
      port = null;
      connectBtn.html("Connect to Arduino");
      connectBtn.style('background-color', '#4CAF50');
      disconnectBtn.style('display', 'none');
    } catch (err) {
      console.error("Error disconnecting:", err);
    }
  }
}

function mouseReleased() {
  // 1. Only allow sending if connected and at least 2 seconds passed since connection
  if (port && port.writable) {
    if (millis() - connectionTime > 2000) {
      sendToSerial(targetAngle);
    } else {
      console.log("Waiting for connection to stabilize...");
    }
  }
}

function draw() {
  background(255);
  
  let sliderX = width / 2;
  let sliderY = height / 2;
  let sliderWidth = min(width * 0.8, 500);
  let sliderHeight = 4;
  
  if (mouseIsPressed && mouseY > sliderY - 50 && mouseY < sliderY + 50) {
    targetAngle = floor(map(constrain(mouseX, sliderX - sliderWidth/2, sliderX + sliderWidth/2), 
                      sliderX - sliderWidth/2, sliderX + sliderWidth/2, 0, 180));
  }
  
  noStroke();
  fill(240);
  rect(sliderX, sliderY, sliderWidth, sliderHeight);
  
  let handleX = map(targetAngle, 0, 180, sliderX - sliderWidth/2, sliderX + sliderWidth/2);
  fill(targetAngle === 0 ? 200 : 0);
  circle(handleX, sliderY, 20);
  
  fill(0);
  textSize(64);
  textFont('monospace');
  if (targetAngle === 0) {
    text(`START`, width / 2, height / 2 - 100);
  } else {
    text(`${targetAngle}°`, width / 2, height / 2 - 100);
  }
  
  textSize(12);
  fill(150);
  let statusText = port ? "SLIDE AND RELEASE TO TRIGGER MOTION" : "OFFLINE - CLICK CONNECT";
  if (port && millis() - connectionTime < 2000) {
    statusText = "INITIALIZING... PLEASE WAIT";
  }
  text(statusText, width / 2, height / 2 + 60);
}

async function sendToSerial(val) {
  if (!port || !port.writable) return;
  console.log("Sending angle:", val);
  try {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(val + "\n"));
    writer.releaseLock();
  } catch (err) {
    console.error("Send failed:", err);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
