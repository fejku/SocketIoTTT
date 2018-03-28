class Villager {
  constructor() {
    this.haunted = false;
  }

  isHaunted() {
    return this.haunted;
  }

  setHaunted(haunted) {
    this.haunted = haunted;
  }

  action(socket, board, players, bank) { /* eslint-disable-line no-unused-vars */
    console.log('Abstract Villager action()');
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (this.haunted) {
      return false;
    }
    return true;
  }

  validatePickedColor(availableColors, pickedColor) {
    return availableColors
      .find(item => item === pickedColor) !== undefined;
  }

  givePlayerTaoToken(socket, board, players, bank, color) {
    const circleOfPrayer = board.getVillagers().getVillagerByName('Circle of prayer');

    if (bank.isTaoTokenColorLeft(color)) {
      players.getActualPlayer().gainTaoToken(color);
      bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
    }
  }

  givePlayerQiToken(socket, board, taoists, bank, player) {
    const circleOfPrayer = board.getVillagers().getVillagerByName('Circle of prayer');

    if (bank.isQiTokenLeft()) {
      player.gainQi();
      bank.updateTokens(socket, taoists, circleOfPrayer);
    }
  }
}

module.exports = Villager;
