let Colors = require('../enums/color-enum').FourColors;
let PlayerBoard = require('./player_board');

class BlueBoard extends PlayerBoard {
    constructor() {
        super();
        this.color = Colors.BLUE;
    }
}

module.exports = BlueBoard;