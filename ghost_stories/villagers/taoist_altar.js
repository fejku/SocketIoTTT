const Villager = require('./villager');

const UI = require('../utils/UI');
const questions = require('../utils/questionsUI');

// Nullify the haunting of one Village tile by turning its active side face-up, and then bring a ghost into play.
class TaoistAltar extends Villager {
  constructor() {
    super();
    this.name = 'Taoist Altar';
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // Check if exists haunted tile
    return board.getAllVillagers().find(villager => villager.isHaunted()) !== undefined;
  }

  getHauntedTiles(villagers) {
    return villagers.reduce((prev, curr, index) => {
      if (curr.isHaunted()) {
        prev.push(index);
      }
      return prev;
    }, []);
  }

  async action(socket, board, players, bank) {
    // Get haunted tiles
    const hauntedTiles = this.getHauntedTiles(board.getAllVillagers());
    // Pick tile
    const villagerId = await questions.pickVillagerTile(socket, hauntedTiles);
    // Cancel haunting
    board.getVillager(villagerId).setHaunted(false);
    UI.refreshVillagers(socket, board.getAllVillagers());
    // Get new ghost into play
    await board.ghostArrival(socket, players, bank);
  }
}

module.exports = TaoistAltar;
