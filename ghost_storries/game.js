let Board = require('./board');
let Players = require('./players');
let Bank = require('./bank')

let FiveColors = require('./enums/color-enum').FiveColors;

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
        console.log(card)
        //lay ghost on player board
        //all fields on all boards are full
        if (this.board.isAllBoardsFull()) {
            this.players.taoists[this.actualPlayer].loseQi();
            this.bank.updateMarkers(this.players.taoists);
        } else {
            //Black card on active player board
            // if (card.color.key === FiveColors.BLACK) {
            //Active player board full
            if (this.board.playersBoards[this.actualPlayer].isBoardFull()) {
                let emptyFields = [];
                for (let playerBoard of this.board.playersBoards)
                    if (!playerBoard.isBoardFull())
                        emptyFields.push(playerBoard.getEmptyFields());
                this.pickFieldForCard(socket, emptyFields, this.board, card)
                //There is place on active player board
            } else {
                let emptyFields = [this.board.playersBoards[this.actualPlayer].getEmptyFields()];
                this.pickFieldForCard(socket, emptyFields, this.board, card);
            }
            // } else {

            // }
            if (this.board.getPlayerBoardByColor(card.color.key).isBoardFull())
                console.log(card.color.key);
        }
    }

    pickFieldForCard(socket, emptyFields, board, card) {
        socket.emit('ghost pick field', emptyFields, (pickedField) => {
            if (this.walidatePickedField(emptyFields, pickedField)) {
                board.getPlayerBoardByColor(pickedField.color).cards[pickedField.field] = card;
                card.leftStoneAction();
            }
            console.log(board.getPlayerBoardByColor(pickedField.color));
        });
    }

    walidatePickedField(emptyFields, pickedField) {     
        for (let emptyField of emptyFields)
            if ((emptyField.color === pickedField.color) && (emptyField.fields.indexOf(pickedField.field) !== -1))
                return true;
        return false;
    }
}
module.exports = new Game();