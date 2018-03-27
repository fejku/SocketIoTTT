const Ghost = require('./ghost');

class Haunter extends Ghost {
  constructor(name, color, resistance) {
    super(name, color, resistance);

    this.hauntingFigurePosition = 0;
  }

  getHauntingFigurePosition() {
    return this.hauntingFigurePosition;
  }

  yinPhaseEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    const villagers = board.getVillagers();
    this.progressHauntingFigure(ghostPosition, villagers);
    // Set ghost haunting figures
    socket.emit('ghost refresh player boards', this.board.getAllPlayersBoards());
    // Set haunted tiles
    socket.emit('ghost refresh villagers', this.board.getAllVillagers());
  }

  /**
   * Progress haunting figure
   *
   * @memberof Ghost
   */
  progressHauntingFigure(ghostPosition, villagers) {
    this.hauntingFigurePosition++;

    if (this.hauntingFigurePosition === 2) {
      this.hauntTile(ghostPosition, villagers);
      this.hauntingFigurePosition = 0;
    }
  }

  hauntTile(ghostPosition, villagers) {
    const tilePositionToHaunt = this.getVillagerToHaunt(ghostPosition, villagers);
    villagers.getVillager(tilePositionToHaunt).setHaunted(true);
  }

  getVillagerToHaunt(ghostPosition, villagers, step = 0) {
    let villagerPosition = -1;

    switch (ghostPosition.boardIndex) {
      case 0:
        villagerPosition = ghostPosition.fieldIndex + (3 * step);
        break;
      case 1:
        villagerPosition = (3 * ghostPosition.fieldIndex) + (2 - step);
        break;
      case 2:
        villagerPosition = (6 + ghostPosition.fieldIndex) - (3 * step);
        break;
      case 3:
        villagerPosition = (3 * ghostPosition.fieldIndex) + step;
        break;
      default:
        break;
    }

    if (villagers.getVillager(villagerPosition).isHaunted()) {
      this.getVillagerToHaunt(ghostPosition, villagers, ++step); // eslint-disable-line no-param-reassign
    }

    return villagerPosition;
  }

  moveHauntingFigureBackward() {
    this.hauntingFigurePosition = 0;
  }
}

module.exports = Haunter;
