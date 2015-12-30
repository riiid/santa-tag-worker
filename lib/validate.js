/* eslint camelcase:0 */
import Rx from 'rx';
import _ from 'lodash';
import error$ from './error';

const reportError = (tagInfo, reason) => {
  const report = Object.assign({}, reason, tagInfo);
  error$.onNext(report);
}

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
    reportError(tagInfo, 'cannot pass shouldHaveCoreTag');
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
    reportError(tagInfo, 'cannot pass shouldNotContainReason');
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
    reportError(tagInfo, 'cannot pass shouldContainCoreTags');
  }
  return result;
};

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
    reportError(tagInfo, 'cannot pass shouldContainEmpty');
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
