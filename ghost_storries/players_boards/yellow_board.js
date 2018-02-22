let Colors = require('../enums/color').FourColors;
let PlayerBoard = require('./player_board');

class YellowBoard extends PlayerBoard {
    constructor() {
        super();
        this.color = Colors.YELLOW;
    }
}

module.exports = YellowBoard;