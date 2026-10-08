// Arrays and Object Notation
// Matthew Laskowski
// Sept 22 2026
//
// Extra for Experts:



// - Classes https://www.w3schools.com/js/js_classes.asp
// - Falling hearts: https://youtu.be/zH3eH3hlGoo?si=UnJIFMfQDe8ILale
// - Collision: https://editor.p5js.org/jesse_harding/sketches/xFhjZffBt

// initialize some variables
let backgroundColor = 255;
let platforms = [];
let speed = 5;
let cube;
let cubeJumping = false;
let cubeGrounded = false;
let cubeHitTop = false;
let jumpHeightMax = 0;
let speedIncreaseTime = 20;
let speedLastChanged = 0;
let timeOnStart = 0;

// get some constants ready, with the game's current state being affected by them
const START = "start";
const ACTIVE = "active";
const OVER = "game over";
let gameState = START;

// set up the canvas, the player's character, the player's starting platform, and the player's position
async function setup() {

  createCanvas(windowWidth, windowHeight);
  cube = new player(windowWidth/2, windowHeight/2);
  platforms.push(new platform(windowWidth/2, windowHeight/1.5));
  platforms.push(new platform(windowWidth/1.8, windowHeight/3));
  platforms.push(new platform(0, windowHeight/4));

}

// check which state the player is in, and act accordingly
function draw() {

  // if things haven't started, then do nothing but display red text (truly a genius start screen)
  if (gameState === START) {
    textSize(windowWidth/20);
    fill(255, 0, 0);
    text("AVOID THE PLATFORMS", windowWidth/4.5, windowHeight/2.5);
    text("LEFT CLICK TO BEGIN", windowWidth/4.25, windowHeight/1.5);
    startScreenTime();
  }

  // if the game is running, then make a background exist, make platforms do their thing, and make the player have physics and control
  // also increase the speed every once and a while and display to the player relevant information
  else if (gameState === ACTIVE) {
    background(backgroundColor);
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].updatePlatPos();
    }
    cube.updatePlayerPos();
    createPlatforms();
    showFallingPlatforms();
    cube.show();
    cube.move();
    cube.descend();
    cube.collide();
    increaseSpeed();
    displayInformation();
  }

  // if the game is over, then cease all control, and put more red text on the screen
  else if (gameState === OVER) {
    textSize(windowWidth/15);
    fill(255, 0, 0);
    text("GAME OVER", windowWidth/3.5, windowHeight/2);
  }
  
}

// make the speed of the game progressively rise
function increaseSpeed() {

  if (millis()/1000 - timeOnStart > speedLastChanged + speedIncreaseTime) {
    speedLastChanged = millis()/1000;
    speed++;
  }

}

// display information to the player, such as their time played, and level of speed
function displayInformation() {

  // change the text to something more manageable
  textSize(25);
  fill(255, 0, 0);

  //divide millis by 100 to get time in seconds, and subtract it by the time on the start screen to get somewhat accurate in game time
  text(`Time Survived: ${Math.floor(millis()/1000 - timeOnStart)}`, 0, windowHeight/25);
  text(`Level: ${speed - 4}`, 0, windowHeight/15);
  text(`Ground?: ${cubeGrounded}`, 0, windowHeight/5);

}

function startScreenTime() {

  timeOnStart = millis()/1000;

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

    if (platforms[i].platY > windowHeight) {
      platforms.splice(i, 1);
    }

  }

}

// make platforms if there's less than three on screen
function createPlatforms() {

  if (platforms.length < 3) {
    platforms.push(new platform(random(0, windowWidth - windowWidth/5), 0));
  }

}

// the platform template
class platform {

  // platforms contain the data of their x and y coordinates, their length and thickness (width), their gravity (dy), and their other corners
  constructor(platX, platY, length, thickness, dy, upLeft, upRight, downRight, downLeft) {
    this.platX = platX;
    this.platY = platY;
    this.length = random(windowWidth/8, windowWidth/3);
    this.thickness = windowHeight/25;
    // this.dy = speed * random(0.5, 0.6);
    this.dy = 0;
    this.upLeft = {x: this.platX, y: this.platY};
    this.upRight = {x: this.platX + this.length, y: this.platY};
    this.downRight = {x: this.platX + this.length, y: this.platY + this.thickness};
    this.downLeft = {x: this.platX, y: this.platY + this.thickness};
  }

  // update the corner positions constantly to keep them recent
  updatePlatPos() {
    this.upLeft = {x: this.platX, y: this.platY};
    this.upRight = {x: this.platX + this.length, y: this.platY};
    this.downRight = {x: this.platX + this.length, y: this.platY + this.thickness};
    this.downLeft = {x: this.platX, y: this.platY + this.thickness};
  }

  // make the platform visible, and color it blue for reasons only tired Matthew knows
  display() {
    fill(0, 0, 255);
    rect(this.platX, this.platY, this.length, this.thickness);
  }

  // make them fall, because there's no challenge in standing on a stationary platform, by adding gravity to the current y coordinate
  fall() {
    this.platY += this.dy;
  }

}

// the player template
class player {

  // players contain the data of their x and y coordinates, their size, and their gravity, the location of all their corners, and their previous location
  constructor(playerX, playerY, size, topLeft, topRight, gravity) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.size = windowHeight/30;
    this.topLeft = {x: this.playerX, y: this.playerY};
    this.topRight = {x: this.playerX + this.size, y: this.playerY};
    this.bottomRight = {x: this.playerX + this.size, y: this.playerY + this.size};
    this.bottomLeft = {x: this.playerX, y: this.playerY + this.size};
    this.gravity = speed;
  }

  // make the player visible, and red to contrast with the background and platforms
  show() {
    fill(255, 0, 0);
    square(this.playerX, this.playerY, this.size);
  }

  // make the player capable of movement, because that's a basic requirement of what is again a platformer
  move() {
    // d makes you go right
    if (keyIsDown("d") || keyIsDown(RIGHT_ARROW)) {
      this.playerX += speed;
    }
    // a or left arrow makes you go left
    if (keyIsDown("a") || keyIsDown(LEFT_ARROW)) {
      this.playerX -= speed;
    }
    // space or up arrow makes you jump in midair, but you can't jump infinitely, because I still know something doesn't add up there
    if ((keyIsDown(" ") || keyIsDown(UP_ARROW)) && jumpHeightMax < speed * 25 && !cubeHitTop) {
      this.playerY -= speed;
      cubeJumping = true;
      jumpHeightMax += 1;
    }
    // if you're not jumping, then let javascript know, because has not gotten any smarter
    else {
      cubeJumping = false;
    }
  }

  // make the player lose if they go off screen, and constantly be falling off screen
  descend() {

    if (!cubeGrounded && !cubeHitTop && !cubeJumping) {
      this.playerY += this.gravity;
    }
    
    if (this.playerY >= windowHeight) {
      gameState = OVER;
    }

  }

  // make sure that the corners are constantly defined
  updatePlayerPos() {
    this.topLeft = {x: this.playerX, y: this.playerY};
    this.topRight = {x: this.playerX + this.size, y: this.playerY};
    this.bottomRight = {x: this.playerX + this.size, y: this.playerY + this.size};
    this.bottomLeft = {x: this.playerX, y: this.playerY + this.size};
  }

  // make the player collide, the bane of my existence
  collide() {
    
    // go through each platform and make the collision check
    for (let i = 0; i < platforms.length; i++) {

      // top corners detection
      if (this.topLeft.x >= platforms[i].downLeft.x && this.bottomLeft.x <= platforms[i].downRight.x && this.topLeft.y >= platforms[i].upLeft.y && this.topLeft.y <= platforms[i].downLeft.y || this.topRight.x >= platforms[i].downLeft.x && this.topRight.x <= platforms[i].downRight.x && this.topRight.y >= platforms[i].upRight.y && this.topRight.y <= platforms[i].downRight.y) {
        
        // if colliding, push the player down at the speed of the platform
        console.log("collision");
        cubeHitTop = true;
        this.playerY += platforms[i].dy;
        
      }
      // else {
      //   cubeHitTop = false;
      // }

      // bottom corners detection
      if (this.bottomLeft.x >= platforms[i].upLeft.x && this.bottomLeft.x <= platforms[i].upRight.x && this.bottomLeft.y >= platforms[i].upLeft.y && this.bottomLeft.y <= platforms[i].downLeft.y || this.bottomRight.x >= platforms[i].upLeft.x && this.bottomRight.x <= platforms[i].upRight.x && this.bottomRight.y >= platforms[i].upRight.y && this.bottomRight.y <= platforms[i].downLeft.y) {
        
        console.log("collision");
        cubeGrounded = true; 
        cubeHitTop = false;
        jumpHeightMax = 0;
        this.playerY--;
        // this.playerY += platforms[i].dy;

      }
      else {
        cubeGrounded = false;
      }
      
    }

  }


}

// make it so that if you click the mouse, the game begins
function mouseClicked() {

  if (gameState === START) {
    gameState = ACTIVE;
  }

}

// and finally, one of the oldest pieces of code here, make the background color customizable with the mouse wheel
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
  
}