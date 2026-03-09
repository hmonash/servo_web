let port;
let connectBtn, disconnectBtn, forgetBtn;
let targetAngle = 0;

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
    connectBtn.html("Connected");
    connectBtn.style('background-color', '#eee');
    disconnectBtn.style('display', 'inline-block');
  } catch (err) {
    console.error("Error connecting to serial:", err);
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
  // 1. Send the command when the user lets go of the bar
  if (port && port.writable && targetAngle > 0) {
    sendToSerial(targetAngle);
    
    // 2. SNAP BACK TO ZERO immediately
    targetAngle = 0;
  }
}

function draw() {
  background(255);
  
  let sliderX = width / 2;
  let sliderY = height / 2;
  let sliderWidth = min(width * 0.8, 500);
  let sliderHeight = 4;
  
  // Update targetAngle while dragging near the slider
  if (mouseIsPressed && mouseY > sliderY - 50 && mouseY < sliderY + 50) {
    targetAngle = floor(map(constrain(mouseX, sliderX - sliderWidth/2, sliderX + sliderWidth/2), 
                      sliderX - sliderWidth/2, sliderX + sliderWidth/2, 0, 180));
  }
  
  // Draw Slider Track
  noStroke();
  fill(240);
  rect(sliderX, sliderY, sliderWidth, sliderHeight);
  
  // Draw Handle (Thumb)
  let handleX = map(targetAngle, 0, 180, sliderX - sliderWidth/2, sliderX + sliderWidth/2);
  fill(targetAngle === 0 ? 200 : 0); // Gray if 0, Black if moved
  circle(handleX, sliderY, 20);
  
  // Draw Angle Text
  fill(0);
  textSize(64);
  textFont('monospace');
  if (targetAngle === 0) {
    text(`OFF`, width / 2, height / 2 - 100);
  } else {
    text(`${targetAngle}°`, width / 2, height / 2 - 100);
  }
  
  // Instructions
  textSize(12);
  fill(150);
  let statusText = port ? "SLIDE AND RELEASE TO TRIGGER MOTION" : "OFFLINE - CLICK CONNECT";
  text(statusText, width / 2, height / 2 + 60);
}

async function sendToSerial(val) {
  if (!port || !port.writable) return;
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