// Interactive Scene
// Matthew Laskowski
// Sept 22 2026
//
// Extra for Experts:
// - I wanted to try and experiment with classes for making plenty of falling objects
// - This led to me doing some research on classes, here's one of the classes links that explained it well: https://www.w3schools.com/js/js_classes.asp
// - Then I found this video, on how to make falling hearts: https://youtu.be/zH3eH3hlGoo?si=UnJIFMfQDe8ILale
// - It didn't tell me exactly how to do things in my context, but that's all good with me, still also taught me some stuff with arrays
// - Also kept my original experiments with the mouse wheel in the code, because clearly it looks very expert, and it adds artificial difficulty
// - After much struggling I quote this video for how to make smooth movement: https://youtu.be/MA_aFQV9vss?si=l6ohv9xJENxbGvmj

let backgroundColor = 255;
let platforms = [];
let speed = 2;
let playerX;
let playerY;
let jumpHeightMax = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  new platform(windowWidth/2, windowHeight/1.9, windowWidth/2);
  playerX = windowWidth/2;
  playerY = windowHeight/2;
}

function draw() {

  background(backgroundColor);
  createPlatforms();
  showFallingPlatforms();
  showPlayer();
  
}

function showFallingPlatforms() {

  for (let i = 0; i < platforms.length; i++) {
    platforms[i].display();
    platforms[i].fall();
  }

  for (let i = 0; i < platforms.length; i++) {

    if (platforms[i].y > windowHeight/2) {
      platforms.splice(i, 1);
    }

  }

}

function createPlatforms() {

  if (platforms.length < 3) {
    platforms.push(new platform(random(0, windowWidth), 0));
  }

}

class platform {

  constructor(x, y, length, thickness, dy) {
    this.x = x;
    this.y = y;
    this.length = random(windowWidth/10, windowWidth/5);
    this.thickness = windowHeight/25;
    this.dy = speed;
  }

  display() {
    rect(this.x, this.y, this.length, this.thickness);
  }

  fall() {
    this.y += this.dy;
  }

}

function showPlayer() {
  square(playerX, playerY, windowWidth/25);
}

function keyPressed() {

  while (keyIsPressed) {
    if ((keyIsDown("w") || keyIsDown(UP_ARROW)) && jumpHeightMax < 100) {
      playerY += -5;
      jumpHeightMax += 5;
    }
    else if (keyIsDown("a") || keyIsDown(LEFT_ARROW)) {
      playerX += -5;
    }
    else if (keyIsDown("d") || keyIsDown(RIGHT_ARROW)) {
      playerX += 5;
    }
  }

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
