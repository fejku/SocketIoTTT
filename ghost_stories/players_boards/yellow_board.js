const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Bottomless Pockets
// Before your move, take a Tao token of whatever color you choose from among those available.
// 2. Enfeeblement Mantra
// Before your move, place the Enfeeblement Mantra token onto any ghost in the game. The ghost’s exorcism
// resistance is reduced by 1, whoever performs the exorcism. Note that when fighting multicolored incarnations, the
// color of the Mantra may be chosen after the dice roll. When the targeted ghost is removed from the game, take
// back the token; you may use it again on your next turn. If you lose your power, remove the Enfeeblement Mantra
// token from the game.
class YellowBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.YELLOW;
  }

  getPowersNames() {
    return ['Bottomless Pockets', 'Enfeeblement Mantra'];
  }
}

module.exports = YellowBoard;
