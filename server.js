// const express = require('express');
// const http = require('http');
// const socketio = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const path = require('path');
// const io = socketio(server);

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Set static folder
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

let numOfgames = 1;

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
// app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //   res.send('Server is running!');
  res.sendFile(__dirname + '/public/index.html');
  // res.render('index')
});

app.get('/menu', (req, res) => {
  //   res.send('Server is running!');
  res.sendFile(__dirname + '/public/menu.html');
  // res.render('index')
});



class Game {
  constructor() {
    //server controlled variables
    this.id = numOfgames;
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
    // var now = new Date();
    this.endTime = new Date();
    this.endTime.setTime(this.startTime.getTime() + (30 * 60 * 1000));
    this.mvStartTime = new Date();
    this.mvEndTime = new Date();
    this.gameStart = false;
    this.gameEnd = false;
  }
}

var games = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit("serverConnected", numOfgames);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('joinGame', function (playerUsername, boardSize, pieces) {
    let game;
    if (games[numOfgames] == null) {
      game = new Game();
      game.id = numOfgames;
      game.p1 = playerUsername;
      games[numOfgames] = game;

      //add the P1 pieces to the game
      game.piecesP1 = pieces;

      //store the socketId for this user
      game.p1Socket = socket.id;
      socket.emit('p1-joined', game);
      console.log("Game (p1): ", game);

    } else {
      game = games[numOfgames];
      game.p2 = playerUsername;
      //add the P2 pieces to the game
      game.piecesP2 = pieces;

      // increment the number of games since now this game is full. it has 2 players now.
      numOfgames++;

      //store the socketId for this user
      game.p2Socket = socket.id;
      socket.emit('p2-joined', game, game.piecesP1, game.piecesP2);
      console.log("Game (p2): ", game);
      io.to(game.p1Socket).emit('p2-joined', game, true);
    }
  });

  // socket.on("setUpP1", function (username, pieces, team) {
  //   socket.emit("setUpOpp", username, pieces)
  // });

  // socket.on("setUpP2", function (username, pieces, team) {
  //   socket.emit("setUpOpp", username, pieces)
  // });

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
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
  this.p = "p1";
  this.color = color;
  this.cellX = 0;
  this.cellY = 0;
  this.xprev = 0;
  this.yprev = 0;
  this.draw = function (ctx) {
    ctx = document.getElementById("canvas").getContext("2d");
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

   this.center = function (mx, my) {
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

  this.contains = function (mx, my) {
    return Math.sqrt((mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y)) < this.r;
  }
}

// Draws this shape to a given context
Piece.prototype.draw = function (ctx) {
  ctx.strokeStyle = this.fill;
  ctx.beginPath();
  if (this.team == "p1")
    ctx.fillStyle = "#3333FF";
  if (this.team == "p2")
    ctx.fillStyle = "#FF3333";
  // if (this.color == "green")
  //   ctx.fillStyle = "#33FF33";
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