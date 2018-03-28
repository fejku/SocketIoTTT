const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const dice = require('../../../actions/curse_dice');

class Zombie extends Ghost {
  constructor() {
    super('Zombie', FiveColors.YELLOW, 2);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) {
    // Throw curse die
    dice.throwCurseDice(socket, board, ghostPosition, players, bank);
  }
}

module.exports = Zombie;
