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

  yinPhaseEffect() {
    //
    console.log('yinPhaseEffect abstract');
  }

  afterWinningEffect() {
    //
    console.log('afterWinningEffect abstract');
    // throw new Error('afterWinningEffect is Abstract');
  }

  // Effects
  haunter() {

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

  moveHauntingFigure() {
    if (this.hauntingFigurePosition === 1) {
      // TODO: Haunting tile, here??? or return bool isHaunt and calling function haunt???
      this.hauntingFigurePosition = 0;
    } else {
      this.hauntingFigurePosition++;
    }
  }

  moveHauntingFigureBackward() {
    this.hauntingFigurePosition = 0;
  }
}

module.exports = Ghost;
