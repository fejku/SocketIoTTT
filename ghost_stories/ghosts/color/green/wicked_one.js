const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class WickedOne extends Haunter {
  constructor() {
    super('Wicked One', FiveColors.GREEN, 3);
  }
}

module.exports = WickedOne;
