const arrayShuffle = require('array-shuffle');
const playersUtils = require('./players_utils');
const questions = require('../utils/questionsUI');

const { FourColors } = require('../enums/color');
const Taoist = require('./taoist');

class Players {
  constructor() {
    this.actualPlayer = 0;
    this.taoists = this.initTaoists();
  }

  initTaoists() {
    return arrayShuffle([new Taoist(FourColors.GREEN),
      new Taoist(FourColors.YELLOW),
      new Taoist(FourColors.RED),
      new Taoist(FourColors.BLUE),
    ]);
  }

  getTaoists() {
    return this.taoists;
  }

  getTaoist(index) {
    return this.taoists[index];
  }

  getActualPlayerId() {
    return this.actualPlayer;
  }

  getActualPlayerColor() {
    return this.taoists[this.actualPlayer].color.key;
  }

  getActualPlayer() {
    return this.taoists[this.actualPlayer];
  }

  getPlayerByColor(color) {
    for (const player of this.taoists) {
      if (player.color.key === color) {
        return player;
      }
    }
    return null;
  }

  getPlayerIdByColor(color) {
    return this.taoists.findIndex(taoist => taoist.color === color);
  }

  getAvailableMoves(actualField) {
    return playersUtils.getAvailableMoves(actualField);
  }

  pickMove(socket, availableMoves) {
    return questions.pickVillagerTile(socket, availableMoves);
  }

  getDeadPlayers() {
    return this.taoists.filter(taoist => !taoist.isAlive());
  }

  getAlivePlayers(skipActualPlayer = false) {
    let [...taoists] = this.taoists;
    if (skipActualPlayer) {
      taoists = taoists.filter((taoist, taoistIndex) => taoistIndex !== this.actualPlayer);
    }
    return taoists.filter(taoist => taoist.isAlive());
  }

  nextPlayer() {
    do {
      this.actualPlayer++;
      if (this.actualPlayer > 3) {
        this.actualPlayer = 0;
      }
    } while (!this.getActualPlayer().isAlive());
  }
}

module.exports = Players;
