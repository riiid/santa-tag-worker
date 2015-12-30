import Rx from 'rx';
import _ from 'lodash';
import error$ from './error';
import P from './progress';
import {getWrongAnswers, getPublicQna}from './api';

const CHAR_NUM = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4
};

const reportError = (info, reason) => {
  const report = Object.assign({}, {reason}, info);
  error$.onNext(report);
}

export const shouldContainTags = data => {
  let {wtag} = data;
  return wtag.length === 3;
};

export const shouldAnswerEmpty = data => {
  let {pqna, wtag} = data;
  let answer = CHAR_NUM[pqna.answer.toLowerCase()];
  let result = _.find(wtag, tag => {
    return Number(tag.number) === Number(answer);
  });
  if (result) {
    reportError({publicQnaId: pqna.id}, 'cannot pass shouldAnswerEmpty');
  }
  return !result;
};

export default tagInfos => {
  let progress = P('Validating...', tagInfos);
  return Rx.Observable.from(tagInfos)
    .map(tagInfo => tagInfo.publicQnaId)
    .concatMap(id => {
      let pqna$ = getPublicQna({ids: id})
        .map(res => res.body.data.entries[0]);
      let wtag$ = getWrongAnswers({public_qna_ids: id})
        .map(res => res.body.data.entries);
      return Rx.Observable.combineLatest(pqna$, wtag$, (pqna, wtag) => {
        return {
          pqna,
          wtag
        };
      });
    })
    .filter(shouldContainTags)
    .filter(shouldAnswerEmpty)
    .tap(() => progress.tick())
    .toArray()
    .concatMap(() => Rx.Observable.return(tagInfos));
};
