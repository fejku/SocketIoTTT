const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

class RedBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.RED;
  }
}

module.exports = RedBoard;
