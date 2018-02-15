var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var SocketManager = require('./SocketManager').SocketManager;
var socketManager = new SocketManager();

//KiK
var Players = require('./Players').Players;
var players;
var Board = require('./Board').Board;
var board = new Board();

//Ghost stories
let game = require('./ghost_storries/game');
game.start();
console.log(game.board);
console.log(game.players);


//test
// let Color = require('./ghost_storries/enums/color-enum');
// let Thaoist = require('./ghost_storries/Thaoist');
// let ghostBoard = require('./ghost_storries/board');

// let thaoist = new Thaoist(Color);

// ghostBoard.initBoard();

// console.log(ghostBoard.villagers);
// console.log(ghostBoard.playersBoards);
//console.log(GhostBoard);
//console.log(test);
//let test = new Thaoist(Color.ZOLTY);
// let test = require('./ghost_storries/enums/color-enum');
// test.enums.forEach(function(enumItem) {
//     console.log(enumItem.key);
//   });
// console.log(test.ZOLTY.key);
// console.log(test.get('ZOLTY'));
//test

app.use(express.static('public'))

function checkWinCondition(fields) {
    for (let i = 0; i < 3; i++) {
        if (((fields[3 * i].actual) !== -1) && (fields[3 * i].actual === fields[3 * i + 1].actual) && (fields[3 * i + 1].actual === fields[3 * i + 2].actual))
            return true;
        if (((fields[i].actual) !== -1) && (fields[i].actual === fields[3 + i].actual) && (fields[3 + i].actual === fields[6 + i].actual))
            return true;
    }
    if (((fields[0].actual) !== -1) && (fields[0].actual === fields[4].actual) && (fields[4].actual === fields[8].actual))
        return true;
    if (((fields[2].actual) !== -1) && (fields[2].actual === fields[4].actual) && (fields[4].actual === fields[6].actual))
        return true;
    return false;
};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/waiting_room', (req, res) => {
    res.sendFile(__dirname + '/waiting_room.html');
});

app.get('/kik', function(req, res) {
    res.sendFile(__dirname + '/kik.html');
});

app.get('/ghost_storries', function(req, res) {
    game.start();
    res.sendFile(__dirname + '/ghost_storries.html');
});

io.on('connection', function (socket) {

    //save user id in localStorage, prevent changing id after refresh
    socket.on('userId', function(userId) {
        if (userId === null) {
            let userId = socketManager.addUser(socket.id);
            socket.join('waitingRoom');
            io.in(socket.id).emit('userId', userId);
        } else {
            socketManager.updateUser(userId, socket.id);
        }
    });

    socket.on('userName', function (user) {
        socketManager.setUserName(user.id, user.name);
    });

    socket.on('kik start', function () {
        let room = socketManager.addUserToRoom(socketManager.getUserBySocketId(socket.id));
        socket.join(room.id);

        io.in(room.id).clients((err, clients) => {
            console.log(room.id + ' ' + clients);
        });

        if (socketManager.isRoomFull(room)) {
            if (Math.floor(Math.random() * 2) == 0) {
                let player = room.usersId[0];
                room.usersId[0] = room.usersId[1];
                room.usersId[1] = player;
            }
            players = new Players(room.usersId);

            io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
                status: 'turn',
                board: board
            });

            io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
                status: 'wait',
                board: board
            });
        } else {
            io.in(room.id).emit('waiting for player');
        }
    });

    socket.on('turn', function (move) {
        if ((move >= 0) && (move < 9)) {
            if (board.fields[move].actual === -1) {
                board.fields[move].actual = players.activePlayer;
                console.log(board);

                if (checkWinCondition(board.fields)) {
                    io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
                        status: 'winner',
                        board: board
                    });
                    io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
                        status: 'loser',
                        board: board
                    });
                } else {
                    players.changePlayer();

                    io.in(socketManager.getSocketByUserId(players.getActivePlayer())).emit('message', {
                        status: 'turn',
                        board: board
                    });
                    io.in(socketManager.getSocketByUserId(players.getUnactivePlayer())).emit('message', {
                        status: 'wait',
                        board: board
                    });
                }
            } else {
                console.log('You can\'t make the same move again');
            }
        }
    });
});

http.listen(3000, function () {
    console.log('listening...');
})