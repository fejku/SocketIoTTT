const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class YellowPlague extends Ghost {
  constructor() {
    super('Yellow Plague', FiveColors.YELLOW, 4);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition, circleOfPrayer) {
    // TODO: +2 Tao Tokens
    for (let i = 0; i < 2; i++) {
      // Get available in bank tao tokens
      const availableColors = bank.getAvailableTaoTokensColors();
      // Pick which color token to put on tile
      const pickedColor = await this.pickColor(socket, 'Pick tao token color', availableColors);
      // Pick color
      if (bank.isTaoTokenColorLeft(color)) {
        players.getActualPlayer().gainTaoToken(color);
        bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
      }
    }
  }
}

module.exports = YellowPlague;
