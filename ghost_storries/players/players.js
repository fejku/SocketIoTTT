const arrayShuffle = require('array-shuffle');
const playersUtils = require('./players_utils');

const { FourColors } = require('../enums/color');
const Taoist = require('./taoist');

class Players {
  constructor() {
    this.actualPlayer = 0;
    this.taoists = this.initTaoist();
  }

  initTaoist() {
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

  getAvailableMoves(actualField) {
    return playersUtils.getAvailableMoves(actualField);
  }

  pickMove(socket, availableMoves) {
    return playersUtils.pickMove(socket, availableMoves);
  }

  makeDecision(socket, availableDecisions) {
    return new Promise((resolve) => {
      socket.emit('ghost player decision', availableDecisions, (decision) => {
        resolve(decision);
      });
    });
  }

  getDeadPlayers() {
    const deadPlayers = [];
    for (const player of this.taoists) {
      if (!player.isAlive()) {
        deadPlayers.push(player);
      }
    }
    return deadPlayers;
  }
}

module.exports = Players;
