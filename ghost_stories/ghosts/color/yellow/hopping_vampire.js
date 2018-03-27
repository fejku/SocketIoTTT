const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class HoppingVampire extends Haunter {
  constructor() {
    super('Hopping Vampire', FiveColors.YELLOW, 3);
  }
}

module.exports = HoppingVampire;
