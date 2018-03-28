const Ghost = require('../../ghost');
const { FiveColors } = require('../../../enums/color');
const dice = require('../../../actions/curse_dice');
const questions = require('../../../utils/questionsUI');

class GreatPutrid extends Ghost {
  constructor() {
    super('Great Putrid', FiveColors.GREEN, 4);
  }

  async yinPhaseEffect(socket, board, players, bank, ghostPosition) {
    // Throw curse die
    dice.throwCurseDice(socket, board, ghostPosition, players, bank);
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    // +1 Qi / Yin Yang
    const actualPlayer = players.getActualPlayer();
    // Check is qi token available
    const availableOptions = [];
    if (bank.isQiTokenLeft()) {
      availableOptions.push('Qi token');
    }
    // Check is jin jang token available
    if (bank.isJinJangTokenAvailable(actualPlayer.getColor())) {
      availableOptions.push('Jin Jang token');
    }
    const pickedAnswer = questions.ask(socket, 'Pick reward', availableOptions);
    if (pickedAnswer === 'Qi token') {
      actualPlayer.gainQi(bank);
      bank.updateUI(socket);
    }
    if (pickedAnswer === 'Jin Jang token') {
      actualPlayer.gainJinJangToken(bank);
      bank.updateUI(socket);
    }
  }
}

module.exports = GreatPutrid;
