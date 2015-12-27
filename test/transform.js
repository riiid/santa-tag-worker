/* eslint max-len:0 camelcase:0 */
import assert from 'assert';
import {
  mapTags,
  containValues,
  buildObject
} from '../lib/transform';

describe('transform.js', () => {
  it('mapTags should return wrong_answer_tag with mapped tag.', () => {
    const tagInfo = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      tags: [
        ['tag1', 'tag5'],
        ['tag2', 'tag6'],
        ['tag3', undefined],
        ['tag4', undefined]
      ]
    };
    const tagList = [
      {name: 'tag1', id: 1}, {name: 'tag2', id: 2}, {name: 'tag3', id: 3},
      {name: 'tag4', id: 4}, {name: 'tag5', id: 5}, {name: 'tag6', id: 6},
      {name: 'coreTag', id: 678}
    ];
    let result = mapTags(tagInfo, tagList);
    assert(result);
    assert.equal(result.wrong_answers.length, 4);
    assert.deepEqual(result.wrong_answers[0], {
      number: 1,
      answer: false,
      wrong_answer_tags: [
        {id: null, tag: {id: 1, name: 'tag1'}},
        {id: null, tag: {id: 5, name: 'tag5'}}
      ]
    });
  });

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
