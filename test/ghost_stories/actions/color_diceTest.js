const { assert } = require('chai');
const { throwDices } = require('../../../ghost_stories/actions/color_dice');

describe('Color dice', () => {
  it('qwe', () => {
    assert.equal(throwDices(0), null);
  });
});

