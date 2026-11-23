// Walker OOP Demo

class Walker {

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.color = color;
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

let newell;
let theo;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  newell = new Walker(width/2, height/2, "red");
  theo = new Walker(width/2, height/2, "blue");
  noStroke();
}

function draw() {
  newell.move();
  newell.display();

  theo.display();
  theo.move();
}
