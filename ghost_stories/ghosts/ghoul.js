const Ghost = require('./ghost');
const { FiveColors } = require('../enums/color');

class Ghoul extends Ghost {
  constructor() {
    super('Ghoul', FiveColors.YELLOW, 1);
  }

  yinPhaseEffect(socket, board, players, ghostPosition, bank) { /* eslint-disable-line no-unused-vars */
    const villagers = board.getVillagers();
    super.haunter(ghostPosition, villagers);
  }
}

module.exports = Ghoul;
