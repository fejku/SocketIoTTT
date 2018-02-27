let Board = require('./board');
let Players = require('./players/players');
let Bank = require('./bank')

let FiveColors = require('./enums/color').FiveColors;
let Decision = require('./enums/decision');

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
        socket.emit('ghost init board', this.board.playersBoards, this.board.villagers);

        //Ghost phase
        //Step 1 - Ghosts’ actions
        //Step 2 - Check board overrun
        if (this.board.getPlayerBoardByColor(this.players.getActualPlayerColor()).isBoardFull()) {
            this.players.getActualPlayer().loseQi();
            this.bank.updateMarkers(this.players.taoists);
        } else {
            //Step 3 - Ghost arrival
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
        //Step 1 - Player move
        let availableMoves = this.players.getAvailableMoves(this.players.getActualPlayer().getPosition());
        let pickedMove = await this.players.pickMove(socket, availableMoves);
        console.log('availableMoves', availableMoves);
        console.log('pickedMove', pickedMove);
        this.players.getActualPlayer().move(pickedMove);
        //Step 2 - Help from villager or exorcism
        let availableDecisions = [];
        //Check if villager help is possible
        //if (this.board.villagers[this.players.getActualPlayer().getPosition()].validateHelp(this.board, this.players, this.bank))
            availableDecisions.push(Decision.VILLAGER_HELP.key)
        //Check if exorcism is possible
        if (this.players.getActualPlayer().validateExorcism(this.board.playersBoards))
            availableDecisions.push(Decision.EXORCISM.key)

        if (availableDecisions.length > 0) {
            let decision = await this.players.makeDecision(socket, availableDecisions);
            console.log('decision', decision);
            switch (decision) {
                //Help from villager
                case Decision.VILLAGER_HELP.key:
//test
this.players.taoists[1].qiMarkers = 0;
this.players.taoists[2].qiMarkers = 0;
                    this.board.villagers[this.players.getActualPlayer().getPosition()].action(
                        socket, this.board, this.players, this.bank);
                    break;
                    //Attempt an exorcism    
                case Decision.EXORCISM.key:
                    break;
            }
        }
    }
    //Step 3
}
module.exports = new Game();