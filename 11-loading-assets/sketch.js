// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let coinImg;
let orchestraSound;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  coinImg = await loadImage("coin.png");
  orchestraSound = await loadSound("orchestra.wav");
}

function draw() {
  background("black");

  image(coinImg, width/2, height/2);
}

function mousePressed() {
  orchestraSound.play();
}
