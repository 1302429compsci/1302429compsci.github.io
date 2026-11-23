// Random Grid Generation
// Matthew Laskowski
// November 21, 2026
//
// Extra for Experts:
// - Worked with classes as per usual (almost starting to wonder how long I can get away with using classes as my expert card)
// - Worked with switch/case, which was very useful in making the spell list look slightly more readable


// constants related to the player
const DEFAULT_PLAYER_SPEED = 500;

// constants relating to grid tiles
const GRASS_TILE = 0;
const WATER_TILE = 1;
const ROCK_TILE = 2;
const WET_ROCK_TILE = 3;
const FIRE_TILE = 4;
const PLAYER_ON_TILE = 99;

// constants relating to gameState
const TITLE_SCREEN = "title screen";
const PLAYING_GAME = "playing game";
const GAME_OVER = "game over";

// variables that control the grid
let cols = 21;
let rows = 21;
let grid;
let cellSize;

// more gameState controls, with backgroundColors controlling the start screen background
let gameState = TITLE_SCREEN;
let backgroundColors = {red: 150, blue: 150, green: 150};

// all images used in the game
let grassImg;
let waterImg;
let rockImg;
let fireImg;
let playWizImg;
let targetImg;

// all player based variables, along with the player's spell target and their previous tile
let playerChar;
let playerCanMove = true;
let playerAquatic = false;
let playerAnIdiot = false;
let spellTarget = {x: undefined, y: undefined};
let prevTile;

// the setup function, where certain variables gain their values
async function setup() {

  // cellSize is determined by the window height or width, whichever is smaller, divided by 21 in variable form
  cellSize = Math.min(windowWidth, windowHeight) / cols;

  // code to center the canvas if I ever feel like changing the way the game is displayed
  let canvas = createCanvas(windowWidth, windowHeight);
  // let canvas = createCanvas(cols*cellSize, rows*cellSize);
  canvas.parent("canvas-container");

  // align all text to the center
  textAlign(CENTER, CENTER);

  // load the grid that the game uses
  grid = generateRandomTerrain(cols, rows);

  // load all images
  grassImg = await loadImage("grass.png");
  waterImg = await loadImage("water.png");
  rockImg = await loadImage("rock.png");
  fireImg = await loadImage("fire.png");
  playWizImg = await loadImage("wizard.png");
  targetImg = await loadImage("target.png");

  // set up the player
  playerChar = new Player(10, 19, "wizard");
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

// either show the title screen, everything that goes on while playing the game, or the death screen
function displayGameState() {

  // title screen showing, where text is displayed and the background color shifts randomly
  if (gameState === TITLE_SCREEN) {
    background(backgroundColors.red, backgroundColors.green, backgroundColors.blue);
    shiftBackgroundColor();
    displayTitleScreen();
  }
  // playing the game, where the background color is set, and the grid is displayed, along with a bunch of useless stat bars
  else if (gameState === PLAYING_GAME) {
    background(100, 150, 0);
    displayGrid();
    // playerChar.spellLine(); debug please ignore
    playerChar.playerStatBars();
  }
  // the game over screen, just the last frame of the playing game screen with game over on it
  else if (gameState === GAME_OVER) {
    // checks if you went out of your way to make your character die
    if (playerAnIdiot) {
      textSize(150);
      text("GAME OVER", windowWidth/2, windowHeight/8);
      textSize(50);
      text("Do tell, why did you think THAT was a good idea?", windowWidth/2, windowHeight/2);
    }
    // if not a threat to yourself, then just the normal game over screen
    else {
      textSize(150);
      text("GAME OVER", windowWidth/2, windowHeight/2);
    }
  }

}

// display all the images that go along with the grid
function displayGrid() {

  // define the image mode to use the corner because the title screen defined it and it needs redefining
  imageMode(CORNER);

  // run a loop to check what number each tile is so the correct images are used for each tile
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // if the tile is empty plains
      if (grid[y][x] === GRASS_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the tile is water
      else if (grid[y][x] === WATER_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the tile is a rock
      else if (grid[y][x] === ROCK_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(rockImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the tile is a rock and water combined
      else if (grid[y][x] === WET_ROCK_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(rockImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the tile is on fire
      else if (grid[y][x] === FIRE_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(fireImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the player is on a grass tile
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === GRASS_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the player is on a water tile
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === WATER_TILE) {
        image(waterImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      // if the player is on a fire tile, which will be a poor decision in future version when I actually add damage
      else if (grid[y][x] === PLAYER_ON_TILE && prevTile === FIRE_TILE) {
        image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(playWizImg, x * cellSize, y * cellSize, cellSize, cellSize);
        image(fireImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }

      // display the target tile of the player's next spell
      if (spellTarget.x !== undefined && y === spellTarget.y && x === spellTarget.x) {
        image(targetImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

}

// display the title screen
function displayTitleScreen() {

  // redefine images to use their center as their origin
  imageMode(CENTER);

  // put a bunch of text on screen
  textSize(Math.min(width, height)/12);
  text("WIZARDRY SHENANIGANS", width/2, height/10);
  textSize(Math.min(width, height)/35);
  text("STILL NOT EVEN REMOTELY CLOSE TO LOOKING POLISHED", width/2, height/5);
  textSize(Math.min(width, height)/20);
  text("PRESS ANY MOUSE BUTTON TO BEGIN", width/2, height/1.2);

  // also put an image of a wizard on screen to make the title screen more than just text
  image(playWizImg, width/2, height/2, width/4, height/4);

}

// GRID GENERATION
// GRID GENERATION
// GRID GENERATION

// function for generating the main grid used by the game
function generateRandomTerrain(cols, rows) {

  // generate an empty map to use to make our more detailed map
  let mapGen = generateEmptyField(cols, rows);

  // a bunch of local variables having to do with rock generation
  // variable that runs an alternate rock generation equation if true
  let canBoulder;
  // the rocks on the map
  let rocksOnMap = 0;
  // the offset from the top of the screen generated to prevent clumping at the top
  let rockStartOffset = floor(random(0, rows * 4));
  // the chance of rocks in the alt equation
  let boulderChance = 100;

  // a bunch of local variables having to do with water generation
  // the alt equation variable but water
  let canWater;
  // the amount of water on the map
  let waterOnMap = 0;
  // the starting water offset from the top of the screen
  let waterStartOffset = floor(random(0, rows * 4));
  // the chance of water appearing if the alt equation is used
  let lakeChance = 100;

  // a double for loop to look at every grid tile
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      // look at every neighbour of the given tile
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // don't fall off the edge when checking for neighbours
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            // check all neighbours for rock tiles, if so, increase the chance of rock generation, then break out of the neighbour loop
            if (mapGen[y+i][x+j] === ROCK_TILE) {
              canBoulder = true;
              break;
            }
            // same thing as the rock neighbour checking but with water
            else if (mapGen[y+i][x+j] === WATER_TILE) {
              canWater = true;
              break;
            }
            // if no neighbours are detected then the variables that increase likelihoods are set to false
            else {
              canWater = false;
              canBoulder = false;
            }
          }
        }
      }

      // if rocks have finished offsetting, there's less than 25 rocks on the map, and a 1 in 10 chance succeeds, make a rock
      // alternatively, if canBoulder is true, check if boulderChance is bigger than a random number and that there aren't too many rocks
      if (rockStartOffset === 0 && (random(100) < 10 && rocksOnMap < 25 || random(100) <= boulderChance && canBoulder && rocksOnMap < 25)) {
        // turn the tile to a rock tile, adding a rock to the game's awareness
        mapGen[y][x] = ROCK_TILE;
        rocksOnMap++;
        // if water hasn't finished offsetting, let it count down
        if (waterStartOffset > 0) {
          waterStartOffset--;
        }
        // randomly bump lakeChance up or down
        lakeChance += floor(random(-5, 5));
      }
      // if water has finished offsetting, there's less than 50 water tiles on the map, and a 15/100 chance succeeds, make a water tile
      // alternatively, if canWater is true, check if lakeChance is bigger than a random number
      else if (waterStartOffset === 0 && waterOnMap < 50 && (random(100) < 15 || canWater && random(100) <= lakeChance)) {
        // turn the tile to a water tile and add that tile to the game's awareness
        mapGen[y][x] = WATER_TILE;
        waterOnMap++;
        // if the rocks haven't finished offsetting, tell them to hurry up
        if (rockStartOffset > 0) {
          rockStartOffset--;
        }
        // randomly adjust boulderChance up or down to keep things interesting
        boulderChance += floor(random(-5, 5));
      }
      // otherwise just make it a plain grass tile
      else {
        mapGen[y][x] = GRASS_TILE;
        // count down the offsets for both tiles if they're not done
        if (waterStartOffset > 0) {
          waterStartOffset--;
        }
        if (rockStartOffset > 0) {
          rockStartOffset--;
        }
        // randomly adjust the chances of clusters of rocks and water
        boulderChance += floor(random(-5, 5));
        lakeChance += floor(random(-5, 5));
      }
      
    }
  }
  
  // now that everything's done, judging from how this is outside the loop, send back the completed grid
  return mapGen;

}

// the helper to the generation of the massive terrain grid, makes only grass tiles
function generateEmptyField(cols, rows) {
  // make an empty array
  let newGrid = [];
  // make some arrays in the array equal to rows, then put cols grass tiles in that array in the bigger array
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(GRASS_TILE);
    }
  }
  // when done return the grid of grass
  return newGrid;
}

// SOMETHING WAS PRESSED FUNCTIONS
// SOMETHING WAS PRESSED FUNCTIONS
// SOMETHING WAS PRESSED FUNCTIONS

// checks for what key was pressed and what it should do
function keyPressed() {

  // only do things if the game is being played
  if (gameState === PLAYING_GAME) {

    // if E was pressed, cast a spell
    if (key === "e") {
      let spellCast = prompt("Abracadabra alakazam you cast:");
      playerChar.castSpell(spellCast);
    }
    // if W and D were pressed move diagonally right up
    if (keyIsDown("w") && keyIsDown("d")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY - 1);
    }
    // if W and A were pressed move diagonally left up
    if (keyIsDown("a") && keyIsDown("w")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY - 1);
    }
    // if A and S were pressed move diagonally left down
    if (keyIsDown("s") && keyIsDown("a")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY + 1);
    }
    // if S and D were pressed move diagonally right down
    if (keyIsDown("d") && keyIsDown("s")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY + 1);
    }
    // if W was pressed move up
    if (keyIsDown("w")) {
      playerChar.move(playerChar.playX, playerChar.playY - 1);
    }
    // if A was pressed move left
    if (keyIsDown("a")) {
      playerChar.move(playerChar.playX - 1, playerChar.playY);
    }
    // if S was pressed move down
    if (keyIsDown("s")) {
      playerChar.move(playerChar.playX, playerChar.playY + 1);
    }
    // if D was pressed move right
    if (keyIsDown("d")) {
      playerChar.move(playerChar.playX + 1, playerChar.playY);
    }

  }

}

// run things if the mouse has its buttons clicked
function mousePressed() {
  // if on the title screen, then start the game
  if (gameState === TITLE_SCREEN) {
    gameState = PLAYING_GAME;
  }
  // if the game has started, check for what kind of button it was
  else if (gameState === PLAYING_GAME) {
    // if a left click, become a target for a spell
    if (mouseButton.left) {
      spellTarget.x = Math.floor(mouseX/cellSize);
      spellTarget.y = Math.floor(mouseY/cellSize);
    }
    // if a center click, then cast a spell
    else if (mouseButton.center) {
      let spellCast = prompt("Abracadabra alakazam you cast:");
      playerChar.castSpell(spellCast);
    }
  }
}

// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS
// CHANGE SOMETHING FUNCTIONS

// currently just in here if I make a spell later that would want to use any of this
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

// function for shifting the background color
function shiftBackgroundColor() {

  // randomly shift all the rgb values up or down by 2
  backgroundColors.red += random(-2, 2);
  backgroundColors.green += random(-2, 2);
  backgroundColors.blue += random(-2, 2);

}

// PLAYER CLASS
// PLAYER CLASS
// PLAYER CLASS
class Player {

  // construct a new player with their coordinates and their role (more will be added other than just wizard, hopefully later)
  constructor(playX, playY, role) {
    this.playX = playX;
    this.playY = playY;
    this.role = role;
    // determine some other statistics based on the player's role
    switch(this.role) {
      case "wizard":
        this.playSpeed = DEFAULT_PLAYER_SPEED;
        this.playMaxHp = 100;
        this.playHp = 100;
        this.playMaxMana = 1000;
        this.playMana = 1000;
    }
  }

  // the movement function
  move(x, y) {
    // if the player isn't trying to move off the grid or into a rock, and if they are allowed to move, then let them move
    if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] !== ROCK_TILE && grid[y][x] !== WET_ROCK_TILE && playerCanMove) {
      // set the previous tile they were on to prevTile
      grid[this.playY][this.playX] = prevTile;
      console.log(prevTile);
      // set the player's position onto their new spot
      this.playX = x;
      this.playY = y;
      // the tile underneath the player is now prevTile, and set the player onto their spot
      prevTile = grid[y][x];
      grid[this.playY][this.playX] = PLAYER_ON_TILE;
      // make them unable to move for a bit after this, set the move cooldown, then engage the wait until the next move
      this.playerMoveToggle();
      this.currentPlayerSpeed();
      window.setTimeout(this.playerMoveToggle, this.playSpeed);
    }

  }

  // spawn the player
  spawn() {
    // prevTile is set to whatever tile the player is now taking over, and then the tile is taken over by the player
    prevTile = grid[this.playY][this.playX];
    grid[this.playY][this.playX] = PLAYER_ON_TILE;
  }

  // toggle whether the player can move or not
  playerMoveToggle() {
    playerCanMove = !playerCanMove;
  }

  // determine the move speed of the player, otherwise known as the duration they must wait until they can move
  currentPlayerSpeed() {
    // if under the effects of the swim spell, halve their wait timer while in water
    if (playerAquatic && prevTile === WATER_TILE) {
      this.playSpeed = DEFAULT_PLAYER_SPEED / 2;
    }
    // otherwise water slows them down by double
    else if (prevTile === WATER_TILE) {
      this.playSpeed = DEFAULT_PLAYER_SPEED * 2;
    }
    // otherwise just make the player move at normal speed
    else {
      this.playSpeed = DEFAULT_PLAYER_SPEED;
    }

  }

  // manage a bunch of currently useless stat bars
  playerStatBars() {
    // the HP bar, fill a background bar behind it with red, then fill their current HP in green
    fill(255, 0, 0);
    rect(cols * cellSize, 0, cellSize, windowHeight);
    fill(0, 255, 0);
    rect(cols * cellSize, height, cellSize, -height * (this.playHp/this.playMaxHp));

    // the Mana bar, fill the background bar with grey, then the amount of mana the player has in blue
    fill(150, 150, 150);
    rect((cols + 1) * cellSize, 0, cellSize, windowHeight);
    fill(0, 0, 255);
    rect((cols + 1) * cellSize, height, cellSize, -height * (this.playMana/this.playMaxMana));
  }

  // debug for later
  // spellLine() {
  //   if (spellTarget.x !== undefined) {
  //     noStroke();
  //     let targetX = spellTarget.x * cellSize + cellSize/2;
  //     let targetY = spellTarget.y * cellSize + cellSize/2;
  //     line(targetX, targetY, this.playX * cellSize + cellSize/2, this.playY * cellSize + cellSize/2);
  //   }
  // }

  // the spell casting function
  castSpell(spell) {
    // if the player has designated a target for their spells
    if (spellTarget.y && spellTarget.x) {
      // check what spell the player chose, with all names becoming lowercase
      switch (spell.toLowerCase()) {
        // spell that removes all traces of water from a tile
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
        // spell that removes all things from a tile or kills the player if they're present
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
        // spell that purely exists to kill the player
        case "die":
          if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            playerAnIdiot = true;
            gameState = GAME_OVER;
          }
          break;
        // spell that destroys rock tiles
        case "erosion":
          if (grid[spellTarget.y][spellTarget.x] === WET_ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = WATER_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] === ROCK_TILE) {
            grid[spellTarget.y][spellTarget.x] = GRASS_TILE;
          }
          break;
        // spell that summons fire in a 3x3 area
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
        // spell that allows you to surround a pre existing water tile in more water tiles
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
        // spell that allows you to turn a non water tile into a water tile
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
        // spell that turns a tile into a rock tile, provided the player isn't present
        case "rock":
        case "boulder":
          if (grid[spellTarget.y][spellTarget.x] === WATER_TILE) {
            grid[spellTarget.y][spellTarget.x] = WET_ROCK_TILE;
          }
          else if (grid[spellTarget.y][spellTarget.x] !== PLAYER_ON_TILE) {
            grid[spellTarget.y][spellTarget.x] = ROCK_TILE;
          } 
          break;
        // spell that doubles the player's speed in water
        case "swim":
          if (grid[spellTarget.y][spellTarget.x] === PLAYER_ON_TILE) {
            playerAquatic = true;
          }
          break;
        // default case, just in case the player enters in gibberish
        default:
          alert("Hey there, what you just typed isn't recognizable language that my javascript case statements can handle. Maybe just cast fireball?");
      }
    }
  }

} // End Player Class