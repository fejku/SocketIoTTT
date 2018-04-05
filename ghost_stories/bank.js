const { FourColors, FiveColors } = require('./enums/color');
const UI = require('./utils/UI');

const QI_TOKENS_AMOUNT = 20;
const TAO_TOKENS_AMOUNT = 4;

class Bank {
  constructor() {
    this.qiTokens = this.initQiTokens();
    this.jinJangTokens = this.initJinJangTokens();
    this.taoTokens = this.initTaoTokens();
  }

  initQiTokens() {
    return 4;
  }

  initTaoTokens() {
    const taoTokens = {};
    for (const color of FiveColors.enums) {
      if (color.is(FiveColors.BLACK)) {
        taoTokens[color] = 4;
      } else {
        taoTokens[color] = 3;
      }
    }

    return taoTokens;
  }

  initJinJangTokens() {
    const jinJangTokens = {};
    for (const color of FourColors.enums) {
      jinJangTokens[color] = 0;
    }
    return jinJangTokens;
  }

  getQiTokens() {
    return this.qiTokens;
  }

  getTaoTokens() {
    return this.taoTokens;
  }

  getJinJangTokens() {
    return this.jinJangTokens;
  }

  isQiTokenLeft(amount = 1) {
    return this.qiTokens >= amount;
  }

  isTaoTokenLeft() {
    return Object
      .values(this.getTaoTokens())
      .some(tokens => tokens > 0);
  }

  isTaoTokenColorLeft(color) {
    return Object
      .entries(this.getTaoTokens())
      .find(([colorKey, colorValue]) => colorKey === color && colorValue > 0) !== undefined;
  }

  isJinJangTokenAvailable(color) {
    return Object
      .entries(this.getJinJangTokens())
      .find(([colorKey, colorValue]) => colorKey === color && colorValue > 0) !== undefined;
  }

  getAvailableTaoTokensColors() {
    return Object
      .entries(this.getTaoTokens())
      .filter(([colorKey, colorValue]) => colorValue > 0) /* eslint-disable-line no-unused-vars */
      .map(([colorKey]) => colorKey);
  }

  gainQi(amount = 1) {
    this.qiTokens += amount;
  }

  loseQi(amount = 1) {
    this.qiTokens -= amount;
  }

  gainTaoToken(color) {
    this.taoTokens[color] += 1;
  }

  loseTaoToken(color) {
    this.taoTokens[color] -= 1;
  }

  gainJinJangToken(color) {
    this.jinJangTokens[color] += 1;
  }

  loseJinJangToken(color) {
    this.jinJangTokens[color] -= 1;
  }

  refreshQiTokens(taoists) {
    let qiTokens = QI_TOKENS_AMOUNT;
    for (const taoist of taoists) {
      qiTokens -= taoist.qiTokens;
    }
    return qiTokens;
  }

  refreshTaoTokens(taoists, circleOfPrayer) {
    const taoTokens = {};
    for (const color of FiveColors.enums) {
      taoTokens[color] = TAO_TOKENS_AMOUNT;
      for (const taoist of taoists) {
        taoTokens[color] -= taoist.taoTokens[color];
      }
      if (color === circleOfPrayer.getTaoTokenColor()) {
        taoTokens[color]--;
      }
    }

    return taoTokens;
  }

  refreshJinJangTokens(taoists) {
    const jinJangTokens = [];
    for (const taoist of taoists) {
      if (taoist.jinJangToken === 0) {
        jinJangTokens[taoist.color] = 1;
      } else {
        jinJangTokens[taoist.color] = 0;
      }
    }

    return jinJangTokens;
  }

  updateTokens(socket, taoists, circleOfPrayer) {
    this.qiTokens = this.refreshQiTokens(taoists);
    this.taoTokens = this.refreshTaoTokens(taoists, circleOfPrayer);
    this.jinJangToken = this.refreshJinJangTokens(taoists);

    if (socket !== null) {
      // Update Bank UI
      UI.refreshBank(socket, this);
    }
  }
}

module.exports = Bank;
