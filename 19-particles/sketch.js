// Fireworks/Particles OOP Demo

const PARTICLES_PER_CLICK = 10000;

class Particle {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.diameter = 5;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.diameter);
  }

  update() {
    // move
    this.x += this.dx;
    this.y += this.dy;

    // fade away
    this.opacity--;
  }

  
}

let theFireworks = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let i = theFireworks.length; i >= 0; i--) {
    firework.update();
    firework.display();
  }

}

function mouseDragged() {
  for (let i = PARTICLES_PER_CLICK; i >= 0; i--) {
    let someFirework = new Particle(mouseX, mouseY);
    theFireworks.push(someFirework);
  }
}