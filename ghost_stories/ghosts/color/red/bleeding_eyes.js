const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class BleedingEyes extends Haunter {
  constructor() {
    super('Bleeding Eyes', FiveColors.RED, 2);
  }
}

module.exports = BleedingEyes;
