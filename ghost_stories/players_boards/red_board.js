const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Dance of the Spires
// During your move, you can fly to any village tile.
// 2. Dance of the Twin Winds
// Before your move, you can move 1 other Taoist 1 space.
class RedBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.RED;
  }

  getPowersNames() {
    return ['Dance of the Spires', 'Dance of the Twin Winds'];
  }
}

module.exports = RedBoard;
