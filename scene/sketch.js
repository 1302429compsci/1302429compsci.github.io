// Interactive Scene
// Matthew Laskowski
// Sept 22 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function mouseWheel(event) {
  if (event.delta > 0) {
    direction = "up";
  } 
  else {
    direction = "down";
  }
}