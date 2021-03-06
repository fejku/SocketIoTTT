const Villager = require('./villager');

const UI = require('../utils/UI');
const questions = require('../utils/questionsUI');

// Take a Tao token of whatever color you wish from the supply, and gain 1 Qi point. Then, bring a ghost into play.
class TeaHouse extends Villager {
  constructor() {
    super();
    this.name = 'Tea House';
  }

  validateHelp(board, players, bank) {
    if (!super.validateHelp()) {
      return false;
    }
    // If there are tao and qi tokens
    return bank.isTaoTokenLeft() || (bank.isQiTokenLeft());
  }

  async action(socket, board, players, bank) {
    // If there is tao token in bank
    if (bank.isTaoTokenLeft()) {
      // Get available tao tokens
      const availableTaoTokensColors = bank.getAvailableTaoTokensColors();
      console.log('availableTaoTokensColors: ', availableTaoTokensColors);
      // Pick tao token
      const pickedColor = await questions.ask(socket, 'Pick tao token color', availableTaoTokensColors);
      console.log('pickedColor: ', pickedColor);
      // Give player tao token
      this.givePlayerTaoToken(socket, board, players, bank, pickedColor);
    }

    // Get qi token
    players.getActualPlayer().gainQi(bank);
    UI.refreshBank(socket, bank);

    // Bring ghost into play
    await board.ghostArrival(socket, players, bank);
  }
}

module.exports = TeaHouse;
