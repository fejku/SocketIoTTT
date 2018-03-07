const { SixColors } = require('../enums/color');
const Villager = require('./villager');
const ColorDice = require('../actions/color_dice');
const CircleOfPrayer = require('./circle_of_prayer');

// Na zakurzonych półkach tego sklepu znajdują się wszelkie komponenty do mistycznych rytuałów.
// Rzuć 2 kośćmi Tao i weź z banku znaczniki tao w odpowiednich kolorach, zgodnie z ich dostępnością.
// Każda wyrzucona biała ścianka pozwala Ci wybrać kolor znacznika Tao.
class HerbalistShop extends Villager {
  constructor() {
    super();
    this.name = 'Herbalist Shop';
  }

  validateHelp(board, players, bank) {
    // Check if tao tokens left
    return this.isTaoTokenLeftInBank(
      bank,
      players.getTaoists(),
      board.getVillagerByClass(CircleOfPrayer),
    );
  }

  isTaoTokenLeftInBank(bank, taoists, circleOfPrayer) {
    return Object
      .values(bank.getTaoTokens(taoists, circleOfPrayer))
      .some(item => item > 0);
  }

  givePlayerTaoToken(socket, board, players, bank, color) {
    if (bank.getTaoTokens(players.getTaoists(), board.getVillagerByClass(CircleOfPrayer))[color] > 0) {
      players.getActualPlayer().gainTaoToken(color);
      bank.updateTokens(socket, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
    }
  }

  getAvailableTokensColors(bank, taoists, circleOfPrayer) {
    return Object
      .entries(bank.getTaoTokens(taoists, circleOfPrayer))
      .filter(([colorKey, colorValue]) => colorValue > 0) /* eslint-disable-line no-unused-vars */
      .map(([colorKey]) => colorKey);
  }

  validatePickedColor(availableTaoTokensColors, pickedToken) {
    return availableTaoTokensColors
      .find(item => item === pickedToken) !== undefined;
  }

  pickColor(socket, availableTaoTokensColors) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost herbalist shop pick token', availableTaoTokensColors, (pickedColor) => {
        if (this.validatePickedColor(availableTaoTokensColors, pickedColor)) {
          resolve(pickedColor);
        } else {
          reject();
        }
      });
    });
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
          if (this.isTaoTokenLeftInBank(bank, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer))) {
            const availableTaoTokensColors = this.getAvailableTokensColors(
              bank,
              players.getTaoists(),
              board.getVillagerByClass(CircleOfPrayer),
            );
            console.log('availableTaoTokensColors: ', availableTaoTokensColors);
            const pickedColor = await this.pickColor(socket, availableTaoTokensColors); /* eslint-disable-line no-await-in-loop */
            console.log('pickedColor: ', pickedColor);
            this.givePlayerTaoToken(socket, board, players, bank, pickedColor);
          }
        }
      }
    }
  }
}

module.exports = HerbalistShop;
