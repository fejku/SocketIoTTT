const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class OozeDevil extends Haunter {
  constructor() {
    super('Ooze Devil', FiveColors.BLUE, 3);
  }
}

module.exports = OozeDevil;
