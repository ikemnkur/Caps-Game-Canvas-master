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
    this.id = 0;
    this.p1 = "true";
    this.p2 = "p2";
    this.turn = "p1";
    this.moveNum = 0;
    this.boardSize = 11;
    this.pieces = [];
    this.moves = [];
    // game creation variables
    this.time = 300;
    this.language = "English";
    this.Elo = 500;
    this.range = 100;
    //timing variables
    this.startTime = new Date();
    var now = new Date();
    this.endTime = new Date();
    this.endTime.setTime(this.startTime.getTime() + (5 * 60 * 1000));
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

  socket.on('joinGame', function (playerUsername, boardSize) {
    let game;
    if (games[numOfgames] == null) {
      game = new Game();
      game.id = numOfgames;
      game.p1 = playerUsername;
      games[numOfgames] = game;

      //store the socketId for this user
      game.p1Socket = socket.id;
      socket.emit('p1-joined', game)
      console.log("Game (p1): ", game)

    } else {
      game = games[numOfgames];
      game.p2 = playerUsername;
      // increment the number of games since now this game is full. it has 2 players now.
      numOfgames++;

      //store the socketId for this user
      game.p2Socket = socket.id;
      socket.emit('p2-joined', game, false);
      console.log("Game (p2): ", game)
      io.to(game.p1Socket).emit('p2-joined', game, true);
    }
  });

  socket.emit("setUp", function(username, pieces, team) { 

  });

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});