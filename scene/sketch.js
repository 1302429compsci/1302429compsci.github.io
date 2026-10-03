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

// if you ever wonder where the platformer part of this went, gravity wasn't working with collision, so this is plan B, stay on the screen
// some of that code is just commented out just in case I come back to this project later

// initialize some variables
let backgroundColor = 255;
let platforms = [];
let speed = 5;
let cube;
let cubeJumping = false;
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
  playerX = windowWidth/2;
  playerY = windowHeight/2;

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
    cube.lose();
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
    this.dy = speed * random(0.5, 0.6);
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
  constructor(playerX, playerY, size, topLeft, topRight,) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.size = windowHeight/30;
    this.topLeft = {x: this.playerX, y: this.playerY};
    this.topRight = {x: this.playerX + this.size, y: this.playerY};
    // this.bottomRight = {x: this.playerX + this.size, y: this.playerY + this.size};
    // this.bottomLeft = {x: this.playerX, y: this.playerY + this.size};
  }

  // make the player visible, and red to contrast with the background and platforms
  show() {
    fill(255, 0, 0);
    square(this.playerX, this.playerY, this.size);
  }

  // make the player capable of movement, because that's a basic requirement of what is no longer a platformer, a platformer avoider perhaps?
  move() {
    // d makes you go right
    if (keyIsDown("d") || keyIsDown(RIGHT_ARROW)) {
      this.playerX += speed;
    }
    // a or left arrow makes you go left
    if (keyIsDown("a") || keyIsDown(LEFT_ARROW)) {
      this.playerX -= speed;
    }
    // space or up arrow makes you jump in midair, but you can't jump infinitely, because even I know something doesn't add up there
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

  // make the player lose if they go off screen
  lose() {
    
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

  // make the player collide with the platforms, which can't be that hard, right? (Matthew, Thursday, 9:40pm)
  // "what a fool I was" (Matthew, Friday, 10:40pm)
  collide() {
    
    // go through each platform and make the collision check
    for (let i = 0; i < platforms.length; i++) {

      // top corners detection
      if (this.topLeft.x >= platforms[i].downLeft.x && this.bottomLeft.x <= platforms[i].downRight.x && this.topLeft.y >= platforms[i].upLeft.y && this.topLeft.y <= platforms[i].downLeft.y || 
        this.topRight.x >= platforms[i].downLeft.x && this.topRight.x <= platforms[i].downRight.x && this.topRight.y >= platforms[i].upRight.y && this.topRight.y <= platforms[i].downRight.y) {
        
        // if colliding, push the player down at the speed of the platform
        console.log("collision");
        this.playerY += platforms[i].dy;
        
      }

      // // bottom corners detection
      // if (this.bottomLeft.x >= platforms[i].upLeft.x && this.bottomLeft.x <= platforms[i].upRight.x 
      //   && this.bottomLeft.y >= platforms[i].upLeft.y && this.bottomLeft.y <= platforms[i].downLeft.y || 
      //   this.bottomRight.x >= platforms[i].upLeft.x && this.bottomRight.x <= platforms[i].upRight.x && 
      //   this.bottomRight.y >= platforms[i].upRight.y && this.bottomRight.y <= platforms[i].downLeft.y) {
      //   console.log("collision");
      //   this.playerY--;
      //   cubeGrounded = true; 
      //   cubeHitTop = false;
      //   jumpHeightMax = 0;
      // }
      
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