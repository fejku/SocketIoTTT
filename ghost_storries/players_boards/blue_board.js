const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

class BlueBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.BLUE;
  }
}

module.exports = BlueBoard;
