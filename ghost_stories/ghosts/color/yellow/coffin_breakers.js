const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class CoffinBreakers extends Ghost {
  constructor(isDisablingTaoistPower) {
    super('Coffin Breakers', FiveColors.YELLOW, 1);

    this.isDisablingTaoistPower = isDisablingTaoistPower;
  }

  async immediateEffect(socket, board, players, bank, circleOfPrayer) {
    // Place new ghost
    await board.ghostArrival(socket, players, bank, circleOfPrayer);
    if (this.isDisablingTaoistPower) {
      // TODO: disable power on board where ghost is
    }
  }
}

module.exports = CoffinBreakers;
