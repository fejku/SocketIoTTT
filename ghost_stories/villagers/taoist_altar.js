const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');

// Nullify the haunting of one Village tile by turning its active side face-up, and then bring a ghost into play.
class TaoistAltar extends Villager {
  constructor() {
    super();
    this.name = 'Taoist Altar';
  }

  validateHelp(board, players, bank) {
    if (!super.validateHelp()) {
      return false;
    }
    // Check if exists haunted tile
    return board.getAllVillagers().find(item => item.isHaunted()) !== undefined;
  }

  getHauntedTiles(villagers) {
    return villagers.filter(item => item.isHaunted()).map(item => item.name);
  }

  validatePickedTile(hauntedTiles, pickedTile) {
    return hauntedTiles.find(item => item.name === pickedTile.name) !== undefined;
  }

  pickTile(socket, hauntedTiles) {
    return new Promise((resolve, reject) => {
      console.log('Taoist altar hauntedTiles: ', hauntedTiles);
      socket.emit(
        'ghost question',
        'Pick village tile from which you want to chase ghost away',
        hauntedTiles,
        null,
        (pickedTile) => {
          console.log('Taoist altar pickedTile: ', pickedTile);
          if (this.validatePickedTile(hauntedTiles, pickedTile)) {
            resolve(pickedTile);
          } else {
            reject();
          }
        },
      );
    });
  }

  async action(socket, board, players, bank) {
    // Get haunted tiles
    const hauntedTiles = this.getHauntedTiles(board.getAllVillagers());
    // Pick tile
    const villagerName = await this.pickTile(socket, hauntedTiles);
    // Cancel haunting
    board.getVillagers().getVillagerByName(villagerName).setHaunted(false);
    // Get new ghost into play
    await board.ghostArrival(socket, players, bank, board.getVillagerByClass(CircleOfPrayer));
  }
}

module.exports = TaoistAltar;
