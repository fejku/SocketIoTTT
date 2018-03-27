const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class CoffinBreakers extends Ghost {
  constructor(isDisablingTaoistPower) {
    super('Coffin Breakers', FiveColors.YELLOW, 1);
    this.isDisablingTaoistPower = isDisablingTaoistPower;
  }

  immediateEffect(socket, board, players, bank, circleOfPrayer) { /* eslint-disable-line no-unused-vars */
    // Place new ghost
    board.ghostArrival(socket, players, bank, circleOfPrayer);
    if (this.isDisablingTaoistPower) {
      // TODO: disable power on board where ghost is
    }
  }
}

module.exports = CoffinBreakers;
