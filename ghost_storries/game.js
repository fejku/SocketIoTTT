let Board = require('./board');
let Players = require('./players');

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
    }

    start() {
        this.init();
        //draw ghost card
        let card = this.board.drawCard();
        //lay ghost on player board
        if(this.board.isAllBoardsFull()) {
            this.players.taoists[this.actualPlayer].loseQi();
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