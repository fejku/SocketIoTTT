const { FiveColors } = require('../enums/color');

const Villager = require('./villager');

const questions = require('../utils/questionsUI');

// Place a Tao token from the supply on this tile, or change the one that is already present.
// All the ghosts of the color of the Tao token on this tile have their resistance reduced
// by 1 during an exorcism. This works for all the Taoists.
// The Tao token stays here, in effect, after any exorcisms.
class CircleOfPrayer extends Villager {
  constructor() {
    super();
    this.name = 'Circle of prayer';
    this.taoTokens = this.initTaoTokens();
  }

  initTaoTokens() {
    const tokens = {};

    FiveColors.enums.forEach((color) => {
      tokens[color.key] = 0;
    });

    return tokens;
  }

  removeTaoTokenFromTile() {
    FiveColors.enums.forEach((color) => {
      this.taoTokens[color.key] = 0;
    });
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // If exist tao token in bank
    return bank.isTaoTokenLeft();
  }

  changeToken(pickedColor) {
    // Remove Tao token from villager tile if exists
    this.removeTaoTokenFromTile();
    // Put Tao token on tile
    this.taoTokens[pickedColor] = 1;
  }

  async action(socket, board, players, bank) {
    // Get available in bank tao tokens
    const availableColors = bank.getAvailableTaoTokensColors();
    // Pick which color token to put on tile
    const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors);
    // Remove old token and place new one
    this.changeToken(pickedColor);
    // Update bank
    bank.updateTokens(socket, players.getTaoists(), this);
    // Update token UI
    socket.emit('ghost circle of prayer update token color', pickedColor);
  }
}

module.exports = CircleOfPrayer;
