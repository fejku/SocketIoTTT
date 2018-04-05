const Villager = require('./villager');

const dice = require('../actions/curse_dice');
const questions = require('../utils/questionsUI');

// Return a dead Taoist to the game. Give him 2 Qi, then roll the Curse die.
// The Haunting face haunts the Cemetery tile.
class Cemetery extends Villager {
  constructor() {
    super();
    this.name = 'Cemetery';
  }

  validateHelp(board, players, bank) {
    if (!super.validateHelp()) {
      return false;
    }
    // Check if there is any Qi tokens in bank
    if (!bank.isQiTokenLeft()) {
      return false;
    }

    // Check if there is any dead taoist
    for (const taoist of players.getTaoists()) {
      if (!taoist.isAlive()) {
        return true;
      }
    }
    return false;
  }

  async pickPlayerToReview(socket, players) {
    const deadPlayers = players.getDeadPlayers().map(deadPlayer => deadPlayer.color.key);

    const pickedPlayer = await questions.ask(socket, 'Pick a color which player you want to review', deadPlayers);

    return players.getPlayerByColor(pickedPlayer);
  }

  async action(socket, board, players, bank) {
    const player = await this.pickPlayerToReview(socket, players);

    if (bank.isQiTokenLeft(2)) {
      player.gainQi(bank, 2);
    } else {
      player.gainQi(bank, 1);
    }
    bank.updateUI(socket);

    dice.throwCurseDiceCemetry(socket, board, players, bank);
  }
}

module.exports = Cemetery;
