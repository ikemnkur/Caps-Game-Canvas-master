const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const path = require('path');
const io = socketio(server);

const port = process.env.PORT || 3000;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //   res.send('Server is running!');
  // res.sendFile(__dirname + '/index.html');
  res.render('index')
});

var game = {
  id: "",
  player1: "",
  player2: "",
  pieces: "",
  time: 300,
  language: "English",
  Elo: 500,
  range: 100,
}

var games = []

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('game-data', (data) => {
    console.log('Received game data:', data);

    // Do something with the game data here

    // Send the game data to all connected clients
    io.emit('game-data', data);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});