const { FiveColors } = require('../enums/color');
const playersUtils = require('./players_utils');

class Taoist {
  constructor(color) {
    this.color = color;
    this.qiTokens = 4;
    this.jinJangToken = 1;
    this.taoTokens = this.initTaoTokens();
    this.position = 4;

    this.buddhaFigures = [];
  }

  initTaoTokens() {
    const taoTokens = {};
    for (const colorItem of FiveColors.enums) {
      if (colorItem.key === this.color.key) {
        taoTokens[colorItem.key] = 1;
      } else {
        taoTokens[colorItem.key] = 0;
      }
    }
    return taoTokens;
  }

  getColor() {
    return this.color;
  }

  gainQi(amount = 1) {
    this.qiTokens += amount;
  }

  loseQi(amount = 1) {
    this.qiTokens -= amount;
  }

  loseAllTaoTokens() {
    for (const colorItem of FiveColors.enums) {
      this.taoTokens[colorItem.key] = 0;
    }
  }

  gainTaoToken(color, amount = 1) {
    this.taoTokens[color] += amount;
  }

  loseTaoToken(color, amount = 1) {
    this.taoTokens[color] -= amount;
  }

  getPosition() {
    return this.position;
  }

  move(pickedMove) {
    this.position = pickedMove;
  }

  isAlive() {
    return this.qiTokens > 0;
  }

  validateExorcism(playersBoards) {
    return playersUtils.isGhostInRange(playersBoards, this.position);
  }

  getGhostsInRange(playersBoards) {
    return playersUtils.getGhostsInRange(playersBoards, this.position);
  }

  gainBuddhaFigure() {
    return this.buddhaFigures.push({ status: 'inactive' });
  }

  setBuddhaFiguresActive() {
    this.buddhaFigures
      .filter(buddha => buddha.status === 'inactive')
      .forEach((buddha) => {
        buddha.status = 'active';
      });
  }

  isActiveBuddhaFigure() {
    return this.buddhaFigures.find(buddha => buddha.status === 'active') !== undefined;
  }

  getAmountActiveBuddhaFigures() {
    return this.buddhaFigures.filter(buddha => buddha.status === 'active').length;
  }

  askIfPlaceBuddha(socket) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost ask if place buddha', (choice) => {
        resolve(choice);
      });
    });
  }

  isPlayerInCornerField() {
    return playersUtils.isPlayerInCornerField(this.position);
  }

  isPlayerInMiddleField() {
    return playersUtils.isPlayerInMiddleField(this.position);
  }

  placeBuddhaFigures(playersBoards, pickedField = null) {
    // Place all available buddha figures
    if (pickedField === null) {
      const fields = playersUtils.getNearFields(this.position);

      fields.forEach((field) => {
        playersBoards;
      });
    }
  }
}

module.exports = Taoist;
