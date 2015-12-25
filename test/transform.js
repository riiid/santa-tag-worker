/* eslint max-len:0 */
import assert from 'assert';
import {
  containValues,
  buildObject
} from '../lib/transform';

describe('transform.js', () => {
  it('containValues should return false with given rows', () => {
    const rows = [
      {key: 'row1', values: [undefined, undefined, undefined, undefined, undefined, undefined]},
      {key: 'row2', values: [undefined, undefined, undefined, undefined, undefined, undefined]},
      {key: 'row3', values: [undefined, undefined, undefined, undefined, undefined, undefined]},
      {key: 'row4', values: [undefined, undefined, undefined, undefined, undefined, undefined]},
      {key: 'row5', values: [undefined, undefined, undefined, undefined, undefined, undefined]}
    ];
    assert.equal(containValues(rows), false);
  });

  it('buildObject should return object with given rows', () => {
    const rows = [
      {key: 'row1', values: ['1234567', undefined, undefined, 'coreTag', 'tag1', 'tag5']},
      {key: 'row2', values: [undefined, undefined, undefined, undefined, 'tag2', 'tag6']},
      {key: 'row3', values: [undefined, undefined, undefined, undefined, 'tag3', undefined]},
      {key: 'row4', values: [undefined, undefined, undefined, undefined, 'tag4', undefined]},
      {key: 'row5', values: [undefined, undefined, undefined, undefined, 'empty', undefined]}
    ];

    let obj = buildObject(rows);

    assert.deepEqual(obj, {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', 'tag5'],
        ['tag2', 'tag6'],
        ['tag3', undefined],
        ['tag4', undefined]
      ]
    });
  });
});
