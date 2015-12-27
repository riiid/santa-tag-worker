/* eslint camelcase:0 */
import Rx from 'rx';
import _ from 'lodash';
import {getTags}from './api';

let tags$ = new Rx.ReplaySubject(1);

getTags()
  .map(res => res.body.data.entries)
  .subscribe(
    res => tags$.onNext(res),
    err => {
      throw err;
    },
    () => tags$.onCompleted()
  );

export const containValues = items =>
  !_.every(items, item => _.every(item.values, v => v === undefined));

export const buildObject = items => {
  let publicQnaId = Number(items[0].values[0]);
  let coreTag = items[0].values[3];
  let sliced = items.slice(0, 4);
  let tags1 = _.map(sliced, item => item.values[4]);
  let tags2 = _.map(sliced, item => item.values[5]);
  let tags = _.zip(tags1, tags2);
  return {
    publicQnaId,
    coreTag,
    tags
  };
};

export const mapTags = (tagInfo, tagList) => {
  let {tags, coreTag} = tagInfo;
  let _coreTag = _.find(tagList, t => t.name === coreTag);
  let wrong_answers = _.map(tags, (tagsOnNumber, i) => {
    let number = i + 1;
    let answer = _.every(tagsOnNumber, _.isUndefined);
    let wrong_answer_tags = _.chain(tagsOnNumber)
      .map(tag => {
        const _default = {id: null, tag: null};
        if (!tag) {
          return _default;
        }
        let found = _.find(tagList, t => t.name === tag);
        return Object.assign(
            _default,
            found ? {tag: found} : {reason: `cannot find tag with name ${tag}`}
          );
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

export default rows => {
  return Rx.Observable.return(rows)
    .filter(containValues)
    .map(buildObject)
    .combineLatest(tags$, mapTags);
};
