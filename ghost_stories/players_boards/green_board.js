const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

class GreenBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.GREEN;
  }
}

module.exports = GreenBoard;
