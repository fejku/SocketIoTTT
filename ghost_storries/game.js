let Board = require('./board');
let Players = require('./players');
let Bank = require('./bank')

let FiveColors = require('./enums/color').FiveColors;

class Game {
    constructor() {
        this.board;
        this.players;
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
        console.log('Card color: ', card.color.key);
        //lay ghost on player board
        //all fields on all boards are full
        if (this.board.isAllBoardsFull()) {
            this.players.getActualPlayer().loseQi();
            this.bank.updateMarkers(this.players.taoists);
        } else {
            let emptyFields = [];
            //Black card on active player board
            if (card.color.key === FiveColors.BLACK) {
                emptyFields = this.board.getEmptyFields(this.board.playersBoards, 
                    this.board.getPlayerBoardByColor(this.players.getActualPlayerColor()));
            } else {
                emptyFields = this.board.getEmptyFields(this.board.playersBoards, 
                    this.board.getPlayerBoardByColor(card.color.key));
            }
            this.board.pickFieldForCard(socket, emptyFields, this.board, card);
        }
    }
}
module.exports = new Game();