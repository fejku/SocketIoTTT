const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');
const questions = require('../utils/questionsUI');

class YellowBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.YELLOW;
    this.enfeeblementMantraTokenPosition = null;
  }

  getPowersNames() {
    return ['Bottomless Pockets', 'Enfeeblement Mantra'];
  }

  // Before your move, take a Tao token of whatever color you choose from among those available.
  async bottomlessPocketsPower(socket, players, bank) {
    const pickedColor = await questions.pickTaoTokenColor(socket, bank);
    players.getActualPlayer().gainTaoToken(bank, pickedColor);
    bank.updateUI(socket);
    socket.emit('ghost update players stats', players);
  }

  // Before your move, place the Enfeeblement Mantra token onto any ghost in the game. The ghost’s exorcism
  // resistance is reduced by 1, whoever performs the exorcism. Note that when fighting multicolored incarnations, the
  // color of the Mantra may be chosen after the dice roll. When the targeted ghost is removed from the game, take
  // back the token; you may use it again on your next turn. If you lose your power, remove the Enfeeblement Mantra
  // token from the game.
  enfeeblementMantraPower() {

  }

  async boardPower(socket, board, players, bank, situationName) {
    if (this.powerName === 'Bottomless Pockets') {
      if (situationName === 'Before move') {
        await this.bottomlessPocketsPower(socket, players, bank);
      }
    } else if (this.powerName === 'Enfeeblement Mantra') {
      this.enfeeblementMantraPower(); // TODO
    }
  }
}

module.exports = YellowBoard;
