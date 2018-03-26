class Ghost {
  constructor(name, color, resistance) {
    this.name = name;
    this.color = color;
    this.resistance = resistance;

    this.hauntingFigurePosition = 0;

    this.taoDiceHaveEffect = true;
    this.wuFeng = false;
  }

  immediateEffect() {
    //
    console.log('immediateEffect abstract');
  }

  yinPhaseEffect(socket, board, players, ghostPosition, bank) { /* eslint-disable-line no-unused-vars */
    //
    console.log('yinPhaseEffect abstract');
  }

  afterWinningEffect() {
    //
    console.log('afterWinningEffect abstract');
    // throw new Error('afterWinningEffect is Abstract');
  }

  // Effects
  haunter(ghostPosition, villagers) {
    this.progressHauntingFigure(ghostPosition, villagers);
  }

  taoDiceHaveNoEffect() {
    this.taoDiceHaveEffect = false;
  }

  /**
   * Return ghost color
   *
   * @returns {string} Ghost color
   * @memberof Ghost
   */
  getColor() {
    return this.color.key;
  }

  getResistance() {
    return this.resistance;
  }

  getHauntingFigurePosition() {
    return this.hauntingFigurePosition;
  }

  isWuFeng() {
    return this.wuFeng;
  }

  moveHauntingFigureBackward() {
    this.hauntingFigurePosition = 0;
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
}

module.exports = Ghost;
