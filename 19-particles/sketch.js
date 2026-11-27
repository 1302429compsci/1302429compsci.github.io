// Fireworks/Particles OOP Demo

const PARTICLES_PER_CLICK = 100000;

class Particle {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.diameter = 5;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
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

  removeParticle() {
    if (this.opacity === 0) {
      return true;
    }
    else if (random(100) < 99) {
      return true;
    }
    else {
      return false;
    }
  }
  
}

let theFireworks = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  for (let firework of theFireworks) {
    if (firework.removeParticle()) {
      let index = theFireworks.indexOf(firework);
      theFireworks.splice(index, 1);
    }
    else {
      firework.update();
      firework.display();
    }
  }

}

function mousePressed() {
  for (let i = PARTICLES_PER_CLICK; i >= 0; i--) {
    let someFirework = new Particle(mouseX, mouseY);
    theFireworks.push(someFirework);
  }
}