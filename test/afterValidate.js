/* eslint camelcase:0 */
import assert from 'assert';
import {
  shouldContainTags,
  shouldAnswerEmpty
} from '../lib/afterValidate';

describe('afterValidate.js', () => {
  it('shouldContainTags', () => {
    const returnTrue = {
      pqna: {
      },
      wtag: [{}, {}, {}]
    };
    const returnFalse = {
      pqna: {
      },
      wtag: []
    };
    assert.equal(shouldContainTags(returnTrue), true);
    assert.equal(shouldContainTags(returnFalse), false);
  });

  it('shouldAnswerEmpty', () => {
    const returnTrue = {
      pqna: {
        answer: 'C'
      },
      wtag: [{number: '1'}, {number: '2'}, {number: '4'}]
    };
    const returnFalse = {
      pqna: {
        answer: 'C'
      },
      wtag: [{number: '1'}, {number: '2'}, {number: '3'}]
    };
    assert.equal(shouldAnswerEmpty(returnTrue), true);
    assert.equal(shouldAnswerEmpty(returnFalse), false);
  });
});
