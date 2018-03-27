const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class DrowendMaiden extends Haunter {
  constructor() {
    super('Drowned Maiden', FiveColors.BLUE, 1);
  }
}

module.exports = DrowendMaiden;
