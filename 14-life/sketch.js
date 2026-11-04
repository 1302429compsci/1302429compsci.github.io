// 2d rectangular grid demo

const CELL_SIZE = 25;
const RENDER_ON_MULTIPLES_OF = 10;

let rows;
let cols;
let grid;
let autoPlayIsOn = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);
  if (autoPlayIsOn && frameCount % RENDER_ON_MULTIPLES_OF === 0) {
    grid = updateGrid();
  }
  displayGrid();
}

function updateGrid() {
  // make another array to hold next turn
  let nextTurn = generateEmptyGrid(cols, rows);

  // look at every cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbours = 0;

      // look at every neighbour
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // don't fall off the edge
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            neighbours += grid[y+i][x+j];
          }
        }
      }

      // don't count self
      neighbours -= grid[y][x];

      // apply the rules
      if (grid[y][x] === 0) { // currently dead
        if (neighbours === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }

      if (grid[y][x] === 1) { // alive
        if (neighbours === 2 || neighbours === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }
    }
  }
  return nextTurn;
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  // self
  toggleCell(x, y);
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyGrid(cols, rows);
  }
  else if (key === " ") {
    grid = updateGrid();
    console.log(grid);
  }
  else if (key === 'a') {
    autoPlayIsOn = !autoPlayIsOn;
  }
}

function toggleCell(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] === 1) {
      grid[y][x] = 0;
    }
    else {
      grid[y][x] = 1;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("black");
      }
      else if (grid[y][x] === 1) {
        fill("white");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(1);
    }
  }
  return newGrid;
}