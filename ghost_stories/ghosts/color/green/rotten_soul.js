const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const dice = require('../../../actions/curse_dice');

class RottenSoul extends Ghost {
  constructor() {
    super('Rotten Soul', FiveColors.GREEN, 2);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) {
    // Throw curse die
    dice.throwCurseDice(socket, board, ghostPosition, players, bank);
  }
}

module.exports = RottenSoul;
