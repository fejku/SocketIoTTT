let Colors = require('../enums/color').FourColors;
let PlayerBoard = require('./player_board');

class RedBoard extends PlayerBoard {
    constructor() {
        super();
        this.color = Colors.RED;
    }
}

module.exports = RedBoard;