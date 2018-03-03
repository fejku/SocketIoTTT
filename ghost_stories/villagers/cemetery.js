const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');
const dice = require('../actions/curse_dice');

// Pośród porosłych chwastami nagrobków grabarz strzeże drzwi pomiędzy królestwami.
// Przywróć zmarłego Taoistę do rozgrywki. Daj mu 2 Czi, następnie rzuć kością Klątwy.
class Cemetery extends Villager {
  constructor() {
    super();
    this.name = 'Cemetery';
  }

  validateHelp(board, players, bank) {
    // Check if there are enough Qi markers in bank
    if (bank.getQiMarkers(players.getTaoists()) < 2) {
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
      socket.emit('ghost pick player to review', deadPlayers, (pickedPlayerColor) => {
        const player = players.getPlayerByColor(pickedPlayerColor);
        resolve(player);
      });
    });
  }

  async action(socket, board, players, bank) {
    const player = await this.pickPlayerToReview(socket, players);
    player.gainQi(2);
    bank.updateMarkers(players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
    dice.throwCurseDiceCemetry(socket, board, players, bank);
  }
}

module.exports = Cemetery;
