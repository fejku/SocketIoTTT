const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');

// Discard any ghost in play, without activating its ability or reward. Lose 1 Qi point.
class SorcererHut extends Villager {
  constructor() {
    super();
    this.name = 'Sorcerer Hut';
  }

  validateHelp(board, players, bank) { // eslint-disable-line no-unused-vars
    if (!super.validateHelp()) {
      return false;
    }
    // If there is any ghost in play (beside Wu Feng)
    return board.getAllPlayersBoards().some(playerBoard => playerBoard.isAnyGhostOnBoard(true));
  }

  getAvailableGhosts(board) {
    const result = [];
    board.getAllPlayersBoards().forEach((playerBoard) => {
      result.push(playerBoard.getOccupiedFields(true));
    });
    return result;
  }

  validatePickedGhost(availableGhosts, pickedGhost) {
    return availableGhosts
      .find(ghost => ghost.color === pickedGhost.color
        && ghost.fields.indexOf(pickedGhost.field) !== -1) !== undefined;
  }

  pickGhost(socket, availableGhosts) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost sorcerer hut pick ghost', availableGhosts, (pickedGhost) => {
        if (this.validatePickedGhost(availableGhosts, JSON.parse(pickedGhost))) {
          resolve(JSON.parse(pickedGhost));
        } else {
          reject();
        }
      });
    });
  }

  removeGhostFromBoard(socket, board, pickedGhost) {
    board.getPlayerBoardByColor(pickedGhost.color).setField(pickedGhost.field, null);
    // Update UI
    const boardId = board.getPlayersBoards().getPlayerBoardIdByColor(pickedGhost.color);
    socket.emit('ghost sorcerer hut remove ghost from board', boardId, pickedGhost.field);
  }

  async action(socket, board, players, bank) {
    // Get available Ghosts (skip Wu Feng)
    const availableGhosts = this.getAvailableGhosts(board);
    console.log('availableGhosts: ', availableGhosts);
    // Pick ghost
    const pickedGhost = await this.pickGhost(socket, availableGhosts);
    console.log('pickedGhost: ', pickedGhost);
    // Remove ghost from board (don't trigger afterWinningEffect)
    this.removeGhostFromBoard(socket, board, pickedGhost);
    // Player lose Qi
    players.getActualPlayer().loseQi();
    // Update bank
    bank.updateTokens(socket, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
  }
}

module.exports = SorcererHut;
