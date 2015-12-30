/* eslint camelcase:0 */
import assert from 'assert';
import {
  shouldHavePublicQnaId,
  shouldHaveCoreTag,
  shouldNotContainReason,
  shouldContainCoreTags,
  shouldContainEmpty,
  shouldContainSingleCoreTag
} from '../lib/validate';

describe('validate.js', () => {
  it('shouldHaveCoreTag', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'}
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: 'coreTag'
    };
    assert.equal(shouldHaveCoreTag(returnTrue), true);
    assert.equal(shouldHaveCoreTag(returnFalse), false);
  });

  it('shouldHavePublicQnaId', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'}
    };
    const returnFalse_1 = {
      coreTag: 'coreTag'
    };
    const returnFalse_2 = {
      publicQnaId: null,
      coreTag: 'coreTag'
    };
    assert.equal(shouldHavePublicQnaId(returnTrue), true);
    assert.equal(shouldHavePublicQnaId(returnFalse_1), false);
    assert.equal(shouldHavePublicQnaId(returnFalse_2), false);
  });

  it('shouldNotContainReason', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        }
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'tagX', reason: 'cannt find tag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        }
      ]
    };
    assert.equal(shouldNotContainReason(returnTrue), true);
    assert.equal(shouldNotContainReason(returnFalse), false);
  });

  it('shouldContainCoreTags', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 2, name: 'tag2'}},
            {id: null, tag: {id: 6, name: 'tag6'}}
          ]
        }
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'tag1'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 2, name: 'tag2'}},
            {id: null, tag: {id: 6, name: 'tag6'}}
          ]
        }
      ]
    };
    assert.equal(shouldContainCoreTags(returnTrue), true);
    assert.equal(shouldContainCoreTags(returnFalse), false);
  });

  it('shouldContainEmpty', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: null},
            {id: null, tag: null}
          ]
        }
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 2, name: 'tag2'}},
            {id: null, tag: {id: 6, name: 'tag6'}}
          ]
        }
      ]
    };
    assert.equal(shouldContainEmpty(returnTrue), true);
    assert.equal(shouldContainEmpty(returnFalse), false);
  });

  it('shouldContainSingleCoreTag', () => {
    const returnTrue = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 2, name: 'tag2'}},
            {id: null, tag: {id: 6, name: 'tag6'}}
          ]
        },
        {
          number: 3,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}}
          ]
        },
      ]
    };
    const returnFalse = {
      publicQnaId: 1234567,
      coreTag: {id: 1, name: 'coreTag'},
      wrong_answers: [
        {
          number: 1,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 1, name: 'coreTag'}},
            {id: null, tag: {id: 5, name: 'tag5'}}
          ]
        },
        {
          number: 2,
          answer: false,
          wrong_answer_tags: [
            {id: null, tag: {id: 2, name: 'tag2'}},
            {id: null, tag: {id: 6, name: 'tag6'}}
          ]
        }
      ]
    };
    assert.equal(shouldContainSingleCoreTag(returnTrue), true);
    assert.equal(shouldContainSingleCoreTag(returnFalse), false);
  });
});
