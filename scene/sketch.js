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
// - And now I quote this for collision: https://editor.p5js.org/jesse_harding/sketches/xFhjZffBt

// initialize some variables
let backgroundColor = 255;
let platforms = [];
let startingPlatform;
let speed = 5;
let cube;
let cubeJumping = false;
// let cubeGrounded;
let jumpHeightMax = 0;

// get some constants ready, with the game's current state being affected by them
const START = "start";
const ACTIVE = "active";
const OVER = "game over";
let gameState = START;

// set up the canvas, the player's character, the player's starting platform, and the player's position
async function setup() {

  createCanvas(windowWidth, windowHeight);
  cube = new player(windowWidth/2, windowHeight/2);
  startingPlatform = platforms.push(new platform(windowWidth/2, windowHeight/1.9, windowWidth/2, windowHeight/25, speed * 0.5));
  playerX = windowWidth/2;
  playerY = windowHeight/2;

}

// check which state the player is in, and act accordingly
function draw() {

  // if things haven't started, then do nothing but display red text (truly a genius start screen)
  if (gameState === START) {
    textSize(windowWidth/20);
    fill(255, 0, 0);
    text("LEFT CLICK TO BEGIN", windowWidth/4.25, windowHeight/2);
  }

  // if the game is running, then make a background exist, make platforms do their thing, and make the player have physics and control
  else if (gameState === ACTIVE) {
    background(backgroundColor);
    createPlatforms();
    showFallingPlatforms();
    cube.show();
    cube.move();
    cube.fall();
    // cube.collide();
  }

  // if the game is over, then cease all control, and put more red text on the screen
  else if (gameState === OVER) {
    textSize(windowWidth/15);
    fill(255, 0, 0);
    text("GAME OVER", windowWidth/3.5, windowHeight/2);
  }
  
}

// make the platforms visible, make them descend, and if they ever fall off the screen, then remove them to avoid lag
function showFallingPlatforms() {

  // descent and visibility
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].display();
    platforms[i].fall();
  }

  // removal of unseen platforms
  for (let i = 0; i < platforms.length; i++) {

    if (platforms[i].y > windowHeight) {
      platforms.splice(i, 1);
    }

  }

}

// make platforms if there's not enough on screen
function createPlatforms() {

  if (platforms.length < 3) {
    platforms.push(new platform(random(0, windowWidth), 0));
  }

}

// the platform template
class platform {

  // platforms contain the data of their x and y coordinates, their length and thickness (width), and their gravity (dy)
  constructor(x, y, length, thickness, dy) {
    this.x = x;
    this.y = y;
    this.length = random(windowWidth/10, windowWidth/5);
    this.thickness = windowHeight/25;
    this.dy = speed * 0.75;
  }

  // make the platform visible, and color it blue for reasons only tired Matthew knows
  display() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.length, this.thickness);
  }

  // make them fall, because there's no challenge in standing on a stationary platform, by adding gravity to the current y coordinate
  fall() {
    this.y += this.dy;
  }

}

// the player template
class player {

  // players contain the data of their x and y coordinates, their size, and their gravity
  constructor(playerX, playerY, size, gravity) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.size = 25;
    this.gravity = speed;
  }

  // make the player visible, and red to contrast with the background and platforms
  show() {
    fill(255, 0, 0);
    square(this.playerX, this.playerY, this.size);
  }

  // make the player capable of movement, because that's a basic requirement of a platformer
  move() {
    // d makes you go right
    if (keyIsDown("d") || keyIsDown(RIGHT_ARROW)) {
      this.playerX += speed;
    }
    // a or left arrow makes you go left
    if (keyIsDown("a") || keyIsDown(LEFT_ARROW)) {
      this.playerX -= speed;
    }
    // space or up arrow makes you jump, but you can't jump infinitely, because even I know something doesn't add up there
    if ((keyIsDown(" ") || keyIsDown(UP_ARROW)) && jumpHeightMax < speed * 25) {
      this.playerY -= speed;
      cubeJumping = true;
      jumpHeightMax += 1;
    }
    // if you're not jumping, then let javascript know, because javascript won't know otherwise
    else {
      cubeJumping = false;
    }
  }

  // make the player also have gravity in the same way the the platforms do, only slightly faster I think
  fall() {

    if (this.playerY < windowHeight && !cubeJumping) {
      this.playerY += this.gravity;
    }

  }

  // make the player collide with the platforms, which can't be that hard, right? "Matthew, Thursday, 9:40pm"
  collide() {
    
  }


}

// make it so that if you click the mouse, the game begins
function mouseClicked() {

  if (gameState === START) {
    gameState = ACTIVE;
  }

}

// and finally, the oldest piece of code here, make the background color customizable with the mouse wheel
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
