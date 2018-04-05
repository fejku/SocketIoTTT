const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const UI = require('../../../utils/UI');
const questions = require('../../../utils/questionsUI');

class FleshDevourer extends Ghost {
  constructor() {
    super('Flesh Devourer', FiveColors.RED, 4);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    for (let i = 0; i < 2; i++) {
      if (bank.isTaoTokenLeft()) {
        // Get tao tokens available in bank
        const availableColors = bank.getAvailableTaoTokensColors();
        // Pick which color token to put on tile
        const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors);
        players.getActualPlayer().gainTaoToken(bank, pickedColor);
        UI.refreshBank(socket, bank);
      }
    }
  }
}

module.exports = FleshDevourer;
