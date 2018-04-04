const { SixColors } = require('../enums/color');
const Villager = require('./villager');
const ColorDice = require('../actions/color_dice');

const questions = require('../utils/questionsUI');

// Roll 2 Tao dice and take Tao tokens of the corresponding colors from the supply (limited by the supply).
// Each white face rolled allows you to choose the color of Tao token to take.
class HerbalistShop extends Villager {
  constructor() {
    super();
    this.name = 'Herbalist Shop';
  }

  validateHelp(board, players, bank) {
    if (!super.validateHelp()) {
      return false;
    }
    // Check if tao tokens left
    return bank.isTaoTokenLeft();
  }

  async action(socket, board, players, bank) {
    // Throw two dices
    const dicesThrowResult = ColorDice.throwDices(2);
    // Allow reroll if green board
    await board.getPlayerBoardById(players.getActualPlayerId())
      .boardPower(socket, board, players, bank, 'After color dice throw', dicesThrowResult);

    // Give player tao token if there is one left and color isn't white
    dicesThrowResult
      .filter(color => color !== SixColors.WHITE.key)
      .forEach((color) => {
        this.givePlayerTaoToken(socket, board, players, bank, color);
      });

    // If white result, pick one on tao tokens that left
    for (const color of dicesThrowResult) {
      if (color === SixColors.WHITE.key) {
        if (bank.isTaoTokenLeft()) {
          const availableTaoTokensColors = bank.getAvailableTaoTokensColors();
          console.log('availableTaoTokensColors: ', availableTaoTokensColors);
          const pickedColor = await questions.ask(socket, 'Pick tao token color', availableTaoTokensColors);
          console.log('pickedColor: ', pickedColor);
          this.givePlayerTaoToken(socket, board, players, bank, pickedColor);
        }
      }
    }
  }
}

module.exports = HerbalistShop;
