const rewire = require('rewire');
const { assert } = require('chai');
const { SixColors } = require('../../../ghost_stories/enums/color');

const ColorDice = rewire('../../../ghost_stories/actions/color_dice');

/* eslint-disable no-underscore-dangle */
const getColorFromResult = ColorDice.__get__('getColorFromResult');
/* eslint-enable no-underscore-dangle */

describe('Color dice', () => {
  describe('getColorFromResult', () => {
    it('should return null with wrong parameter', () => {
      assert.equal(getColorFromResult(6), null);
    });

    it('should return yellow color', () => {
      assert.equal(getColorFromResult(0), SixColors.YELLOW.key);
    });

    it('should return white color', () => {
      assert.equal(getColorFromResult(5), SixColors.WHITE.key);
    });
  });

  describe('throwDices', () => {
    it('should return sum equal to dice number');
  });
});

