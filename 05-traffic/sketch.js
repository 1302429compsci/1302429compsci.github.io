// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

const GREEN = "green";
const YELLOW = "yellow";
const RED = "red";
let greenTime = 5000;
let yellowTime = 2000;
let redTime = 7500;
let state = GREEN;
let lastSwapTime = 0;

async function setup() {
  createCanvas(600, 600);
}

function draw() {
  // background(255);
  drawOutlineOfLights();
  lightTimer();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  if (state === GREEN) {
    fill("white");
    ellipse(width/2, height/2 - 65, 50, 50); //top
    ellipse(width/2, height/2, 50, 50); //middle
    fill("green");
    ellipse(width/2, height/2 + 65, 50, 50);
  }
  else if (state === YELLOW) {
    fill("white");
    ellipse(width/2, height/2 - 65, 50, 50); //top
    fill("yellow");
    ellipse(width/2, height/2, 50, 50); //middle
    fill("white");
    ellipse(width/2, height/2 + 65, 50, 50);
  }
  else if (state === RED) {
    fill("red");
    ellipse(width/2, height/2 - 65, 50, 50); //top
    fill("white");
    ellipse(width/2, height/2, 50, 50); //middle
    ellipse(width/2, height/2 + 65, 50, 50);
  }
  
}

function lightTimer() {
  if (state === GREEN && millis() >= greenTime + lastSwapTime) {
    lastSwapTime = millis();
    state = YELLOW;
  }
  else if (state === YELLOW && millis() >= yellowTime + lastSwapTime) {
    lastSwapTime = millis();
    state = RED;
  }
  else if (state === RED && millis() >= redTime + lastSwapTime) {
    lastSwapTime = millis();
    state = GREEN;
  }
  console.log(state);
}