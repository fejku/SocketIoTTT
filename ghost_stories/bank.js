const { FourColors, FiveColors } = require('./enums/color');

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

  getQiTokens(taoists) {
    let qiTokens = QI_TOKENS_AMOUNT;
    for (const taoist of taoists) {
      qiTokens -= taoist.qiTokens;
    }
    return qiTokens;
  }

  getTaoTokens(taoists, circleOfPrayer) {
    const taoTokens = {};
    for (const color of FiveColors.enums) {
      taoTokens[color] = TAO_TOKENS_AMOUNT;
      for (const taoist of taoists) {
        taoTokens[color] -= taoist.taoTokens[color];
      }
      taoTokens[color] -= circleOfPrayer.taoTokens[color];
    }

    return taoTokens;
  }

  getJinJangTokens(taoists) {
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

  isTaoTokenLeft(taoists, circleOfPrayer) {
    return Object
      .values(this.getTaoTokens(taoists, circleOfPrayer))
      .some(tokens => tokens > 0);
  }

  getAvailableTaoTokensColors(taoists, circleOfPrayer) {
    return Object
      .entries(this.getTaoTokens(taoists, circleOfPrayer))
      .filter(([colorKey, colorValue]) => colorValue > 0) /* eslint-disable-line no-unused-vars */
      .map(([colorKey]) => colorKey);
  }

  updateUI(socket) {
    socket.emit('ghost update bank', this);
  }

  updateTokens(socket, taoists, circleOfPrayer) {
    this.qiTokens = this.getQiTokens(taoists);
    this.taoTokens = this.getTaoTokens(taoists, circleOfPrayer);
    this.jinJangToken = this.getJinJangTokens(taoists);

    if (socket !== null) {
      // Update Bank UI
      this.updateUI(socket);
    }
  }
}

module.exports = Bank;
