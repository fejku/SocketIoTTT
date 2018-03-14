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

  pickColor(socket, question, availableColors) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost question', question, availableColors, null, (pickedColor) => {
        // Validate if picked color was available in colors array
        if (this.validatePickedColor(availableColors, pickedColor)) {
          resolve(pickedColor);
        } else {
          reject();
        }
      });
    });
  }

  givePlayerTaoToken(socket, board, players, bank, color) {
    const circleOfPrayer = board.getVillagers().getVillagerByName('Circle of prayer');

    if (bank.getTaoTokens(players.getTaoists(), circleOfPrayer)[color] > 0) {
      players.getActualPlayer().gainTaoToken(color);
      bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
    }
  }

  givePlayerQiToken(socket, board, taoists, bank, player) {
    const circleOfPrayer = board.getVillagers().getVillagerByName('Circle of prayer');

    if (bank.getQiTokens(taoists) > 0) {
      player.gainQi();
      bank.updateTokens(socket, taoists, circleOfPrayer);
    }
  }
}

module.exports = Villager;
