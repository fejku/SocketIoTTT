let arrayShuffle = require('array-shuffle');
let Colors = require('./enums/color-enum').FiveColors;

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

    _initPlayersBoards() {
        let GreenBoard = require('./players_boards/green_board');
        let YellowBoard = require('./players_boards/yellow_board');
        let RedBoard = require('./players_boards/red_board');
        let BlueBoard = require('./players_boards/blue_board');

        return arrayShuffle([new GreenBoard(),
            new YellowBoard(),
            new RedBoard(),
            new BlueBoard()
        ]);
    }

    _initGhostCards() {
        let Ghost = require('./ghost');

        return arrayShuffle([new Ghost('G1', Colors.RED, 2),
            new Ghost('G2', Colors.BLUE, 3)
        ]);
    }

    initBoard() {
        this.villagers = this._initVillagers();
        this.playersBoards = this._initPlayersBoards();
        this.ghostCards = this._initGhostCards();
    }

    drawCard() {
        return this.ghostCards.pop();
    }

    isAllBoardsFull() {
        for(let board of this.playersBoards) {
            if(!board.isBoardFull())
                return false;
        }
        return true;
    }

    getPlayerBoardByColor(color) {
        for(let playerBoard of this.playersBoards){
            if(playerBoard.color.key === color)
                return playerBoard;
        }
    }
}

module.exports = Board;