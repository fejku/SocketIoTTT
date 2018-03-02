const arrayShuffle = require('array-shuffle');
const playersUtils = require('./players_utils');

const Colors = require('../enums/color').FourColors;
const Taoist = require('./taoist');

class Players {
  constructor() {
    this.actualPlayer = 0;
    this.taoists = this.initTaoist();
  }

  initTaoist() {
    return arrayShuffle([new Taoist(Colors.GREEN),
      new Taoist(Colors.YELLOW),
      new Taoist(Colors.RED),
      new Taoist(Colors.BLUE),
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
