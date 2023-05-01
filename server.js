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
  res.sendFile(__dirname + '/public/menu.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

class Game {
  constructor() {
    //server controlled variables
    this.id = 0;
    this.p1 = "true";
    this.p2 = "p2";
    this.turn = "p1";
    this.moveNum = 0;
    this.boardSize = 5;
    this.pieces = [];
    this.moves = [];
    // game creation variables
    this.time = 300;
    this.language = "English";
    this.Elo = 500;
    this.range = 100;
    //timing variables
    this.startTime = new Date();
    this.endTime = new Date();
    this.endTime.setDate(this.endTime.getTime() + 1000 * 60 * 5);
    this.mvStartTime = new Date();
    this.mvEndTime = new Date();
    this.gameStart = false;
    this.gameEnd = false;
  }
}

var games = []

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

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const fs = require('fs');

const jsonServer = require('json-server');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const router = jsonServer.router('db.json');
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  console.log("body: " + req.body);

  let data = {
    "id": numOfUsers,
    "username": username,
    "passwordHashed": hash,
    "password": password,
    "email": email,
    "createDate": new Date()
  }

  // userdb.users.push({
  //   username, password: hash, email: email
  // });

  fs.writeFileSync('./users.json', JSON.stringify(data), 'UTF-8');

  // fs.writeFileSync('./users.json', JSON.stringify(userdb), 'UTF-8');

  res.send('Registration successful');
});

// let numOfUsers = 1;

// let data1 = {
//     "id": numOfUsers,
//     "username": "user1",
//     "password": "1234dawg",
//     "createDate": new Date()
// }

// fs.writeFileSync('./users.json', JSON.stringify(data1), 'UTF-8');

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = userdb.users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = bcrypt.hashSync(username, bcrypt.genSaltSync(10));

    res.cookie('token', token);
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout successful');
});

// Protected endpoint
app.get('/protected', (req, res) => {
  const token = req.cookies.token;

  if (token && bcrypt.compareSync(userdb.users.find((u) => u.username === bcrypt.hashSync(token, bcrypt.genSaltSync(10))).username, token)) {
    res.send('Protected data');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.use('/api', router);



