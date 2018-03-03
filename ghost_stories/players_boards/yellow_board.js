const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

class YellowBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.YELLOW;
  }
}

module.exports = YellowBoard;
