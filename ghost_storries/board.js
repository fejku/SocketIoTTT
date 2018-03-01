let arrayShuffle = require('array-shuffle');
let Colors = require('./enums/color').FiveColors;

class Board {
    constructor() {
        //0 - top left, 1 - top middle, ...
        this.villagers;
        //0 - top, 1 - right, 2 - bottom, 3 - left
        this.playersBoards;
        this.ghostCards;
        this.name;
    }

    _initVillagers() {
        let Cemetery = require('./villagers/cemetery');
        let TaoistAltar = require('./villagers/taoist_altar');
        let HerbalistShop = require('./villagers/herbalist_shop');
        let SorcererHut = require('./villagers/sorcerer_hut');
        let CircleOfPryer = require('./villagers/circle_of_prayer');

        return arrayShuffle([new Cemetery(),
            new TaoistAltar(),
            new HerbalistShop(),
            new SorcererHut(),
            new CircleOfPryer()
        ]);
    }

    _initPlayersBoards(players) {
        let GreenBoard = require('./players_boards/green_board');
        let YellowBoard = require('./players_boards/yellow_board');
        let RedBoard = require('./players_boards/red_board');
        let BlueBoard = require('./players_boards/blue_board');

        let boards = [new GreenBoard(),
            new YellowBoard(),
            new RedBoard(),
            new BlueBoard()
        ];

        return this._setBoardsInPlayersOrder(players, boards);
    }

    _setBoardsInPlayersOrder(players, boards) {
        let resultBoards = [];
        for (let i = 0; i < players.getTaoists().length; i++) {
            resultBoards[i] = this.getBoardByColor(boards, players.getTaoist(i).getColor());
        }
        return resultBoards;
    }

    getBoardByColor(boards, color) {
        for (let board of boards)
            if (board.getColor() === color)
                return board;
    }

    _initGhostCards() {
        let Ghoul = require('./ghosts/ghoul');
        let WalkingCorpse = require('./ghosts/walking_corpse');

        return arrayShuffle([new Ghoul(),
            new WalkingCorpse()
        ]);
    }

    initBoard(players) {
        this.villagers = this._initVillagers();
        this.playersBoards = this._initPlayersBoards(players);
        this.ghostCards = this._initGhostCards();
    }

    getVillagers() {
        return this.villagers;
    }

    getVillager(index) {
        return this.villagers[index];
    }

    drawCard() {
        return this.ghostCards.pop();
    }

    isAllBoardsFull() {
        for (let board of this.playersBoards) {
            if (!board.isBoardFull())
                return false;
        }
        return true;
    }

    getPlayerBoardByColor(color) {
        for (let playerBoard of this.playersBoards) {
            if (playerBoard.color.key === color)
                return playerBoard;
        }
    }

    getPlayerBoardById(id) {
        return this.playersBoards[id];
    }

    getEmptyFields(boards, playerBoard) {
        let emptyFields = [];
        if (playerBoard.isBoardFull()) {
            for (let board of boards)
                if (!board.isBoardFull())
                    emptyFields.push(board.getEmptyFields());
            return emptyFields;
        } else {
            emptyFields.push(playerBoard.getEmptyFields());
            return emptyFields;
        }
    }

    pickFieldForCard(socket, emptyFields) {
        return new Promise((resolve, reject) => {
            socket.emit('ghost pick field', emptyFields, pickedField => {
                if (this._validatePickedField(emptyFields, pickedField))
                    resolve(pickedField);
                else
                    reject();
            });
        });
    }

    _validatePickedField(emptyFields, pickedField) {
        for (let emptyField of emptyFields)
            if ((emptyField.color === pickedField.color) && (emptyField.fields.indexOf(pickedField.field) !== -1))
                return true;
        return false;
    }

    async ghostArrival(socket, players, bank) {
        if (this.isAllBoardsFull()) {
            players.getActualPlayer().loseQi();
            bank.updateMarkers(players.getTaoists());
        } else {
            //Draw ghost card
            const card = this.drawCard();
            let emptyFields = [];
            //Black card on active player board
            if (card.color.key === Colors.BLACK) {
                //Get empty fields from actual player
                emptyFields = this.getEmptyFields(this.playersBoards,
                    this.getPlayerBoardByColor(players.getActualPlayerColor()));
                //Other than black color
            } else {
                //Get empty fields from player whose color is same as card color
                emptyFields = this.getEmptyFields(this.playersBoards,
                    this.getPlayerBoardByColor(card.color.key));
            }
            //Pick field for card
            const pickedField = await this.pickFieldForCard(socket, emptyFields);
            //Lay card of picked field
            this.getPlayerBoardByColor(pickedField.color).fields[pickedField.field] = card;
            console.log(this.getPlayerBoardByColor(pickedField.color));
            card.immediateEffect();
        }
    }
}

module.exports = Board;