const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { SocketManager } = require('./SocketManager');

const socketManager = new SocketManager();

// KiK
const { Players } = require('./Players');
const { Board } = require('./Board');

const board = new Board();
let players;

// Ghost stories
const game = require('./ghost_stories/game');

app.use(express.static('public'));

function checkWinCondition(fields) {
  for (let i = 0; i < 3; i++) {
    if (((fields[3 * i].actual) !== -1)
        && (fields[3 * i].actual === fields[(3 * i) + 1].actual)
        && (fields[(3 * i) + 1].actual === fields[(3 * i) + 2].actual)) {
      return true;
    }
    if (((fields[i].actual) !== -1)
        && (fields[i].actual === fields[3 + i].actual)
        && (fields[3 + i].actual === fields[6 + i].actual)) {
      return true;
    }
  }
  if (((fields[0].actual) !== -1)
    && (fields[0].actual === fields[4].actual)
    && (fields[4].actual === fields[8].actual)) {
    return true;
  }
  if (((fields[2].actual) !== -1)
    && (fields[2].actual === fields[4].actual)
    && (fields[4].actual === fields[6].actual)) {
    return true;
  }
  return false;
}

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/waiting_room', (req, res) => {
  res.sendFile(`${__dirname}/waiting_room.html`);
});

app.get('/kik', (req, res) => {
  res.sendFile(`${__dirname}/kik.html`);
});

app.get('/ghost_stories', (req, res) => {
  res.sendFile(`${__dirname}/ghost_stories.html`);
});

io.on('connection', (socket) => {
  socket.on('ghost start', () => {
    game.start(io, socket);
  });

  // save user id in localStorage, prevent changing id after refresh
  socket.on('userId', (userId) => {
    if (userId === null) {
      const addedUserId = socketManager.addUser(socket.id);
      socket.join('waitingRoom');
      io.in(socket.id).emit('userId', addedUserId);
    } else {
      socketManager.updateUser(userId, socket.id);
    }
  });

  socket.on('userName', (user) => {
    socketManager.setUserName(user.id, user.name);
  });

  socket.on('kik start', () => {
    const room = socketManager.addUserToRoom(socketManager.getUserBySocketId(socket.id));
    socket.join(room.id);

    io.in(room.id).clients((err, clients) => {
      console.log(`${room.id} ${clients}`);
    });

    if (socketManager.isRoomFull(room)) {
      if (Math.floor(Math.random() * 2) === 0) {
        const player = room.usersId[0];
        room.usersId[0] = room.usersId[1]; // eslint-disable-line prefer-destructuring
        room.usersId[1] = player;
      }
      players = new Players(room.usersId);

      io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
        status: 'turn',
        board,
      });

      io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
        status: 'wait',
        board,
      });
    } else {
      io.in(room.id).emit('waiting for player');
    }
  });

  socket.on('turn', (move) => {
    if ((move >= 0) && (move < 9)) {
      if (board.fields[move].actual === -1) {
        board.fields[move].actual = players.activePlayer;
        console.log(board);

        if (checkWinCondition(board.fields)) {
          io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
            status: 'winner',
            board,
          });
          io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
            status: 'loser',
            board,
          });
        } else {
          players.changePlayer();

          io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
            status: 'turn',
            board,
          });
          io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
            status: 'wait',
            board,
          });
        }
      } else {
        console.log('You can\'t make the same move again');
      }
    }
  });
});

http.listen(3000, () => {
  console.log('listening...');
});
