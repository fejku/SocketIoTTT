const { FiveColors } = require('../enums/color');
const playersUtils = require('./players_utils');

class Taoist {
  constructor(color) {
    this.color = color;
    this.qiMarkers = 4;
    this.jinJangMarker = 1;
    this.taoMarkers = this.initTaoMarkers();
    this.position = 4;
  }

  initTaoMarkers() {
    const taoMarkers = {};
    for (const colorItem of FiveColors.enums) {
      if (colorItem.key === this.color.key) {
        taoMarkers[colorItem.key] = 1;
      } else {
        taoMarkers[colorItem.key] = 0;
      }
    }
    return taoMarkers;
  }

  getColor() {
    return this.color;
  }

  gainQi(amount = 1) {
    this.qiMarkers += amount;
  }

  loseQi(amount = 1) {
    this.qiMarkers -= amount;
  }

  loseAllTaoMarkers() {
    for (const colorItem of FiveColors.enums) {
      this.taoMarkers[colorItem.key] = 0;
    }
  }

  getPosition() {
    return this.position;
  }

  move(pickedMove) {
    this.position = pickedMove;
  }

  isAlive() {
    return this.qiMarkers > 0;
  }

  validateExorcism(playersBoards) {
    return playersUtils.isGhostInRange(playersBoards, this.position);
  }

  getGhostsInRange(playersBoards) {
    return playersUtils.getGhostsInRange(playersBoards, this.position);
  }
}

module.exports = Taoist;
