// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let coloration = "white";

async function setup() {
  
  // make the largest chessboard that can be made
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
  drawChessboard();

}

function draw() {
  
}

function drawChessboard() {
  
  for (let x = 0; x <= width; x += width/8) {
    for (let y = 0; y <= height; y += height/8) {
      fill(coloration);
      rect(x, y, width/8, height/8);
      colorSquare();
    }
  }
  
}

function colorSquare() {

  if (coloration === "white") {
    coloration = "black";
  }
  else {
    coloration = "white";
  }
}
