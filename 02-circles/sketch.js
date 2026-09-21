// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  createCircles();
}

function createCircles() {
  fill(random(255), random(255), random(255));
  circle(random(0, width), random(0, height), random(1, 50));
}
