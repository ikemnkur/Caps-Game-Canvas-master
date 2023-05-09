

let mouseX = 0;
let mouseY = 0;
let cellX = 1;
let cellY = 1;
var canvasX = 0;
var canvasY = 0;
var idNum = 0;
var activeObj;
var soundIsplaying = false;
let gameover = false; gamestart = false;

let gameBoard;
let lastPieceClicked;
let cellClicked = [6, 6];

var canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

var boardWidth = 300;
var boardHeight = 300;
var cellWidth = canvas.width - 100;
var cellHeight = canvas.height - 100;
var ofstV = 50;
var ofstH = 50;
var pad = 5;
var boardSize = 11;


var nRow = nRow || boardSize;    // default number of rows
var nCol = nCol || boardSize;    // default number of columns

cellWidth /= nCol;            // cellWidth of a block
cellHeight /= nRow;            // cellHeight of a block

const uInput = document.getElementById('usernameInput');
const searchMsg = document.getElementById('searchMsg');
const errorMsg = document.getElementById('startErrorMsg');
const turnErrorMsg = document.getElementById('turnErrorMsg');
const winMsg = document.getElementById('winMsg');
const loseMsg = document.getElementById('loseMsg');
var username = "";
var playerNum = "";
var board = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

class Game {
  constructor() {
    //server controlled variables
    this.id = 0;
    this.p1 = "p1";
    this.p2 = "p2";
    this.turn = "p1";
    this.moveNum = 0;
    this.boardSize = 11;
    this.board = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    // const array = new Array(11).fill().map(() => new Array(11).fill());
    this.piecesP1 = [];
    this.piecesP2 = [];
    this.moves = [];
    // game creation variables
    this.time = 300;
    this.language = "English";
    this.Elo = 500;
    this.range = 100;
    //timing variables
    this.startTime = new Date();
    this.endTime = new Date();
    this.endTime.setTime(this.startTime.getTime() + (30 * 60 * 1000));
    this.mvStartTime = new Date();
    this.mvEndTime = new Date();
    this.gameStart = false;
    this.gameEnd = false;
  }
}

let game = new Game();

function playsound(sound, volume) {
  if (soundIsplaying == false) {
    soundIsplaying = true;
    var audio = new Audio(sound);
    let vol = volume;
    if (vol == null)
      vol = 1;
    audio.volume = vol;
    audio.play();
    setTimeout(soundIsplaying = false, audio.duration + 500)
    // console.log("sound is playing");
  } else {
    // console.log("sound is already playing");
  }
}

function drawBoard() {
  drawWhiteSpace();
  drawCheckeredBackground();
}

function drawWhiteSpace() {
  var ctx = canvas.getContext("2d");
  ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
}

function drawCheckeredBackground() {
  var ctx = canvas.getContext("2d");
  var cnt = 0;
  for (var y = 0; y < boardSize; y++) {
    for (var x = 0; x < boardSize; x++) {
      cnt++;
      // if 
      if ((cnt % 2 == 0 && y % 2 == 0) || (cnt % 2 == 0 && y % 2 == 1)) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(50 + x * cellWidth, 50 + y * cellHeight, cellWidth, cellHeight); // y-offest 50
      } else {
        //     console.log("cell: ", x * 8 + y);
      }
    }
  }
}

function updateHUD() {
  // gameCanvasState.valid = false;
  // gameCanvasState.
  // draw mouse position
  let ofst1 = 20; let ofst1x = 10;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width / 2, ofstV);  // (0,0) the top left of the canvas
  ctx.fillStyle = "#000000";
  ctx.fillText("X: " + mouseX + ", Y: " + mouseY, ofst1x, ofst1);
  // Draw clicked Cell
  let txtlen = 50;
  ctx.clearRect(canvas.width / 2 - txtlen, 0, canvas.width + txtlen, ofstV);  // (0,0) the top left of the canvas
  ctx.fillStyle = "#FF0000";
  ctx.fillText("Cell: [" + cellX + "," + cellY + "]", canvas.width / 2 - txtlen, ofst1);
  let position = document.getElementById("position");
  position.innerText = "Square: [" + cellX + "," + cellY + "]";
  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.strokeRect(cellClicked[0] * 50 + 1, canvas.height - cellClicked[1] * 50 - 50 + 1, cellWidth - 1, cellHeight - 1);
  // gameCanvasState.valid = true;

}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "16px Arial";

canvas.addEventListener("mousemove", function (e) {
  var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and cellWidth/cellHeight
  canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
  canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
  mouseX = canvasX;
  mouseY = Math.abs(canvas.height - canvasY);
  // draw mouse position
  // let ofst1 = 20; let ofst1x = 10;
  // var ctx = canvas.getContext("2d");
  // ctx.clearRect(0, 0, canvas.width / 3, ofstV);  // (0,0) the top left of the canvas
  // ctx.fillStyle = "#000000";
  // ctx.fillText("X: " + mouseX + ", Y: " + mouseY, ofst1x, ofst1);

  if (ofstV - pad <= mouseY && mouseY <= canvas.height - ofstV - pad) {
    if (ofstH + pad <= mouseX && mouseX <= canvas.width - ofstH + pad) {
      cellX = Math.floor((mouseX - ofstH - pad) / cellWidth) + 1;
      cellY = Math.floor((mouseY - ofstV - pad) / cellHeight) + 1;
      updateHUD();
    }
  }
  // console.log("Mouse (X,Y): [" + mouseX + ", " + mouseY + "]");
  // console.log("Cell: [" + cellX + ", " + cellY + "]");
});

// Piece Class
function Piece(x, y, r, fill, color, rank) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 1;
  this.fill = fill || '#AAAAAA';
  this.rank = rank || 1;
  this.id = idNum++;
  this.clicked = false;
  this.type = 'piece';
  this.color = color;
  this.cellX = 0;
  this.cellY = 0;
  this.xprev = 0;
  this.yprev = 0;
}

// Draws this shape to a given context
Piece.prototype.draw = function (ctx) {
  ctx.strokeStyle = this.fill;
  ctx.beginPath();
  if (this.color == "blue")
    ctx.fillStyle = "#3333FF";
  if (this.color == "red")
    ctx.fillStyle = "#FF3333";
  if (this.color == "green")
    ctx.fillStyle = "#33FF33";
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fill();

  ctx.lineWidth = 2;
  if (this.clicked == false) {
    ctx.strokeStyle = '#006600';
  } else {
    ctx.strokeStyle = '#FFCC00';
  }
  ctx.stroke();
  ctx.fillStyle = "#CCCCCC";
  ctx.font = "20px Impact";
  let fontSize = 10;
  ctx.fillText(this.rank, this.x - fontSize / 2, this.y + fontSize / 2);
  ctx.font = "16px Arial";
}

Piece.prototype.contains = function (mx, my) {
  return Math.sqrt((mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y)) < this.r;
}

Piece.prototype.center = function (mx, my) {
  cellX = Math.floor((mx - ofstH - pad) / cellWidth) + 1;
  cellY = Math.floor((Math.abs(canvas.height - my) - ofstV) / cellHeight) + 1;
  this.cellX = cellX;
  this.cellY = cellY;
  let x = cellX * 50 + 25;
  let y = cellY * 50 + 25;
  console.log("pos: ", "(", x, ",", y, ")");
  this.xprev = this.x;
  this.yprev = this.y;
  this.x = x;
  this.y = Math.abs(canvas.height - y);
}

// Crown
function Crown(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 1;
  this.id = "crown";
  this.type = 'crown';
  this.clicked = false;
  this.img = new Image();
  this.imgSelected = new Image();
  this.imgSelected.src = "crownSelected.png";
  this.img.src = "crown.png";
  this.height = 32;
  this.width = 40;
  this.cellX = 0;
  this.cellY = 0;
  this.xprev = 0;
  this.yprev = 0;
}

// Draws crown image to a given context
Crown.prototype.draw = function (ctx) {
  ctx.fillStyle = "#66FF66";
  ctx.strokeStyle = "#AA99AA";
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r + 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  if (this.clicked) {
    ctx.drawImage(this.imgSelected, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  } else {
    ctx.drawImage(this.img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
}

Crown.prototype.contains = function (mx, my) {
  return Math.sqrt((mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y)) < this.r;
}

Crown.prototype.center = function (mx, my) {
  cellX = Math.floor((mx - ofstH - pad) / cellWidth) + 1;
  cellY = Math.floor((Math.abs(canvas.height - my) - ofstV) / cellHeight) + 1;
  this.cellX = cellX;
  this.cellY = cellY;
  let x = cellX * 50 + 25;
  let y = cellY * 50 + 25;
  console.log("pos: ", "(", x, ",", y, ")");
  this.xprev = this.x;
  this.yprev = this.y;
  this.x = x;
  this.y = Math.abs(canvas.height - y);
}

function findCenter(cellX, cellY) {
  let x = cellX * 50 + 25;
  let y = cellY * 50 + 25;
  console.log("pos: ", "(", x, ",", y, ")");
  return [x, y];
}

// Circle Class
function Circle(x, y, r, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 1;
  this.fill = fill || '#AAAAAA';
  this.id = idNum++;
  this.type = 'circle';
}

// Draws this shape to a given context
Circle.prototype.draw = function (ctx) {
  ctx.strokeStyle = this.fill;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.stroke();
}

Circle.prototype.contains = function (mx, my) {
  return Math.sqrt((mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y)) < this.r;
}

// Rectangle Class
function Shape(x, y, w, h, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
  this.id = idNum++;
  this.type = 'rect';
}

Shape.prototype.draw = function (ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

Shape.prototype.contains = function (mx, my) {
  return (this.x <= mx) && (this.x + this.w >= mx) &&
    (this.y <= my) && (this.y + this.h >= my);
}

// Rectangle Class
function CellSelect(x, y, w, h, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
  this.id = idNum++;
  this.type = 'rect';
}

function gameCanvasState(canvas) {
  // **** First some setup! ****

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
    this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
    this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****

  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = []; // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;

  // **** Then events! ****

  // This is an example of a closure!
  // Right here "this" means the gameCanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular gameCanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
  }, false);

  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function (e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    var l = shapes.length;

    if ((cellClicked[0] % 2 == 0 && cellClicked[1] % 2 == 0) || (cellClicked[0] % 2 == 1 && cellClicked[1] % 2 == 1)) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(cellClicked[0] * 50 + 2, canvas.height - cellClicked[1] * 50 - 50 + 2, cellWidth - 3, cellHeight - 3);
    } else {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeRect(cellClicked[0] * 50 + 2, canvas.height - cellClicked[1] * 50 - 50 + 2, cellWidth - 2, cellHeight - 2);
    }

    cellClicked[0] = Math.floor((mx - ofstH - pad) / cellWidth) + 1;
    cellClicked[1] = Math.floor((Math.abs(canvas.height - my) - ofstV) / cellHeight) + 1;

    for (var i = l - 1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        if (mySel.color == "red" && playerNum == "p1") {
          return;
        }
        if (mySel.color == "blue" && playerNum == "p2") {
          return;
        }
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        mySel.clicked = true;
        playsound("click.mp3");
        console.log("id: ", mySel.id, "type: " + mySel.type)
        activeObj = mySel;
        lastPieceClicked = mySel;
        return;
      } else {
        let lpc = lastPieceClicked;
        if (lpc != null) {
          lpc.clicked = false;
          lpc.center(lpc.x, lpc.y);
        }
        activeObj = null;
      }
    }

    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
      playsound("cancel.mp3");
    }
  }, true);

  canvas.addEventListener('mousemove', function (e) {
    if (myState.dragging) {
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);

  canvas.addEventListener('mouseup', function (e) {
    // Center the Active Piece
    if (activeObj != null) {
      var mouse = myState.getMouse(e);
      var mx = mouse.x;
      var my = mouse.y;
      if (activeObj.type == "piece" || activeObj.type == 'crown') {
        if (activeObj.cellX == cellX && activeObj.cellY == cellY) {
          console.log("selected");
          // findCenter(,)
          cellClicked[0] = cellX;
          cellClicked[1] = cellY;
          activeObj.center(activeObj.x, activeObj.y)
        } else if (activeObj.cellY != cellX && activeObj.cellY != cellY) {
          console.log("Dragged to: [", cellX, ",", cellY, "] from [", activeObj.cellX, ",", activeObj.cellY, "]");
          // console.log("centering: (", mx, ",", canvas.height - my, ")")
          cellClicked[0] = cellX;
          cellClicked[1] = cellY;
          board[cellX + cellY * 11] = rankOfPeice;
          gameBoard.board = board;
          if (playerNum == "p1"){
            game.piecesP1 = game; 
          }
          activeObj.center(mx, my);
          activeObj.clicked = false;
          playsound("deselect.wav");
          myState.valid = false;
          activeObj = null;
        } else {
          cellClicked[0] = cellX;
          cellClicked[1] = cellY;
          activeObj.center(activeObj.x, activeObj.y)
        }
      }
    }
    gameBoard.valid = false; // Draw the canvas again
    myState.dragging = false;
  }, true);

  // // double click for making new shapes
  // canvas.addEventListener('dblclick', function (e) {
  //   if (ofstV - pad <= mouseY && mouseY <= canvas.height - ofstV - pad) {
  //     if (ofstH + pad <= mouseX && mouseX <= canvas.width - ofstH + pad) {
  //       var mouse = myState.getMouse(e);
  //       myState.addShape(new Circle(mouse.x, mouse.y, 20, 'rgba(0,255,0,.6)'));
  //       playsound("spawn.mp3");
  //     }
  //   }
  // }, true);

  // **** Options! ****

  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;
  this.interval = 30;
  setInterval(function () {
    myState.draw();
  }, myState.interval);
}

gameCanvasState.prototype.addShape = function (shape) {
  this.shapes.push(shape);
  if (shape.type == "peice" || shape.type == "crown")
    shape.center(shape.x, shape.y);
  this.valid = false;
}

gameCanvasState.prototype.clear = function () {
  this.ctx.clearRect(0, ofstV, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
gameCanvasState.prototype.draw = function () {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();

    // ** Add stuff you want drawn in the background all the time here **
    drawWhiteSpace();
    drawCheckeredBackground();

    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
        shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }

    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      if (mySel.type == "rect") {
        ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
      } else if (mySel.type == "crown") {
        ctx.arc(mySel.x, mySel.y, mySel.r, 0, 2 * Math.PI);
      }
    }

    // ** Add stuff you want drawn on top all the time here **
    updateHUD();

    this.valid = true;
  }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
gameCanvasState.prototype.getMouse = function (e) {
  var element = this.canvas,
    offsetX = 0,
    offsetY = 0,
    mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft; gameBoard.draw();
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {
    x: mx,
    y: my
  };
}

function init() {
  gameBoard = new gameCanvasState(document.getElementById('canvas'));
  // for (var i = 1; i <= 11; i++) {
  //   gameBoard.addShape(new Piece(50 + i * 50, 650 - 550 + 50, 20, 'rgb(245, 222, 90)', "blue"));
  //   gameBoard.addShape(new Piece(50 + i * 50, 650 - 600 + 50, 20, 'rgb(245, 222, 179)', "blue", 2));
  //   gameBoard.addShape(new Piece(50 + i * 50, 650 - 150 + 50, 20, 'rgb(100, 222, 179)', "red"));
  //   gameBoard.addShape(new Piece(50 + i * 50, 650 - 100 + 50, 20, 'rgb(245, 60, 179)', "red", 2));
  // }
  gameBoard.addShape(new Crown(650 / 2, 650 / 2, 16, 'rgb(245, 222, 90)'));
}

init();

let startBtn = document.getElementById('startBtn');
let rankOfPeice = 1;

let pieceRank = document.getElementById('pieceRank');
let incRankBtn = document.getElementById('incRankBtn');
let decRankBtn = document.getElementById('decRankBtn');
let addPieceBtn = document.getElementById('addPieceBtn');
let removePieceBtn = document.getElementById('removePieceBtn');
let clearBtn = document.getElementById('clearBtn');
let readyBtn = document.getElementById('readyBtn');
let points = document.getElementById('points');
let rp = document.getElementById('rp');

incRankBtn.addEventListener('click', () => {
  if (rankOfPeice < 5) {
    rankOfPeice++;
    pieceRank.innerText = rankOfPeice;
  }
});

decRankBtn.addEventListener('click', () => {
  if (rankOfPeice > 1) {
    rankOfPeice--;
    pieceRank.innerText = rankOfPeice;
  }
})

let boardPoints = 100;

addPieceBtn.addEventListener('click', (e) => {
  let x = cellClicked[0] * 50 + 25;
  let y = cellClicked[1] * 50 + 25;
  let p = new Piece(x, 650 - y, 16, 'rgb(245, 222, 90)', "red", rankOfPeice)
  p.cellX = cellClicked[0];
  p.cellY = cellClicked[1];
  boardPoints -= rankOfPeice * cellClicked[1];
  gameBoard.addShape(p);
});

removePieceBtn.addEventListener('click', (e) => {
  let found = 0;
  for (let i = 0; i < gameBoard.shapes.length; i++) {
    if (gameBoard.shapes[i].id == lastPieceClicked.id) {
      found = 1;
      gameBoard.shapes.splice(i, 1);
    }
  }
  gameBoard.valid = false;
});

clearBtn.addEventListener('click', (e) => {
  boardPoints = 100;
  gameBoard.shapes = [];
  gameBoard.addShape(new Crown(650 / 2, 650 / 2, 16, 'rgb(245, 222, 90)'));
  gameBoard.valid = false;
});

readyBtn.addEventListener('click', (e) => {
  let text = "Are you done setting up your pieces?"
  if (confirm(text) == true) {
    text = "You pressed OK!";
    if (game.p1 = username)
      socket.emit('setUpP1', username, gameBoard.shapes, game);
    if (game.p2 = username)
      socket.emit('setUpP2', username, gameBoard.shapes, game);
  } else {
    text = "You canceled!";
  }
  gameBoard.draw();
});

startBtn.addEventListener('click', function (e) {
  const searchMsg = document.getElementById('searchMsg');
  const errorMsg = document.getElementById('startErrorMsg');
  if (uInput.value == "") {
    errorMsg.hidden = false;
  } else {
    errorMsg.hidden = true;
    searchMsg.hidden = false;
    username = uInput.value;
    socket.emit('joinGame', username, boardSize);
    startBtn.style.background = "#FF3366"
  }
  if (game !== null) {
    drawBoard();
  }
});

setInterval(function () { timeControl(); }, 1000);

function timeControl() {
  if (gameover == false && gamestart == true) {
    if (game.turn == "p1") {
      game.p1time++;
    } else if (game.turn == "p2") {
      game.p2time++;
    }
    var p1time = document.getElementById("p1time");
    let t1 = Math.floor(game.p1time / 60) + ":" + (game.p1time % 60);
    if ((game.p1time % 60) < 10)
      t1 = Math.floor(game.p1time / 60) + ":0" + (game.p1time % 60);
    p1time.innerText = t1;
    // console.log("p1 time: " + t1)
    var p2time = document.getElementById("p2time");
    let t2 = Math.floor(game.p2time / 60) + ":" + (game.p2time % 60);
    if ((game.p2time % 60) < 10)
      t1 = Math.floor(game.p2time / 60) + ":0" + (game.p2time % 60);
    p2time.innerText = t2;
    // console.log("p2 time: " + t2)
  }
}

const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('submit', (data) => {
  console.log('Submit button pressed:', data);

  // Do something with the data received from the server
});

socket.on("serverConnected", function (numberGames) {
  console.log("Server connected. ");
  console.log("Socket.IO ID:", socket.id)
  var gameId = document.getElementById('gameID');
  gameId.innerText = numberGames;
})

socket.on('p1-joined', function (serverGame) {
  var p1text = document.getElementById('p1Txt');
  console.log("p1-joined event: ", serverGame);
  if (game.p1 == username) {
    playerNum = "p1";
    game = serverGame;
    p1text.innerText = username;
  }
  playerTurn = true;
});

socket.on('p2-joined', function (serverGame, self) {
  console.log("p2-joined event: ", game);
  var p2text = document.getElementById('p2Txt');
  var p1text = document.getElementById('p1Txt');
  var gameId = document.getElementById('gameID');
  var searchMsg = document.getElementById('searchMsg');
  var foundMsg = document.getElementById('foundMsg');
  gameId.innerText = game.id;
  if (game.p2 == username) {
    game = serverGame;
    playerNum = 'p2';
    p2text.innerText = username;
    p1text.innerText = game.p1;
  } else if (game.p1 == username) {
    game = serverGame;
    p2text.innerText = game.p2;
    p1text.innerText = game.p1;
    playerNum = "p1";
  }
  searchMsg.hidden = true;
  foundMsg.hidden = false;
  setTimeout(() => {
    foundMsg.hidden = true;
    gameMsg.hidden = false;
  }, 3000)
  drawBoard();
  playsound("GameStart.mp3");
  gamestart = true;
  // timeControl();
});


socket.on("setUpOpp", (username, pieces) => {
  if (playerNum == 'p1')
    game.piecesP2 = pieces;
  if (playerNum == 'p2')
    game.piecesP1 = pieces;
})











