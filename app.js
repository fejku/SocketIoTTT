var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var Players = require('./Players').Players;
var Board = require('./Board').Board;
var WaitingRoom = require('./WaitingRoom').WaitingRoom;

var players;
var board = new Board();
var waitingRoom = new WaitingRoom();

let ServerSideIds = [];
let id = 0;

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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {

    //save user id in localStorage, prevent changing id after refresh
    socket.on('userId', function(userId) {
        if (userId === null) {
            ServerSideIds[id] = {socketId: socket.id, room: 'waitingRoom'};
            io.sockets.sockets[socket.id].emit('socketId', id++);
            //join waitingRoom
            socket.join('waitingRoom');          
        } else {
            ServerSideIds[userId].socketId = socket.id;
            socket.join(ServerSideIds[userId].room)
        }             
    });

    socket.on('name', function (user) {
        ServerSideIds[user.id].name = user.name;
        io.sockets.sockets[ServerSideIds[user.id].id].emit('name')
        // let room = waitingRoom.addUserToRoom(socket.id);
        // socket.join(room.id);

        // io.in(room.id).clients((err, clients) => {
        //     console.log(room.id + ' ' + clients);
        //   });        
                
        //czy podłączono dwóch graczy, TODO zrobić im pokój
        // if (Object.keys(io.sockets.sockets).length === 2) {
        //     players = new Players(Object.keys(io.sockets.sockets));
        //     io.sockets.sockets[players.getActivePlayer()].emit('message', {
        //         status: 'turn',
        //         board: board
        //     });
        //     io.sockets.sockets[players.getUnactivePlayer()].emit('message', {
        //         status: 'wait',
        //         board: board
        //     });
        // }
    });

    socket.on('turn', function (move) {
        if ((move >= 0) && (move < 9)) {
            if (board.fields[move].actual === -1) {
                board.fields[move].actual = players.activePlayer;
                console.log(board);

                if (checkWinCondition(board.fields)) {
                    io.sockets.sockets[players.getActivePlayer()].emit('message', {
                        status: 'winner',
                        board: board
                    });
                    io.sockets.sockets[players.getUnactivePlayer()].emit('message', {
                        status: 'loser',
                        board: board
                    });
                } else {
                    players.changePlayer();

                    io.sockets.sockets[players.getActivePlayer()].emit('message', {
                        status: 'turn',
                        board: board
                    });
                    io.sockets.sockets[players.getUnactivePlayer()].emit('message', {
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