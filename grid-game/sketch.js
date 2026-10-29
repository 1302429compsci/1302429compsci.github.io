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
        fill("grey");
      }
      else if (grid[y][x] === 1) {
        fill("lightblue");
      }
      else if (grid[y][x] === 2) {
        fill("lightgreen");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }

}

function generateRandomTerrain(cols, rows) {

  let newGrid = [];

  let rocksOnMap = 0;
  let rockOffset = 0;

  let canWater;

  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (newGrid[y][x - 1] === 1 || newGrid[y - 1][x] === 1) {
        canWater = true;
      }
      if (random(100) < 10 && rocksOnMap < 25 && rockOffset === 0) {
        newGrid[y].push(0);
        rockOffset = floor(random(rows, rows * 3));
        rocksOnMap++;
      }
      else if (random(100) < 15 || canWater && random(100) < 50) {
        newGrid[y].push(1);
      }
      else {
        newGrid[y].push(2);
        if (rockOffset > 0) {
          rockOffset--;
        }
      }
      console.log(rockOffset);
    }
  }
  return newGrid;

}

function keyPressed() {

  if (key === "r") {
    grid = generateRandomTerrain(cols, rows);
  }
  // else if (key === "e") {
  //   grid = generateEmptyGrid(cols, rows);
  // }

}