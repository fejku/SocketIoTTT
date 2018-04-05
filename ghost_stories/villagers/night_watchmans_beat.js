const Villager = require('./villager');

const UI = require('../utils/UI');
const questions = require('../utils/questionsUI');

// Move all the Haunting figures on one board backward on the card.
class NightWatchmansBeat extends Villager {
  constructor() {
    super();
    this.name = 'Night Watchman’s Beat';
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // Check if there are any ghosts and haunting figure position is not 0
    const ghosts = board.getPlayersBoards().getGhosts();
    const isAnyGhost = ghosts.length > 0;
    const isHauntingFigureToGoBack = ghosts.findIndex(ghost => ghost.ghost.getHauntingFigurePosition() > 0) !== -1;

    return isAnyGhost || isHauntingFigureToGoBack;
  }

  async action(socket, board, players, bank) { /* eslint-disable-line no-unused-vars */
    const ghosts = board.getPlayersBoards().getGhosts();
    // Get available boards
    let availablePlayerBoardIndexes = ghosts
      .filter(ghost => ghost.ghost.getHauntingFigurePosition() > 0)
      .map(ghost => ghost.playerBoardIndex);
    // Remove duplicates (more ghosts on one player board)
    availablePlayerBoardIndexes = [...new Set(availablePlayerBoardIndexes)];
    // Pick player board
    const pickedPlayerBoard = await questions.pickPlayerBoard(socket, availablePlayerBoardIndexes);
    // Move haunting figures backward
    ghosts.filter(ghost => (ghost.playerBoardIndex === pickedPlayerBoard) && (ghost.ghost.getHauntingFigurePosition() > 0))
      .forEach((ghost) => {
        ghost.ghost.moveHauntingFigureBackward();
      });
    // Refresh UI
    UI.refreshPlayersBoards(socket, board.getAllPlayersBoards());
  }
}

module.exports = NightWatchmansBeat;
