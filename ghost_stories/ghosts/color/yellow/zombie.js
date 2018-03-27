const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const dice = require('../../../actions/curse_dice');

class Zombie extends Ghost {
  constructor() {
    super('Zombie', FiveColors.YELLOW, 2);
  }

  afterWinningEffect(socket, board, players, bank, ghostPosition, circleOfPrayer) { /* eslint-disable-line no-unused-vars */
    // Throw curse die
    dice.throwCurseDice(socket, board, ghostPosition, players, bank);
  }
}

module.exports = Zombie;
