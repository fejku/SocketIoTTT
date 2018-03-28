const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');

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
    const circleOfPrayer = board.getVillagerByClass(CircleOfPrayer);
    const taoists = players.getTaoists();

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
    this.givePlayerQiToken(socket, board, taoists, bank, players.getActualPlayer());

    // Bring ghost into play
    await board.ghostArrival(socket, players, bank, circleOfPrayer);
  }
}

module.exports = TeaHouse;
