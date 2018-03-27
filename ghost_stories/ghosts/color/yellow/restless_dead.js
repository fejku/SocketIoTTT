const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class RestlessDead extends Haunter {
  constructor() {
    super('Restless Dead', FiveColors.YELLOW, 2);
  }
}

module.exports = RestlessDead;
