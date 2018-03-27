const Haunter = require('../../haunter');
const { FiveColors } = require('../../../enums/color');

class CreepingOne extends Haunter {
  constructor() {
    super('Creeping One', FiveColors.GREEN, 1);
  }
}

module.exports = CreepingOne;
