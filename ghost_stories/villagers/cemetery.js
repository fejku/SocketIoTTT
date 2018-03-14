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
    if (!super.validateHelp()) {
      return false;
    }
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

  validatePickedPlayer(deadPlayers, pickedPlayer) {
    return deadPlayers.indexOf(pickedPlayer) !== -1;
  }

  async pickPlayerToReview(socket, players) {
    return new Promise((resolve, reject) => {
      const deadPlayers = players.getDeadPlayers().map(deadPlayer => deadPlayer.color.key);
      console.log('pickPlayerToReview', deadPlayers);
      socket.emit(
        'ghost question',
        'Pick a color which player you want to review',
        deadPlayers,
        null,
        (pickedPlayer) => {
          console.log('pickPlayerToReview picked player', pickedPlayer);
          if (this.validatePickedPlayer(deadPlayers, pickedPlayer)) {
            const player = players.getPlayerByColor(pickedPlayer);
            resolve(player);
          } else {
            reject();
          }
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
