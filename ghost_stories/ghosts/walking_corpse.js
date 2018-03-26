const Ghost = require('./ghost');
const { FiveColors } = require('../enums/color');

class WalkingCorpse extends Ghost {
  constructor() {
    super('Walking Corpse', FiveColors.YELLOW, 1);
  }

  immediateEffect() {
    //
  }

  yinPhaseEffect(socket, board, players, ghostPosition, bank) { /* eslint-disable-line no-unused-vars */
    const villagers = board.getVillagers();
    super.haunter(ghostPosition, villagers);
  }

  afterWinningEffect() {
    //
  }
}

module.exports = WalkingCorpse;
