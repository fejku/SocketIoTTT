const Villager = require('./villager');

// Move a ghost of your choice to any free
// space (even if occupied by a Buddha
// figure), then move a different Taoist to a
// Village tile.
// When the ghost moves, all his properties
// go with him. He takes his Haunting
// figure in the same relative position, his
// marker for deactivation of power, his
// enfeeblement mantra, etc.
class PavilionOfTheHeavenlyWinds extends Villager {
  constructor() {
    super();
    this.name = 'Pavilion of the Heavenly Winds';
  }
}

module.exports = PavilionOfTheHeavenlyWinds;
