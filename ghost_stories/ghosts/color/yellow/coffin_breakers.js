const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class CoffinBreakers extends Ghost {
  constructor(disablingTaoistPower) {
    super('Coffin Breakers', FiveColors.YELLOW, 1);

    this.disablingTaoistPower = disablingTaoistPower;
  }

  async immediateEffect(socket, board, players, bank) {
    // Place new ghost
    await board.ghostArrival(socket, players, bank);
    if (this.isDisablingTaoistPower()) {
      board.getPlayerBoardById(this.position.playerBoardIndex).setPowerActive(false);
    }
  }
}

module.exports = CoffinBreakers;
