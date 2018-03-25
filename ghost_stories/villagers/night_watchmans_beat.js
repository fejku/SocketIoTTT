const Villager = require('./villager');

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
    // Check if there are any ghosts or different players
    const isAnyGhost = board.getPlayersBoards().getGhosts().length > 0;
    const isDifferentPlayerAlive = players.getAlivePlayers().length > 1;
    return isAnyGhost || isDifferentPlayerAlive;
  }

  async action(socket, board, players, bank) {
  }
}

module.exports = NightWatchmansBeat;
