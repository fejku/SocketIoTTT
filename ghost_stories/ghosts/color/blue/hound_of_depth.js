const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class HoundOfDepth extends Ghost {
  constructor() {
    super('Hound of Depth', FiveColors.BLUE, 1);
    this.taoDiceHaveEffect = false;
  }
}

module.exports = HoundOfDepth;
