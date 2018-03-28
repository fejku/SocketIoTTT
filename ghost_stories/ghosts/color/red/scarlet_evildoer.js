const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class ScarletEvildoer extends Haunter {
  constructor() {
    super('Scarlet Evildoer', FiveColors.RED, 3);
  }
}

module.exports = ScarletEvildoer;
