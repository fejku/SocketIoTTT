const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const CircleOfPrayer = require('../../../villagers/circle_of_prayer');
const questions = require('../../../utils/questionsUI');

class YellowPlague extends Ghost {
  constructor() {
    super('Yellow Plague', FiveColors.YELLOW, 4);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    // TODO: +2 Tao Tokens
    for (let i = 0; i < 2; i++) {
      if (bank.isTaoTokenLeft()) {
        // Get tao tokens available in bank
        const availableColors = bank.getAvailableTaoTokensColors();
        // Pick which color token to put on tile
        const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors); /* eslint-disable-line no-await-in-loop */
        players.getActualPlayer().gainTaoToken(pickedColor);
        bank.updateTokens(socket, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
      }
    }
  }
}

module.exports = YellowPlague;
