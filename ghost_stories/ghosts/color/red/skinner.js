const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class Skinner extends Haunter {
  constructor() {
    super('Skinner', FiveColors.RED, 1);
  }
}

module.exports = Skinner;
