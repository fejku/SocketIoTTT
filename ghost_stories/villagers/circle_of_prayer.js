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
}

module.exports = CircleOfPrayer;
