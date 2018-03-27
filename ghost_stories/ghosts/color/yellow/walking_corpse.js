const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class WalkingCorpse extends Ghost {
  constructor() {
    super('Walking Corpse', FiveColors.YELLOW, 1);
    this.taoDiceHaveEffect = false;
  }
}

module.exports = WalkingCorpse;
