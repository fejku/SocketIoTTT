const { SixColors } = require('../enums/color');
const Villager = require('./villager');
const ColorDice = require('../actions/color_dice');
const CircleOfPrayer = require('./circle_of_prayer');

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

    // Give player tao token if there is one left and color isn't white
    for (const [resultKey, resultValue] of Object.entries(dicesThrowResult)) {
      if ((resultKey !== SixColors.WHITE.key) && (resultValue > 0)) {
        for (let i = 0; i < resultValue; i++) {
          this.givePlayerTaoToken(socket, board, players, bank, resultKey, resultValue);
        }
      }
    }

    // If white result, pick one on tao tokens that left
    for (const [resultKey, resultValue] of Object.entries(dicesThrowResult)) {
      if ((resultKey === SixColors.WHITE.key) && (resultValue > 0)) {
        for (let i = 0; i < resultValue; i++) {
          if (bank.isTaoTokenLeft()) {
            const availableTaoTokensColors = bank.getAvailableTaoTokensColors();
            console.log('availableTaoTokensColors: ', availableTaoTokensColors);
            const pickedColor = await this.pickColor(socket, 'Pick tao token color', availableTaoTokensColors); /* eslint-disable-line no-await-in-loop, max-len */
            console.log('pickedColor: ', pickedColor);
            this.givePlayerTaoToken(socket, board, players, bank, pickedColor);
          }
        }
      }
    }
  }
}

module.exports = HerbalistShop;
