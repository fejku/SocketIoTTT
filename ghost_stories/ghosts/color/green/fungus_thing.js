const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class FungusThing extends Ghost {
  constructor() {
    super('Fungus Thing', FiveColors.GREEN, 1);
    this.taoDiceHaveEffect = false;
  }
}

module.exports = FungusThing;
