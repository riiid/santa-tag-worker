/* eslint camelcase:0 */
import Rx from 'rx';
import _ from 'lodash';
import error$ from './error';

export const shouldHavePublicQnaId = tagInfo => {
  const {publicQnaId} = tagInfo;
  return Boolean(publicQnaId);
};

export const shouldHaveCoreTag = tagInfo => {
  const {coreTag} = tagInfo;
  const result = Boolean(coreTag) &&
    _.has(coreTag, 'name') &&
    _.has(coreTag, 'id');
  if (!result) {
    const report = Object.assign(
        {},
        {reason: `cannot pass shouldHaveCoreTag`},
        tagInfo
      );
    error$.onNext(report);
  }
  return result;
};

export const shouldNotContainReason = tagInfo => {
  const containReason = _.chain(tagInfo.wrong_answers)
    .pluck('wrong_answer_tags')
    .flatten()
    .pluck('tag')
    .flatten()
    .pluck('reason')
    .filter()
    .value().length > 0;
  if (containReason) {
    const report = Object.assign(
        {},
        {reason: 'cannot pass shouldNotContainReason'},
        tagInfo
      );
    error$.onNext(report);
  }
  return !containReason;
};

export const shouldContainCoreTags = tagInfo => {
  let {coreTag, wrong_answers} = tagInfo;
  let result = _.chain(wrong_answers)
    .pluck('wrong_answer_tags')
    .flatten()
    .filter(item => Boolean(item.tag))
    .any(item => item.tag.name === coreTag.name)
    .value();
  if (!result) {
    let report = Object.assign(
        {},
        {reason: 'cannot pass shouldContainCoreTags'},
        tagInfo);
    error$.onNext(report);
  }
  return result;
};

export const shouldContainEmpty = tagInfo => {
  let {wrong_answers} = tagInfo;
  let result = _.chain(wrong_answers)
    .pluck('wrong_answer_tags')
    .any(item => _.every(item, i => !i.tag))
    .value();
  if (!result) {
    let report = Object.assign({}, {reason: 'shouldContainEmpty'}, tagInfo);
    error$.onNext(report);
  }
  return result;
};

export default tagInfo => {
  return Rx.Observable.return(tagInfo)
    .filter(shouldHavePublicQnaId)
    .filter(shouldHaveCoreTag)
    .filter(shouldNotContainReason)
    .filter(shouldContainCoreTags)
    .filter(shouldContainEmpty);
};
