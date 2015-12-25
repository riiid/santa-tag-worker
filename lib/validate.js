import Rx from 'rx';
import _ from 'lodash';

export let malformed$ = new Rx.ReplaySubject();

export const shouldContainCoreTags = tagInfo => {
  let {coreTag, tags} = tagInfo;
  let result = _.chain(tags)
    .flatten()
    .any(tag => tag === coreTag)
    .value();
  if (!result) {
    let report = Object.assign({}, {reason: 'shouldContainCoreTags'}, tagInfo);
    malformed$.onNext(report);
  }
  return result;
};

export const shouldContainEmpty = tagInfo => {
  let {tags} = tagInfo;
  let result = _.any(tags, tag => _.every(tag, _.isUndefined));
  if (!result) {
    let report = Object.assign({}, {reason: 'shouldContainEmpty'}, tagInfo);
    malformed$.onNext(report);
  }
  return result;
};

export default tagInfo => {
  return Rx.Observable.return(tagInfo)
    .filter(shouldContainCoreTags)
    .filter(shouldContainEmpty)
    .tap(() => malformed$.onCompleted());
};
