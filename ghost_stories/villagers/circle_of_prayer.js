const { FiveColors } = require('../enums/color');

const Villager = require('./villager');

class CircleOfPrayer extends Villager {
  constructor() {
    super();
    this.name = 'Circle of prayer';
    this.taoMarkers = this.initTaoMarkers();
  }

  initTaoMarkers() {
    const taoMarkers = {};
    for (const colorItem of FiveColors.enums) {
      taoMarkers[colorItem.key] = 0;
    }

    return taoMarkers;
  }

  validateHelp(board, players, bank) {
    return true;
  }

  async action(socket, board, players, bank) {
    // Remove Tao token from villager tile if exists
    // Put Tao token on tile
    // Update bank
  }
}

module.exports = CircleOfPrayer;
