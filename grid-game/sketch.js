// Random Grid Generation
// Matthew Laskowski
// November ??, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const VERY_HIGH_NUMBER = 2**52;

const GRASS_TILE = 0;
const WATER_TILE = 1;
const ROCK_TILE = 2;
const PLAYER_ON_TILE = 99;

const TITLE_SCREEN = "title screen";
const SELECT_SCREEN = "select screen";
const PLAYING_GAME = "playing game";
const GAME_OVER = "game over";

let cols = 21;
let rows = 21;
let grid;
let cellSize;
let gameState = TITLE_SCREEN;
let backgroundRed = 150;
let backgroundGreen = 150;
let backgroundBlue = 150;

let grassImg;
let waterImg;
let rockImg;
let playWizImg;

let playerChar;
let prevTile;

async function setup() {

  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  grid = generateRandomTerrain(cols, rows);
  cellSize = Math.min(width, height) / cols;
  grassImg = await loadImage("grass.png");
  waterImg = await loadImage("water.png");
  rockImg = await loadImage("rock.png");
  playWizImg = await loadImage("wizard.png");

  playerChar = new Player(10, 19);
  playerChar.spawn();

}

// DRAW LOOP
// DRAW LOOP
// DRAW LOOP

function draw() {

  displayGameState();

}

// DISPLAY FUNCTIONS
// DISPLAY FUNCTIONS
// DISPLAY FUNCTIONS

function displayGameState() {

  if (gameState === TITLE_SCREEN) {
    background(backgroundRed, backgroundGreen, backgroundBlue);
    shiftBackgroundColor();
    displayTitleScreen();
  }
  else if (gameState === PLAYING_GAME) {
    background(100, 150, 0);
    displayGrid();
  }

}

function displayGrid() {

  imageMode(CORNER);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === GRASS_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === WATER_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === ROCK_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(rockImg, x * cellSize, y * cellSize, cellSize, cellSize);
        // fill("grey");
        // square(x * cellSize, y * cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === GRASS_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === WATER_TILE) {
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

}

function displayTitleScreen() {

  imageMode(CENTER);

  textSize(100);
  text("AN OKAY GRID GAME", windowWidth/2, windowHeight/10);
  textSize(40);
  text("BY SOMEONE NOT MAKING ANOTHER PLATFORMER (FOR NOW)", windowWidth/2, windowHeight/5);
  textSize(55);
  text("PRESS ANY MOUSE BUTTON TO BEGIN", windowWidth/2, windowHeight/1.2);
  image(playWizImg, windowWidth/2, windowHeight/2, windowWidth/5, windowHeight/5);

}

// GRID GENERATION
// GRID GENERATION
// GRID GENERATION

function generateRandomTerrain(cols, rows) {

  let mapGen = generateEmptyField(cols, rows);

  let canBoulder;
  let rocksOnMap = 0;
  let rockOffset = 0;
  let rockStartOffset = floor(random(0, rows * 4));
  let boulderChance = 100;

  let canWater;
  let waterOnMap = 0;
  let waterStartOffset = floor(random(0, rows * 4));
  let lakeChance = 100;

  for (let y = 0; y < rows; y++) {

    for (let x = 0; x < cols; x++) {

      //look at every neighbour
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //don't fall off the edge
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            if (mapGen[y+i][x+j] === 2) {
              canBoulder = true;
              break;
            }
            else if (mapGen[y+i][x+j] === 1) {
              canWater = true;
              break;
            }
            else {
              canWater = false;
              canBoulder = false;
            }
          }
        }
      }

      if (rockStartOffset === 0 && (random(100) < 10 && rocksOnMap < 25 && rockOffset === 0 || random(100) <= boulderChance && canBoulder && rocksOnMap < 25)) {
        mapGen[y][x] = ROCK_TILE;
        // rockOffset = floor(random(0, rows * 2));
        rocksOnMap++;
        if (waterStartOffset > 0) {
          waterStartOffset--;
        }
        lakeChance += floor(random(-5, 5));
      }
      else if (waterStartOffset === 0 && waterOnMap < 50 && (random(100) < 15 || canWater && random(100) <= lakeChance)) {
        mapGen[y][x] = WATER_TILE;
        if (rockOffset > 0) {
          rockOffset--;
        }
        if (rockStartOffset > 0) {
          rockStartOffset--;
        }
        waterOnMap++;
        boulderChance += floor(random(-5, 5));
      }
      else {
        mapGen[y][x] = GRASS_TILE;
        if (rockOffset > 0) {
          rockOffset--;
        }
        if (waterStartOffset > 0) {
          waterStartOffset--;
        }
        if (rockStartOffset > 0) {
          rockStartOffset--;
        }
        boulderChance += floor(random(-5, 5));
        lakeChance += floor(random(-5, 5));
      }
      
    }
  }
  
  return mapGen;

}

function generateEmptyField(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(GRASS_TILE);
    }
  }
  return newGrid;
}

// SOMETHING WAS PRESSED FUNCTIONS
// SOMETHING WAS PRESSED FUNCTIONS
// SOMETHING WAS PRESSED FUNCTIONS

function keyPressed() {

  if (key === "r") {
    grid = generateRandomTerrain(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyField(cols, rows);
  }

}

function mousePressed() {
  if (gameState === TITLE_SCREEN) {
    gameState = PLAYING_GAME;
  }
  else if (gameState === PLAYING_GAME) {
    let x = Math.floor(mouseX/cellSize);
    let y = Math.floor(mouseY/cellSize);
  
    //self
    toggleCell(x, y);
  }
}

// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS

function toggleCell(x, y) {
  //make sure you're in the grid
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (mouseButton.left) {
      if (grid[y][x] < 2) {
        grid[y][x]++;
      }
      else {
        grid[y][x] = GRASS_TILE;
      }
    }
    else if (mouseButton.center) {
      if (grid[y][x] > 0) {
        grid[y][x]--;
      }
      else {
        grid[y][x] = ROCK_TILE;
      }
    }
  }

}

function shiftBackgroundColor() {

  backgroundRed += random(-2, 2);
  backgroundGreen += random(-2, 2);
  backgroundBlue += random(-2, 2);

}

// PLAYER CLASS
// PLAYER CLASS
// PLAYER CLASS
class Player {

  constructor(playX, playY) {
    this.playX = playX;
    this.playY = playY;
  }

  move(x, y) {
    if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== ROCK_TILE) {
      grid[this.playX][this.playY] = prevTile;
      this.playX = x;
      this.playY = y;
    }
  }

  spawn() {
    prevTile = grid[this.playX][this.playY];
    grid[this.playX][this.playY] = PLAYER_ON_TILE;
  }

}