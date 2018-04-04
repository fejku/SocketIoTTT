const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const questions = require('../../../utils/questionsUI');

class GreenAbomination extends Ghost {
  constructor() {
    super('Green Abomination', FiveColors.GREEN, 4);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    for (let i = 0; i < 2; i++) {
      if (bank.isTaoTokenLeft()) {
        // Get tao tokens available in bank
        const availableColors = bank.getAvailableTaoTokensColors();
        // Pick which color token to put on tile
        const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors);
        players.getActualPlayer().gainTaoToken(bank, pickedColor);
        bank.updateUI(socket);
      }
    }
  }
}

module.exports = GreenAbomination;
