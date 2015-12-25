/* eslint camelcase:0 */
import Rx from 'rx';
import _ from 'lodash';
import {
  getTags,
  getWrongAnswers,
  updatePublicQna,
  createWrongAnswers,
  getWrongAnswerTags,
  updateWrongAnswerTags,
  deleteWrongAnswerTags,
  createWrongAnswerTags
}from './api';

let pushError$ = new Rx.ReplaySubject();
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
        pushError$.onNext(report);
      }
      return tagInfo;
    });
};

export const updateWrongAnswerFromResponse = (res, tagInfo) => {
  let wrong_answers = _.map(res, r => {
    let wrong_answer = _.find(tagInfo.wrong_answers, w => {
      return Number(w.number) === Number(r.number);
    });
    let wrong_answer_tags = _.map(wrong_answer.wrong_answer_tags, (t, i) => {
      let tag = r.wrong_answer_tags[i];
      return Object.assign({}, t, {id: !!tag ? tag.id : null});
    });
    return Object.assign({}, wrong_answer, {id: r.id, wrong_answer_tags});
  });
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
      .map(res => res.body.data)
    })
    .concatAll()
    .toArray()
    .map(res => updateWrongAnswerFromResponse(res, tagInfo));
};

const updateWrongAnswerIfNeeded = tagInfo => {
  return wrongAnswer$(tagInfo.publicQnaId)
    .concatMap(res => {
      if (res.length === 0) {
        return createWrongAnswerWith(tagInfo);
      } else {
        let updated = updateWrongAnswerFromResponse(res, tagInfo);
        return Rx.Observable.return(updated);
      }
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
    return deleteWrongAnswerTags({ id: wrong_answer_tag.id })
    .map(() => null);
  } else if (!wrong_answer_tag.id && wrong_answer_tag.tag) {
    return createWrongAnswerTags({
      tag_id: wrong_answer_tag.tag.id,
      wrong_answer_id
    })
    .map(res => {
      let id = res.body.data.id;
      return Object.assign({}, wrong_answer_tag, {id});
    })
  } else {
    return Rx.Observable.return(null);
  }
};

const updateWrongAnswerTagIfNeeded = tagInfo => {
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
    .map(wrong_answers => Object.assign({}, tagInfo, {wrong_answers}))
};

export default tagInfo => {
  return Rx.Observable.return(tagInfo)
    .combineLatest(tags$, mapTags)
    .concatMap(updateCoreTag)
    .concatMap(updateWrongAnswerIfNeeded)
    .concatMap(updateWrongAnswerTagIfNeeded)
};
