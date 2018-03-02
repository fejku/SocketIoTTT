const arrayShuffle = require('array-shuffle');
const Colors = require('./enums/color').FiveColors;

const Villagers = require('./villagers/villagers');

class Board {
    constructor() {
        //0 - top left, 1 - top middle, ...
        this.villagers;
        //0 - top, 1 - right, 2 - bottom, 3 - left
        this.playersBoards;
        this.ghostCards;
        this.name;
    }

    _initPlayersBoards(players) {
        const GreenBoard = require('./players_boards/green_board');
        const YellowBoard = require('./players_boards/yellow_board');
        const RedBoard = require('./players_boards/red_board');
        const BlueBoard = require('./players_boards/blue_board');

        const boards = [new GreenBoard(),
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
        for (const board of boards)
            if (board.getColor() === color)
                return board;
    }

    _initGhostCards() {
        const Ghoul = require('./ghosts/ghoul');
        const WalkingCorpse = require('./ghosts/walking_corpse');

        return arrayShuffle([new Ghoul(),
            new WalkingCorpse()
        ]);
    }

    initBoard(players) {
        this.villagers = new Villagers();
        this.villagers.initVillagers();
        this.playersBoards = this._initPlayersBoards(players);
        this.ghostCards = this._initGhostCards();
    }

    getVillagers() {
        return this.villagers;
    }

    getAllVillagers() {
        return this.villagers.getVillagers();
    }

    getVillager(index) {
        return this.villagers.getVillager(index);
    }

    getVillagerByClass(villagerClass) {
        return this.villagers.getVillagerByClass(villagerClass);
    }

    drawCard() {
        return this.ghostCards.pop();
    }

    isAllBoardsFull() {
        for (const board of this.playersBoards) {
            if (!board.isBoardFull())
                return false;
        }
        return true;
    }

    getPlayerBoardByColor(color) {
        for (const playerBoard of this.playersBoards) {
            if (playerBoard.color.key === color)
                return playerBoard;
        }
    }

    getPlayerBoardById(id) {
        return this.playersBoards[id];
    }

    getEmptyFields(boards, playerBoard) {
        const emptyFields = [];
        if (playerBoard.isBoardFull()) {
            for (const board of boards)
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
        for (const emptyField of emptyFields)
            if ((emptyField.color === pickedField.color) && (emptyField.fields.indexOf(pickedField.field) !== -1))
                return true;
        return false;
    }

    async ghostArrival(socket, players, bank, circleOfPrayer) {
        if (this.isAllBoardsFull()) {
            players.getActualPlayer().loseQi();
            bank.updateMarkers(players.getTaoists(), circleOfPrayer);
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