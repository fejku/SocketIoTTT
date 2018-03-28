const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class Reaper extends Ghost {
  constructor() {
    super('Reaper', FiveColors.RED, 1);
    this.taoDiceHaveEffect = false;
  }
}

module.exports = Reaper;
