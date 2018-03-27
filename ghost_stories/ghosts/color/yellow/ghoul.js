const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class Ghoul extends Haunter {
  constructor() {
    super('Ghoul', FiveColors.YELLOW, 1);
  }
}

module.exports = Ghoul;
