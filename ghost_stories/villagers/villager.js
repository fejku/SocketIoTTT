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

  action(socket, board, players, bank) {
    console.log('Abstract Villager action()');
  }

  validateHelp(board, players, bank) {
    return false;
  }

  validatePickedColor(availableTaoTokensColors, pickedToken) {
    return availableTaoTokensColors
      .find(item => item === pickedToken) !== undefined;
  }

  pickColor(socket, availableTaoTokensColors) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost villager pick tao token color', availableTaoTokensColors, (pickedColor) => {
        if (this.validatePickedColor(availableTaoTokensColors, pickedColor)) {
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
