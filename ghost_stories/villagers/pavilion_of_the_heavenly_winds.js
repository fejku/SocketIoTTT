const Villager = require('./villager');

const questions = require('../utils/questionsUI');

// Move a ghost of your choice to any free space (even if occupied by a Buddha figure),
// then move a different Taoist to a Village tile. When the ghost moves,
// all his properties go with him. He takes his Haunting figure in the same relative position,
// his marker for deactivation of power, his enfeeblement mantra, etc.
class PavilionOfTheHeavenlyWinds extends Villager {
  constructor() {
    super();
    this.name = 'Pavilion of the Heavenly Winds';
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // Check if there are any ghosts or different players
    const isAnyGhost = board.getPlayersBoards().getGhosts().length > 0;
    const isDifferentPlayerAlive = players.getAlivePlayers().length > 1;
    return isAnyGhost || isDifferentPlayerAlive;
  }

  async action(socket, board, players, bank) {
    // Get all ghosts
    const ghosts = board.getPlayersBoards().getGhosts();
    // Check if there is any ghost
    if (ghosts.length > 0) {
      // Ask if player want to move ghost
      const isMoveGhost = await questions.askYesNo(socket, 'Do you want to move a ghost?');
      if (isMoveGhost) {
        // Pick ghost to move
        const pickedGhost = await questions.pickPlayerBoardField(socket, ghosts);
        // Get available places
        // getEmptyFields();
        // Pick palce to place ghost
        const pickedNewField = await questions.pickPlayerBoardField(socket, availableFields);
        // Move ghost
        // If placed on buddha remove ghost (TODO: is this checking neccessery here???)
      }
    }
    // Is any other player to move (player can`t move himself)
    // Ask if move player
    // Pick player to move
    // Get available places to move (move by one place)
    // Move player
  }
}

module.exports = PavilionOfTheHeavenlyWinds;
