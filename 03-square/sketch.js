// Square Moving Around Edge of Screen
let x;
let y;
let s;
let dx;
let dy;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  x = 0;
  y = 0;
  if (windowWidth <= windowHeight) {
    s = windowWidth/15;
    wx = windowWidth/60;
  }
  else {
    s = windowHeight/15;
    wx = windowHeight/60;
  }
  dx = wx;
  dy = 0;
}

function draw() {
  background(220);
  createSquare();
  moveSquare();
}

function createSquare() {
  fill("black");
  square(x, y, s);
}

function moveSquare() {
  if (x >= windowWidth - s) {
    if (y <= windowHeight - s) {
      dx = 0;
      dy = wx;
    }
    else {
      dx = -wx;
      dy = 0;
    }
  }
  else if (x <= 0) {
    if (y > 0) {
      dx = 0;
      dy = -wx;
    }
    else {
      dx = wx;
      dy = 0;
    }
  }
  x += dx;
  y += dy;
}