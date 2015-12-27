/* eslint camelcase:0 */
import assert from 'assert';
import {
  updateWrongAnswerFrom,
  updateWrongAnswerTagsFrom
} from '../lib/push2server';

describe('push2server.js', () => {
  it('updateWrongAnswerTagsFrom should return id updated object', () => {
    const response = {
      id: 40000,
      number: 1,
      wrong_answer_tags: [
        {id: 30000, tag: {id: 1, name: 'tag1'}},
        {id: 30001, tag: {id: 5, name: 'tag5'}}
      ]
    };
    const wrong_answer = {
      id: null,
      number: 1,
      wrong_answer_tags: [
        {id: null, tag: {id: null, name: 'tag1'}},
        {id: null, tag: {id: null, name: 'tag5'}}
      ]
    };
    let result = updateWrongAnswerTagsFrom(response, wrong_answer);
    assert(result);
    assert.deepEqual(result, [
      {id: 30000, tag: {id: null, name: 'tag1'}},
      {id: 30001, tag: {id: null, name: 'tag5'}}
    ]);
  });

  it('updateWrongAnswerFrom should return id upated object', () => {
    const response = [
      {
        id: 40000,
        number: 1,
        wrong_answer_tags: [
          {id: 30000, tag: {id: 1, name: 'tag1'}},
          {id: 30001, tag: {id: 5, name: 'tag5'}}
        ]
      },
      {
        id: 40001,
        number: 2,
        wrong_answer_tags: [
          {id: 30002, tag: {id: 1, name: 'tag1'}},
          {id: 30003, tag: {id: 5, name: 'tag5'}}
        ]
      },
      {
        id: 40002,
        number: 3,
        wrong_answer_tags: [
          {id: 30004, tag: {id: 1, name: 'tag1'}},
          {id: 30005, tag: {id: 5, name: 'tag5'}}
        ]
      }
    ];

    const tagInfo = {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      wrong_answers: [
        {
          id: null,
          number: 1,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'tag1'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          id: null,
          number: 2,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'tag1'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          id: null,
          number: 3,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'tag1'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        }
      ]
    };

    let result = updateWrongAnswerFrom(response, tagInfo);

    assert(result);
    assert.equal(result.wrong_answers[0].id, 40000);
    assert.equal(result.wrong_answers[0].wrong_answer_tags[0].id, 30000);
    assert.deepEqual(result, {
      publicQnaId: 1234567,
      coreTag: 'coreTag',
      wrong_answers: [
        {
          id: 40000,
          number: 1,
          wrong_answer_tags: [
            {id: 30000, tag: {id: 1, name: 'tag1'}},
            {id: 30001, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          id: 40001,
          number: 2,
          wrong_answer_tags: [
            {id: 30002, tag: {id: 1, name: 'tag1'}},
            {id: 30003, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          id: 40002,
          number: 3,
          wrong_answer_tags: [
            {id: 30004, tag: {id: 1, name: 'tag1'}},
            {id: 30005, tag: {id: 5, name: 'tag5'}}
          ]
        }
      ]
    });
  });
});

