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
        console.log(card);
        //lay ghost on player board
        let actualPlayerColor = this.players.taoists[this.actualPlayer].color.key;
        for(let pb of this.board.playersBoards) {
            if (pb.color.key == actualPlayerColor) {
                console.log(actualPlayerColor);
                pb.cards[0] = card;
                console.log(pb);
            }
        }
    }
}
module.exports = new Game();