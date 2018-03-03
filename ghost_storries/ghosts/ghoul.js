const Ghost = require('./ghost');
const { FiveColors } = require('../enums/color');

class Ghoul extends Ghost {
  constructor() {
    super('Ghoul', FiveColors.YELLOW, 1);
  }

  yinPhaseEffect() {
    super.haunter();
  }
}

module.exports = Ghoul;
