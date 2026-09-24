// Interactive Scene
// Matthew Laskowski
// Sept 22 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let direction;
let backgroundColor = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(backgroundColor);
  box();
  orbitControl();
}

function mouseWheel(event) {
  if (event.delta > 0) {
    if (backgroundColor > 0) {
      backgroundColor--;
    }
  } 
  else {
    if (backgroundColor < 255) {
      backgroundColor++;
    }
  }
  console.log(backgroundColor);
}