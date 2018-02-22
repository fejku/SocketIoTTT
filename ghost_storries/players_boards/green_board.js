let Colors = require('../enums/color').FourColors;
let PlayerBoard = require('./player_board');

class GreenBoard extends PlayerBoard {
    constructor() {
        super();
        this.color = Colors.GREEN;
    }
}

module.exports = GreenBoard;