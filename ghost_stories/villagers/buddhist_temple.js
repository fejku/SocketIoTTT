const Villager = require('./villager');

// Take a Buddha figure, which you can place next turn at the end of the Yang phase.
class BuddhistTemple extends Villager {
  constructor() {
    super();
    this.name = 'Buddhist Temple';
    this.buddhaFigure = 2;
  }

  addBuddhaFigure(amount = 1) {
    this.buddhaFigure += amount;
  }

  refreshBuddhaFiguresUI(socket, playersBoards) {
    socket.emit('ghost update buddha figures', this.buddhaFigure, playersBoards);
  }

  validateHelp(board, players, bank) { /* eslint-disable-line no-unused-vars */
    if (!super.validateHelp()) {
      return false;
    }
    // Check if there is free buddha figure
    return this.buddhaFigure > 0;
  }

  async action(socket, board, players, bank) { /* eslint-disable-line no-unused-vars */
    // Give a player buddha figure
    players.getActualPlayer().gainBuddhaFigure();
    // Remove figure from tile
    this.buddhaFigure--;
    this.refreshBuddhaFiguresUI(socket, board.getAllPlayersBoards());
  }
}

module.exports = BuddhistTemple;
