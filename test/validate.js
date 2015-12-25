import assert from 'assert';
import {
  shouldContainCoreTags,
  shouldContainEmpty,
  malformed$
} from '../lib/validate';

describe('validate.js', () => {
  it('shouldContainCoreTags', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', 'tag5'],
        ['coreTag', 'tag6'],
        ['tag3', undefined],
        ['tag4', undefined]
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', undefined],
        ['tag2', undefined],
        ['tag3', undefined],
        ['tag4', undefined]
      ]
    };
    assert.equal(shouldContainCoreTags(returnTrue), true);
    assert.equal(shouldContainCoreTags(returnFalse), false);
  });

  it('shouldContainEmpty', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', 'tag5'],
        ['tag2', 'tag6'],
        [undefined, undefined],
        ['tag4', undefined]
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', 'tag5'],
        ['tag2', 'tag6'],
        ['tag4', undefined],
        ['tag4', undefined]
      ]
    };
    assert.equal(shouldContainEmpty(returnTrue), true);
    assert.equal(shouldContainEmpty(returnFalse), false);
  });

  it('malformed$ should propagate errored tagInfo', done => {
    malformed$.onCompleted();
    malformed$
      .toArray()
      .subscribe(
        res => {
          assert(res);
          assert.equal(res.length, 2);
          assert.deepEqual(res[0], {
            reason: 'shouldContainCoreTags',
            publicQnaId: 1234567,
            coreTag: 'coreTag',
            tags: [
              ['tag1', undefined],
              ['tag2', undefined],
              ['tag3', undefined],
              ['tag4', undefined]
            ]
          });
          assert.deepEqual(res[1], {
            reason: 'shouldContainEmpty',
            publicQnaId: 1234567,
            coreTag: 'coreTag',
            tags: [
              ['tag1', 'tag5'],
              ['tag2', 'tag6'],
              ['tag4', undefined],
              ['tag4', undefined]
            ]
          });
        },
        err => {
          throw err;
        },
        () => done()
      );
  });
});

