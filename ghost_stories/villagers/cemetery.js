const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');
const dice = require('../actions/curse_dice');

// Return a dead Taoist to the game. Give him 2 Qi, then roll the Curse die.
// The Haunting face haunts the Cemetery tile.
class Cemetery extends Villager {
  constructor() {
    super();
    this.name = 'Cemetery';
  }

  validateHelp(board, players, bank) {
    // Check if there are enough Qi tokens in bank
    if (bank.getQiTokens(players.getTaoists()) < 2) {
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
    return new Promise((resolve) => {
      const deadPlayers = players.getDeadPlayers();
      socket.emit(
        'ghost question',
        'Pick a color which player you want to review',
        deadPlayers.map(deadPlayer => deadPlayer.color),
        (pickedPlayerColor) => {
          const player = players.getPlayerByColor(pickedPlayerColor);
          resolve(player);
        },
      );
    });
  }

  async action(socket, board, players, bank) {
    const player = await this.pickPlayerToReview(socket, players);
    player.gainQi(2);
    bank.updateTokens(socket, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
    dice.throwCurseDiceCemetry(socket, board, players, bank);
  }
}

module.exports = Cemetery;
