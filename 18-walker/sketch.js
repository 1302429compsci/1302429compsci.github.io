// Walker OOP Demo

class Walker {

  constructor(x, y, theColor) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.color = theColor;
  }

  display() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      // up
      this.y -= this.speed;
    }
    else if (choice < 50) {
      // down
      this.y += this.speed;
    }
    else if (choice < 75) {
      // left
      this.x -= this.speed;
    }
    else  {
      // right
      this.x += this.speed;
    }
  }

}

// let newell;
// let theo;
let walkers = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  // newell = new Walker(width/2, height/2, "red");
  // theo = new Walker(width/2, height/2, "blue");
  noStroke();
}

function draw() {
  // newell.move();
  // newell.display();

  // theo.display();
  // theo.move();
  let theColor = color(random(255), random(255), random(255));
  walkers.push(new Walker(random(0, width), random(0, height), theColor));
  for (let walker of walkers) {
    walker.move();
    walker.display();
  }
}
