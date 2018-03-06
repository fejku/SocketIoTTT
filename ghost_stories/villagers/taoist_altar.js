const Villager = require('./villager');

// Dzięki temu ołtarzowi i ochronnym rytuałom wierni uczniowie pomogą ci przegonić ducha nawiedzającego żeton wioski.
// Anuluj nawiedzenie jednego żetonu wioski, odwracając go na aktywną stronę, a następnie wprowadź do gry ducha.
class TaoistAltar extends Villager {
  constructor() {
    super();
    this.name = 'Taoist Altar';
  }

  validateHelp(board, players, bank) {
    // Check if exists haunted tile
    return board.getAllVillagers().find(item => item.isHaunted()) !== undefined;
  }

  getHauntedTiles(villagers) {
    return villagers.filter(item => item.isHaunted());
  }

  validatePickedTile(hauntedTiles, pickedTile) {
    return hauntedTiles.find(item => item.name === pickedTile.name) !== undefined;
  }

  pickTile(socket, hauntedTiles) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost taoist altar pick tile', hauntedTiles, (pickedTile) => {
        if (this.validatePickedTile(hauntedTiles, pickedTile)) {
          resolve(pickedTile);
        } else {
          reject();
        }
      });
    });
  }

  async action(socket, board, players, bank) {
    // Get haunted tiles
    const hauntedTiles = this.getHauntedTiles(board.getAllVillagers());
    // Pick tile
    const pickedTile = await this.pickTile(socket, hauntedTiles);
    // Cancel haunting
    // Get new ghost into play
  }
}

module.exports = TaoistAltar;
