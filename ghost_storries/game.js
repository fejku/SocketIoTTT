let Board = require('./board');
let Players = require('./players');
let Bank = require('./bank')

class Game {
    constructor() {
        this.board;
        this.players;
        this.actualPlayer = 0;
    }

    init() {
        this.board = new Board();
        this.board.initBoard();
        this.players = new Players();
        this.players.initPlayers();
        this.bank = new Bank();
        this.bank.initBank();
    }

    start(io, socket) {
        this.init(socket);
socket.emit('ghost init board', this.board.playersBoards);
        //draw ghost card
        let card = this.board.drawCard();
        //lay ghost on player board
        if(this.board.isAllBoardsFull()) {
            this.players.taoists[this.actualPlayer].loseQi();
            this.bank.updateMarkers(this.players.taoists);
        } else if(this.board.playersBoards[this.actualPlayer].isBoardFull()) {
            //pick place on any board
            let emptyPlaces = [];
            for(let playerBoard of this.board.playersBoards) {
                if(!playerBoard.isBoardFull()) {
                    emptyPlaces.push(playerBoard.getEmptyPlaces());
                }                
            }
        } else {
            //pick place on player board
            let emptyPlaces = this.board.playersBoards[this.actualPlayer].getEmptyPlaces();           
socket.emit('ghost pick field', emptyPlaces);
        }
        let actualPlayerColor = this.players.taoists[this.actualPlayer].color.key;
        for(let pb of this.board.playersBoards) {
            if (pb.color.key == actualPlayerColor) {
                pb.cards[0] = card;
            }
        }
    }
}
module.exports = new Game();