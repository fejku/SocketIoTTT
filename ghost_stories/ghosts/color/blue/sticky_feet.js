const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class StickyFeet extends Haunter {
  constructor() {
    super('Sticky Feet', FiveColors.BLUE, 2);
  }
}

module.exports = StickyFeet;
