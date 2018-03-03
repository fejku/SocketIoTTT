const { FourColors, FiveColors } = require('./enums/color');

const QI_MARKERS_AMOUNT = 20;
const TAO_MARKERS_AMOUNT = 4;

class Bank {
  constructor() {
    this.qiMarkers = this.initQiMarkers();
    this.jinJangMarkers = this.initJinJangMarkers();
    this.taoMarkers = this.initTaoMarkers();
  }

  initQiMarkers() {
    return 4;
  }

  initTaoMarkers() {
    const taoMarkers = [];
    for (const color of FiveColors.enums) {
      if (color.is(FiveColors.BLACK)) {
        taoMarkers[color] = 4;
      } else {
        taoMarkers[color] = 3;
      }
    }
    return taoMarkers;
  }

  initJinJangMarkers() {
    const jinJangMarkers = [];
    for (const color of FourColors.enums) {
      jinJangMarkers[color] = 0;
    }
    return jinJangMarkers;
  }

  getQiMarkers(taoists) {
    let qiMarkers = QI_MARKERS_AMOUNT;
    for (const taoist of taoists) {
      qiMarkers -= taoist.qiMarkers;
    }
    return qiMarkers;
  }

  getTaoMarkers(taoists, circleOfPrayer) {
    const taoMarkers = [];
    for (const color of FiveColors.enums) {
      taoMarkers[color] = TAO_MARKERS_AMOUNT;
    }
    for (const color of FiveColors.enums) {
      for (const taoist of taoists) {
        taoMarkers[color] -= taoist.taoMarkers[color] + circleOfPrayer.taoMarkers[color];
      }
    }

    return taoMarkers;
  }

  getJinJangMarkers(taoists) {
    const jinJangMarkers = [];
    for (const taoist of taoists) {
      if (taoist.jinJangMarker === 0) {
        jinJangMarkers[taoist.color] = 1;
      } else {
        jinJangMarkers[taoist.color] = 0;
      }
    }

    return jinJangMarkers;
  }

  updateMarkers(taoists, circleOfPrayer) {
    this.qiMarkers = this.getQiMarkers(taoists);
    this.taoMarkers = this.getTaoMarkers(taoists, circleOfPrayer);
    this.jinJangMarker = this.getJinJangMarkers(taoists);
  }
}

module.exports = Bank;
