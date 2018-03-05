class Villager {
  constructor() {
    this.haunted = false;
  }

  isHaunted() {
    return this.haunted;
  }

  setHaunted(haunted) {
    this.haunted = haunted;
  }

  action(socket, board, players, bank) {
    console.log('Abstract Villager action()');
  }

  validateHelp(board, players, bank) {
    return false;
  }
}

module.exports = Villager;
