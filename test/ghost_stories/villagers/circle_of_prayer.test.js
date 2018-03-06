const { assert } = require('chai');

const CircleOfPrayer = require('../../../ghost_stories/villagers/circle_of_prayer');

const circleOfPrayer = new CircleOfPrayer();

describe('Circle of prayer', () => {
  // initTaoTokens
  // action

  describe('validateHelp', () => {
    it('should be always available', () => {
      assert(circleOfPrayer.validateHelp(), true);
    });
  });

  describe('removeTaoTokenFromTile', () => {
    it('should return array with 0 tao tokens');
  });
});
