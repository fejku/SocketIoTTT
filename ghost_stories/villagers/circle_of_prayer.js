const { FiveColors } = require('../enums/color');

const Villager = require('./villager');

class CircleOfPrayer extends Villager {
  constructor() {
    super();
    this.name = 'Circle of prayer';
    this.taoTokens = this.initTaoTokens();
  }

  initTaoTokens() {
    return this.removeTaoTokenFromTile();
  }

  removeTaoTokenFromTile() {
    const taoTokens = {};
    for (const colorItem of FiveColors.enums) {
      taoTokens[colorItem.key] = 0;
    }

    return taoTokens;
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    return true;
  }

  getAvailableColors(bankTaoTokens) {
    const availableColors = [];
    for (const color of FiveColors.enums) {
      if (bankTaoTokens[color] > 0) {
        availableColors.push(color.key);
      }
    }

    return availableColors;
  }

  validatePickedColor(availableColors, pickedColor) {
    return availableColors.indexOf(pickedColor) !== -1;
  }

  async pickColor(socket, availableColors) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost circle of prayer pick color', availableColors, (pickedColor) => {
        // Validate if picked color was available in colors array
        if (this.validatePickedColor(availableColors, pickedColor)) {
          resolve(pickedColor);
        } else {
          reject();
        }
      });
    });
  }

  async action(socket, board, players, bank) {
    // Remove Tao token from villager tile if exists
    this.removeTaoTokenFromTile();
    // Get available in bank tao tokens
    const availableColors = this.getAvailableColors(bank.getTaoTokens(players.getTaoists(), this));
    // Pick which color token to put on tile
    const pickedColor = await this.pickColor(socket, availableColors);
    // Put Tao token on tile
    this.taoTokens[pickedColor] = 1;
    // Update bank
    bank.updateTokens(socket, players.getTaoists(), this);
  }
}

module.exports = CircleOfPrayer;
