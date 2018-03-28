class Ghost {
  constructor(name, color, resistance) {
    this.name = name;
    this.color = color;
    this.resistance = resistance;

    this.taoDiceHaveEffect = true;
    this.wuFeng = false;
  }

  immediateEffect(socket, board, players, bank, circleOfPrayer) { /* eslint-disable-line no-unused-vars */
    //
    console.log('immediateEffect abstract');
  }

  async yinPhaseEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    //
    console.log('yinPhaseEffect abstract');
  }

  async afterWinningEffect(socket, board, players, bank, ghostPosition) { /* eslint-disable-line no-unused-vars */
    //
    console.log('afterWinningEffect abstract');
    // throw new Error('afterWinningEffect is Abstract');
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

  /**
   * Return ghost resistance
   *
   * @returns {number} Ghost resistance
   * @memberof Ghost
   */
  getResistance() {
    return this.resistance;
  }

  isWuFeng() {
    return this.wuFeng;
  }
}

module.exports = Ghost;
