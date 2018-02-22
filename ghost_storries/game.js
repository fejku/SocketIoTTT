let Board = require('./board');
let Players = require('./players/players');
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

    async start(io, socket) {
        this.init(socket);
        socket.emit('ghost init board', this.board.playersBoards);

        //Ghost phase
        //All fields on all boards are full
        if (this.board.isAllBoardsFull()) {
            this.players.getActualPlayer().loseQi();
            this.bank.updateMarkers(this.players.taoists);
        } else {
            //Draw ghost card
            let card = this.board.drawCard();
            let emptyFields = [];
            //Black card on active player board
            if (card.color.key === FiveColors.BLACK) {
                //Get empty fields from actual player
                emptyFields = this.board.getEmptyFields(this.board.playersBoards, 
                    this.board.getPlayerBoardByColor(this.players.getActualPlayerColor()));
            //Other than black color
            } else {
                //Get empty fields from player whose color is same as card color
                emptyFields = this.board.getEmptyFields(this.board.playersBoards, 
                    this.board.getPlayerBoardByColor(card.color.key));
            }
            //Pick field for card
            let pickedField = await this.board.pickFieldForCard(socket, emptyFields);
            //Lay card of picked field
            this.board.getPlayerBoardByColor(pickedField.color).fields[pickedField.field] = card;
            console.log(this.board.getPlayerBoardByColor(pickedField.color));
            card.immediateEffect();
        }
        
        //Player phase
        //Player move
        let availableMoves = this.players.getAvailableMoves(this.players.getActualPlayer().getPosition());
        let pickedMove = await this.players.pickMove(socket, availableMoves);
        this.players.getActualPlayer().move(pickedMove);
        //Step 2
        //let villagerHelpDecision = await this.players.
        //Help from villager

        //Attempt an exorcism
        //Step 3

        console.log(availableMoves);
        console.log(pickedMove);
    }
}
module.exports = new Game();