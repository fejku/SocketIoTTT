const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const questions = require('../../../utils/questionsUI');

class LiquidHorror extends Ghost {
  constructor() {
    super('Liquid Horror', FiveColors.BLUE, 4);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    // TODO: +2 Tao Tokens
    for (let i = 0; i < 2; i++) {
      if (bank.isTaoTokenLeft()) {
        // Get tao tokens available in bank
        const availableColors = bank.getAvailableTaoTokensColors();
        // Pick which color token to put on tile
        const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors); /* eslint-disable-line no-await-in-loop */
        players.getActualPlayer().gainTaoToken(bank, pickedColor);
        bank.updateUI(socket);
      }
    }
  }
}

module.exports = LiquidHorror;
