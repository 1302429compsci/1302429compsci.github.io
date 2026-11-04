// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cols = 20;
let rows = 20;
let grid;
let cellSize;

async function setup() {

  createCanvas(windowWidth, windowHeight);
  grid = generateRandomTerrain(cols, rows);
  cellSize = Math.min(width, height) / 20;

}


function draw() {

  background(220);
  displayGrid();

}

function displayGrid() {

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("lightgreen");
      }
      else if (grid[y][x] === 1) {
        fill("lightblue");
      }
      else if (grid[y][x] === 2) {
        fill("grey");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }

}

function generateRandomTerrain(cols, rows) {

  let mapGen = generateEmptyField(cols, rows);

  let rocksOnMap = 0;
  let rockOffset = 0;

  let canWater;
  let waterOnMap = 0;

  for (let y = 0; y < rows; y++) {

    for (let x = 0; x < cols; x++) {

      if (random(100) < 10 && rocksOnMap < 25 && rockOffset === 0) {
        mapGen[y][x] = 2;
        rockOffset = floor(random(rows, rows * 3));
        rocksOnMap++;
      }
      else if (waterOnMap < 50 && (random(100) < 15 || canWater && random(100) < 75)) {
        mapGen[y][x] = 1;
        if (rockOffset > 0) {
          rockOffset--;
        }
        waterOnMap++;
      }
      else {
        mapGen[y][x] = 0;
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
            }
            else {
              canWater = false;
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
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function keyPressed() {

  if (key === "r") {
    grid = generateRandomTerrain(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyGrid(cols, rows);
  }

}