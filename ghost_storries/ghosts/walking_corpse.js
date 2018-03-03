const Ghost = require('./ghost');
const { FiveColors } = require('../enums/color');

class WalkingCorpse extends Ghost {
  constructor() {
    super('Walking Corpse', FiveColors.YELLOW, 1);
  }

  immediateEffect() {
    //
  }

  yinPhaseEffect() {
    super.haunter();
  }

  afterWinningEffect() {
    //
  }
}

module.exports = WalkingCorpse;
