const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');

class YellowPlague extends Ghost {
  constructor() {
    super('Yellow Plague', FiveColors.YELLOW, 4);
  }

  afterWinningEffect(socket, board, players, bank, ghostPosition, circleOfPrayer) {
    // TODO: +2 Tao Tokens
    for (let i = 0; i < 2; i++) {
      // Get available colors
      // Pick color
      if (bank.getTaoTokens(players.getTaoists(), circleOfPrayer)[color] > 0) {
        players.getActualPlayer().gainTaoToken(color);
        bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
      }
    }
  }
}

module.exports = YellowPlague;
