const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. The Gods’ Favorite
// You can reroll each Tao die involved in a support action or an exorcism (you may keep some of the Tao dice and
// reroll the rest). You may also reroll the Curse die. You must always keep the second result.
// 2. Strength of a Mountain
// You have a fourth (gray) Tao die when performing exorcisms, and you never roll the Curse die.
class GreenBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.GREEN;
  }

  getPowersNames() {
    return ['The Gods’ Favorite', 'Strength of a Mountain'];
  }
}

module.exports = GreenBoard;
