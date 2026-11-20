// Random Grid Generation
// Matthew Laskowski
// November 21, 2026
//
// Extra for Experts:
// - Worked with classes as per usual (almost starting to wonder how long I can get away with using classes as my expert card)
// - Worked with switch/case, which was very useful in making the spell list look slightly more readable


const VERY_HIGH_NUMBER = 2**52;
const DEFAULT_PLAYER_SPEED = 500;

const GRASS_TILE = 0;
const WATER_TILE = 1;
const ROCK_TILE = 2;
const WET_ROCK_TILE = 3;
const FIRE_TILE = 4;
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
let fireImg;
let playWizImg;
let targetImg;

let playerChar;
let playerCanMove = true;
let playerAquatic = false;
let playerAnIdiot = false;
let spellTarget = {x: undefined, y: undefined};

let prevTile;

async function setup() {

  cellSize = Math.min(windowWidth, windowHeight) / cols;
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  textAlign(CENTER, CENTER);
  grid = generateRandomTerrain(cols, rows);
  grassImg = await loadImage("grass.png");
  waterImg = await loadImage("water.png");
  rockImg = await loadImage("rock.png");
  fireImg = await loadImage("fire.png");
  playWizImg = await loadImage("wizard.png");
  targetImg = await loadImage("target.png");

  playerChar = new Player(10, 19, DEFAULT_PLAYER_SPEED);
  playerChar.spawn();

}

// DRAW LOOP
// DRAW LOOP
// DRAW LOOP

function draw() {

  // display the according graphics for whatever state the game is in
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
  else if (gameState === GAME_OVER) {
    if (playerAnIdiot) {
      textSize(150);
      text("GAME OVER", windowWidth/2, windowHeight/8);
      textSize(50);
      text("Do tell, why did you think THAT was a good idea?", windowWidth/2, windowHeight/2);
    }
    else {
      textSize(150);
      text("GAME OVER", windowWidth/2, windowHeight/2);
    }
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
      else if (grid[y][x] === WET_ROCK_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(rockImg, x * cellSize, y * cellSize, cellSize, cellSize);
        // fill("grey");
        // square(x * cellSize, y * cellSize, cellSize);
      }
      else if (grid[y][x] === FIRE_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(fireImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === GRASS_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === WATER_TILE) {
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === FIRE_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(fireImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }

      if (spellTarget.x !== undefined && y === spellTarget.y && x === spellTarget.x) {
        image(targetImg, x * cellSize, y * cellSize, cellSize, cellSize);
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
            if (mapGen[y+i][x+j] === ROCK_TILE) {
              canBoulder = true;
              break;
            }
            else if (mapGen[y+i][x+j] === WATER_TILE) {
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

  if (gameState === PLAYING_GAME) {
    if (key === "e") {
      let spellCast = prompt("Abracadabra alakazam you cast:");
      playerChar.castSpell(spellCast);
    }
    if (keyIsDown("w") && keyIsDown("d")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY - 1);
    }
    if (keyIsDown("a") && keyIsDown("w")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY - 1);
    }
    if (keyIsDown("s") && keyIsDown("a")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY + 1);
    }
    if (keyIsDown("d") && keyIsDown("s")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY + 1);
    }
    if (keyIsDown("w")) {
      playerChar.move(playerChar.playX, playerChar.playY - 1);
    }
    if (keyIsDown("a")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY);
    }
    if (keyIsDown("s")) {
      playerChar.move(playerChar.playX, playerChar.playY + 1);
    }
    if (keyIsDown("d")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY);
    }
  
    // if (key === "r") {
    //   grid = generateRandomTerrain(cols, rows);
    // }
    // else if (key === "e") {
    //   grid = generateEmptyField(cols, rows);
    // }
  }

}

function mousePressed() {
  if (gameState === TITLE_SCREEN) {
    gameState = PLAYING_GAME;
  }
  else if (gameState === PLAYING_GAME) {
    if (mouseButton.left) {
      spellTarget.x = Math.floor(mouseX/cellSize);
      spellTarget.y = Math.floor(mouseY/cellSize);
    }
    else if (mouseButton.center) {
      let spellCast = prompt("Bippity Boppity you cast:");
      playerChar.castSpell(spellCast);
    }
  }
}

// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS

// function toggleCell(x, y) {
//   //make sure you're in the grid
//   if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== PLAYER_ON_TILE) {
//     if (mouseButton.left) {
//       if (grid[y][x] < ROCK_TILE) {
//         grid[y][x]++;
//       }
//       else {
//         grid[y][x] = GRASS_TILE;
//       }
//     }
//     else if (mouseButton.center) {
//       if (grid[y][x] > GRASS_TILE) {
//         grid[y][x]--;
//       }
//       else {
//         grid[y][x] = ROCK_TILE;
//       }
//     }
//   }

// }

function shiftBackgroundColor() {

  backgroundRed += random(-2, 2);
  backgroundGreen += random(-2, 2);
  backgroundBlue += random(-2, 2);

}

// PLAYER CLASS
// PLAYER CLASS
// PLAYER CLASS
class Player {

  constructor(playX, playY, playSpeed) {
    this.playX = playX;
    this.playY = playY;
    this.playSpeed = playSpeed;
  }

  move(x, y) {

    if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== ROCK_TILE && playerCanMove) {
      grid[this.playY][this.playX] = prevTile;
      console.log(prevTile);
      this.playX = x;
      this.playY = y;
      prevTile = grid[y][x];
      grid[this.playY][this.playX] = PLAYER_ON_TILE;
      this.playerMoveToggle();
      this.currentPlayerSpeed();
      window.setTimeout(this.playerMoveToggle, this.playSpeed);
    }
  }

  spawn() {
    prevTile = grid[this.playY][this.playX];
    grid[this.playY][this.playX] = PLAYER_ON_TILE;
  }

  playerMoveToggle() {
    playerCanMove = !playerCanMove;
  }

  currentPlayerSpeed() {
    if (playerAquatic && prevTile === WATER_TILE) {
      this.playSpeed = DEFAULT_PLAYER_SPEED / 2;
    }
    else {
      this.playSpeed = DEFAULT_PLAYER_SPEED;
    }
  }

  castSpell(spell) {
    if (spellTarget.y && spellTarget.x) {
      switch (spell.toLowerCase()) {
        // case "Fireball":
        case "dehydrate":
        case "drink":
          if (grid[spellTarget.y][spellTarget.x] === WET_ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = ROCK_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === WATER_TILE) {
            grid[spellTarget.y][spellTarget.x] = GRASS_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE && prevTile === WATER_TILE) {
            prevTile = GRASS_TILE;
          }
          break;
        case "destroy":
        case "eradicate":
          if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            playerAnIdiot = true;
            gameState = GAME_OVER;
          }
          else if (grid[spellTarget.y][spellTarget.x] !== GRASS_TILE) {
            grid[spellTarget.y][spellTarget.x] = GRASS_TILE;
          }
          break;
        case "die":
          if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            playerAnIdiot = true;
            gameState = GAME_OVER;
          }
          break;
        case "erosion":
          if (grid[spellTarget.y][spellTarget.x] === WET_ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = WATER_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = GRASS_TILE;
          }
          break;
        case "fireball":
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (grid[spellTarget.y+i][spellTarget.x+j] === GRASS_TILE) {
                grid[spellTarget.y+i][spellTarget.x+j] = FIRE_TILE;
              }
              else if (grid[spellTarget.y+i][spellTarget.x+j] === PLAYER_ON_TILE && prevTile === GRASS_TILE) {
                prevTile = FIRE_TILE;
              }
            }
          }
          break;
        case "flood":
          if (grid[spellTarget.y][spellTarget.x] === WATER_TILE || grid[spellTarget.y][spellTarget.x] === WET_ROCK_TILE) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (grid[spellTarget.y+i][spellTarget.x+j] === ROCK_TILE) {
                  grid[spellTarget.y+i][spellTarget.x+j] = WET_ROCK_TILE;
                }
                else if (grid[spellTarget.y+i][spellTarget.x+j] === PLAYER_ON_TILE) {
                  prevTile = WATER_TILE;
                }
                else if (grid[spellTarget.y+i][spellTarget.x+j] === GRASS_TILE || grid[spellTarget.y+i][spellTarget.x+j] === FIRE_TILE) {
                  grid[spellTarget.y+i][spellTarget.x+j] = WATER_TILE;
                }
              }
            }
          }
          break;
        case "hydrate":
        case "water":
          if (grid[spellTarget.y][spellTarget.x] === ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = WET_ROCK_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            prevTile = WATER_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === GRASS_TILE || grid[spellTarget.y][spellTarget.x] === FIRE_TILE) {
            grid[spellTarget.y][spellTarget.x] = WATER_TILE;
          }
          break;
        case "rock":
        case "boulder":
          if (grid[spellTarget.y][spellTarget.x] === WATER_TILE) {
            grid[spellTarget.y][spellTarget.x] = WET_ROCK_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] !== PLAYER_ON_TILE) {
            grid[spellTarget.y][spellTarget.x] = ROCK_TILE;
          } 
          break;
        case "swim":
          if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            playerAquatic = true;
          }
          break;
        // case "trap":
        //   if (grid[spellTarget.y][spellTarget.x] === ROCK_TILE || grid[spellTarget.y][spellTarget.x] === WET_ROCK_TILE) {

        //   break;
        default:
          alert("Hey there, what you just typed isn't recognizable language that my javascript case statements can handle. Maybe just cast fireball?");
      }
    }
  }

} // End Player Class