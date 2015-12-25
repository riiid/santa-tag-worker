import Rx from 'rx';
import _ from 'lodash';

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

export default rows => {
  return Rx.Observable.return(rows)
    .filter(containValues)
    .map(buildObject);
};
