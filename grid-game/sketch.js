// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const GRASS_TILE = 0;
const WATER_TILE = 1;
const ROCK_TILE = 2;

let cols = 21;
let rows = 21;
let grid;
let cellSize;
let grassImg;
let waterImg;

async function setup() {

  createCanvas(windowWidth, windowHeight);
  grid = generateRandomTerrain(cols, rows);
  cellSize = Math.min(width, height) / cols;
  grassImg = await loadImage("grass.png");
  waterImg = await loadImage("water.png");

}

function draw() {

  background(220);
  displayGrid();

}

function displayGrid() {

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === GRASS_TILE) {
        // fill("lightgreen");
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === WATER_TILE) {
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === ROCK_TILE) {
        fill("grey");
        square(x * cellSize, y * cellSize, cellSize);
      }
    }
  }

}

function generateRandomTerrain(cols, rows) {

  let mapGen = generateEmptyField(cols, rows);

  let canBoulder;
  let rocksOnMap = 0;
  let rockOffset = 0;

  let canWater;
  let waterOnMap = 0;

  for (let y = 0; y < rows; y++) {

    for (let x = 0; x < cols; x++) {

      if (random(100) < 10 && rocksOnMap < 25 && rockOffset === 0 || random(100) < 50 && canBoulder && rocksOnMap < 25 && rockOffset < rows * 1.75) {
        mapGen[y][x] = ROCK_TILE;
        rockOffset = floor(random(0, rows * 2));
        rocksOnMap++;
      }
      else if (waterOnMap < 50 && (random(100) < 15 || canWater && random(100) < 90)) {
        mapGen[y][x] = WATER_TILE;
        if (rockOffset > 0) {
          rockOffset--;
        }
        waterOnMap++;
      }
      else {
        mapGen[y][x] = GRASS_TILE;
        if (rockOffset > 0) {
          rockOffset--;
        }
      }

      //look at every neighbour
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //don't fall off the edge
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            if (mapGen[y+i][x+j] === 1) {
              canWater = true;
              break;
            }
            else if (mapGen[y+i][x+j] === 2) {
              canBoulder = true;
              break;
            }
            else {
              canWater = false;
              canBoulder = false;
            }
          }
        }
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

function keyPressed() {

  if (key === "r") {
    grid = generateRandomTerrain(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyField(cols, rows);
  }

}

function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  //self
  toggleCell(x, y);
}

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