const Villager = require('./villager');

const UI = require('../utils/UI');
const questions = require('../utils/questionsUI');

// Place a Tao token from the supply on this tile, or change the one that is already present.
// All the ghosts of the color of the Tao token on this tile have their resistance reduced
// by 1 during an exorcism. This works for all the Taoists.
// The Tao token stays here, in effect, after any exorcisms.
class CircleOfPrayer extends Villager {
  constructor() {
    super();
    this.name = 'Circle of prayer';
    this.taoTokenColor = null;
  }

  getTaoTokenColor() {
    return this.taoTokenColor;
  }

  setTaoTokenColor(color) {
    this.taoTokenColor = color;
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // If exist tao token in bank
    return bank.isTaoTokenLeft();
  }

  async action(socket, board, players, bank) {
    // Get available in bank tao tokens
    const availableColors = bank.getAvailableTaoTokensColors();
    // Pick which color token to put on tile
    const pickedColor = await questions.ask(socket, 'Pick tao token color', availableColors);
    // Set Tao Token Color
    this.setTaoTokenColor(pickedColor);
    // Update bank
    bank.updateTokens(socket, players.getTaoists(), this);
    // Update token UI
    UI.refreshVillagers(socket, board.getAllVillagers());
  }
}

module.exports = CircleOfPrayer;
