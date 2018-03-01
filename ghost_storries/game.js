const Board = require('./board');
const Players = require('./players/players');
const Bank = require('./bank')

const FiveColors = require('./enums/color').FiveColors;
const Decision = require('./enums/decision');

class Game {
    constructor() {
        this.board;
        this.players;
    }

    init() {
        this.players = new Players();
        this.players.initPlayers();        
        this.board = new Board();
        this.board.initBoard(this.players);
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
            this.bank.updateMarkers(this.players.getTaoists());
        } else
            //Step 3 - Ghost arrival
            await this.board.ghostArrival(socket, this.players, this.bank);

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
this.players.getTaoists()[1].qiMarkers = 0;
this.players.getTaoists()[2].qiMarkers = 0;
                    this.board.villagers[this.players.getActualPlayer().getPosition()].action(
                        socket, this.board, this.players, this.bank);
                    break;
                    //Attempt an exorcism    
                case Decision.EXORCISM.key:
                    break;
            }
        }
        //Step 3
    }
}
module.exports = new Game();