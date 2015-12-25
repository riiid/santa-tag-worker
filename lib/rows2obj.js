import Rx from 'rx';
import _ from 'lodash';
import d3 from 'd3';
import {sheetTitles} from '../config';

export const isTargetSheet = worksheet =>
  _.any(sheetTitles, title => title === worksheet.title);

export const getCells$ = (ws, opt) => {
  const _opt = opt || {
    'min-row': 1,
    'max-row': ws.rowCount,
    'min-col': 1,
    'max-col': 6,
    'return-empty': true
  };
  return Rx.Observable.fromNodeCallback(ws.getCells)(_opt);
};

export const groupByRow$ = rows => {
  let grouped = d3.nest()
    .key(d => d.row)
    .rollup(values => _.map(values, v => v.value))
    .entries(rows);
  return Rx.Observable.from(_.drop(grouped));
};

export default sheetInfo => {
  return Rx.Observable.from(sheetInfo.worksheets)
    .filter(isTargetSheet)
    .concatMap(sheet => getCells$(sheet))
    .concatMap(groupByRow$);
};
