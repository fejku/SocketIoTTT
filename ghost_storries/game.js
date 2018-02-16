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

    start(io) {
        this.init();
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
            //io.sockets.emit('test', emptyPlaces);
            io.of('/').emit('test', emptyPlaces);
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