// Millis Demo

let changeColorTime = 2000;
let state = false;
let lastSwapTime = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  if (millis() > lastSwapTime + changeColorTime) {
    lastSwapTime = millis();
    state = !state;
  }

  stateColor();
  
}

function stateColor() {
  if (state === true) {
    background("black");
  }
  else {
    background("red");
  }
}