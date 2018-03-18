const Villager = require('./villager');

// Move all the Haunting figures on one
// board backward on the card.
class NightWatchmansBeat extends Villager {
  constructor() {
    super();
    this.name = 'Night Watchman’s Beat';
  }
}

module.exports = NightWatchmansBeat;
