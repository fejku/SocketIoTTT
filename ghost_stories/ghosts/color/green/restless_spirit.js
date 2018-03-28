const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class RestlessSpirit extends Haunter {
  constructor() {
    super('Restless Spirit', FiveColors.GREEN, 2);
  }
}

module.exports = RestlessSpirit;
