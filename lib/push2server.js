/* eslint camelcase:0 */
import Rx from 'rx';
import _ from 'lodash';
import error$ from './error';
import {
  getTags,
  getWrongAnswers,
  updatePublicQna,
  createWrongAnswers,
  updateWrongAnswerTags,
  deleteWrongAnswerTags,
  createWrongAnswerTags
}from './api';

let tags$ = new Rx.ReplaySubject(1);
let wrongAnswer$ = public_qna_id =>
  getWrongAnswers({public_qna_ids: public_qna_id})
  .map(res => res.body.data.entries);

getTags()
  .map(res => res.body.data.entries)
  .subscribe(
    res => tags$.onNext(res),
    err => {
      throw err;
    },
    () => tags$.onCompleted()
  );

export const mapTags = (tagInfo, tagList) => {
  let {tags, coreTag} = tagInfo;
  let _coreTag = _.find(tagList, t => t.name === coreTag);
  if (!_coreTag) {
    let report = Object.assign(
        {},
        {reason: `cannot find core_tag_id with name = ${coreTag}`},
        tagInfo
      );
    error$.onNext(report);
    return null;
  }
  let wrong_answers = _.map(tags, (tagsOnNumber, i) => {
    let number = i + 1;
    let answer = _.every(tagsOnNumber, _.isUndefined);
    let wrong_answer_tags = _.chain(tagsOnNumber)
      .map(tag => {
        return {
          id: null,
          tag: _.find(tagList, t => t.name === tag)
        };
      })
      .value();
    return {
      number,
      answer,
      wrong_answer_tags
    };
  });
  return Object.assign({}, tagInfo, {wrong_answers, coreTag: _coreTag});
};

const updateCoreTag = tagInfo => {
  if (!tagInfo) {
    return Rx.Observable.return(tagInfo);
  }
  const opt = {
    id: tagInfo.publicQnaId,
    core_tag_id: tagInfo.coreTag.id
  };
  return updatePublicQna(opt)
    .map(res => res.body.data)
    .map(res => {
      if (res.status === 'failure') {
        let report = Object.assign(
            {},
            {reason: 'cannot update core_tag_id', message: res.message},
            tagInfo
          );
        error$.onNext(report);
        return null;
      }
      return tagInfo;
    });
};

export const updateWrongAnswerTagsFrom = (response, wrong_answer) => {
  return _.reduce(response.wrong_answer_tags, (wrong_answer_tags, tag, i) => {
    return [
      ...wrong_answer_tags.slice(0, i),
      Object.assign({}, wrong_answer_tags[i], {id: tag.id}),
      ...wrong_answer_tags.slice(i + 1)
    ];
  }, wrong_answer.wrong_answer_tags);
};

export const updateWrongAnswerFrom = (responses, tagInfo) => {
  let wrong_answers = _.reduce(responses, (wrong_answers, response) => {
    let idx = _.findIndex(wrong_answers, w => {
      return Number(w.number) === Number(response.number);
    });
    let wrong_answer_tags = updateWrongAnswerTagsFrom(response, wrong_answers[idx]);
    return [
      ...wrong_answers.slice(0, idx),
      Object.assign({}, wrong_answers[idx], {id: response.id, wrong_answer_tags}),
      ...wrong_answers.slice(idx + 1)
    ];
  }, tagInfo.wrong_answers);

  return Object.assign({}, tagInfo, {wrong_answers});
};

const createWrongAnswerWith = tagInfo => {
  return Rx.Observable.from(tagInfo.wrong_answers)
    .filter(wrong_answer => !wrong_answer.answer)
    .map(wrong_answer => {
      return createWrongAnswers({
        public_qna_id: tagInfo.publicQnaId,
        number: wrong_answer.number
      })
      .map(res => res.body.data);
    })
    .concatAll()
    .toArray()
    .map(res => updateWrongAnswerFrom(res, tagInfo));
};

const updateWrongAnswerIfNeeded = tagInfo => {
  if (!tagInfo) {
    return Rx.Observable.return(tagInfo);
  }
  return wrongAnswer$(tagInfo.publicQnaId)
    .concatMap(res => {
      if (res.length === 0) {
        return createWrongAnswerWith(tagInfo);
      }
      let updated = updateWrongAnswerFrom(res, tagInfo);
      return Rx.Observable.return(updated);
    });
};

const crudWrongAnswerTag = (wrong_answer_id, wrong_answer_tag) => {
  if (wrong_answer_tag.id && wrong_answer_tag.tag) {
    return updateWrongAnswerTags({
      id: wrong_answer_tag.id,
      tag_id: wrong_answer_tag.tag.id,
      wrong_answer_id
    })
    .map(() => wrong_answer_tag);
  } else if (wrong_answer_tag.id && !wrong_answer_tag.tag) {
    return deleteWrongAnswerTags({id: wrong_answer_tag.id})
    .map(() => null);
  } else if (!wrong_answer_tag.id && wrong_answer_tag.tag) {
    return createWrongAnswerTags({
      tag_id: wrong_answer_tag.tag.id,
      wrong_answer_id
    })
    .map(res => {
      let id = res.body.data.id;
      return Object.assign({}, wrong_answer_tag, {id});
    });
  }
  return Rx.Observable.return(null);
};

const updateWrongAnswerTagIfNeeded = tagInfo => {
  if (!tagInfo) {
    return Rx.Observable.return(tagInfo);
  }
  return Rx.Observable.from(tagInfo.wrong_answers)
    .concatMap(wrong_answer => {
      return Rx.Observable.from(wrong_answer.wrong_answer_tags)
        .concatMap(wrong_answer_tag =>
          crudWrongAnswerTag(wrong_answer.id, wrong_answer_tag)
        )
        .toArray()
        .map(wrong_answer_tags =>
          Object.assign({}, wrong_answer, {wrong_answer_tags})
        );
    })
    .toArray()
    .map(wrong_answers => Object.assign({}, tagInfo, {wrong_answers}));
};

export default tagInfos => {
  return Rx.Observable.from(tagInfos)
    .combineLatest(tags$, mapTags)
    .concatMap(updateCoreTag)
    .concatMap(updateWrongAnswerIfNeeded)
    .concatMap(updateWrongAnswerTagIfNeeded);
};
