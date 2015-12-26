import Rx from 'rx';
import _ from 'lodash';
import d3 from 'd3';
import log from './log';
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
  return Rx.Observable.fromNodeCallback(ws.getCells)(_opt)
    .tap(cells => {
      log.info(ws.title);
      log.info(`   Cells : ${cells.length}`);
    });
};

export const groupByRow$ = cells => {
  let grouped = d3.nest()
    .key(d => d.row)
    .rollup(values => _.map(values, v => v.value))
    .entries(cells);
  let omitHeader = _.drop(grouped);
  log.info(`   Rows  : ${omitHeader.length}`);
  return Rx.Observable.from(omitHeader);
};

export default sheetInfo => {
  return Rx.Observable.from(sheetInfo.worksheets)
    .filter(isTargetSheet)
    .concatMap(sheet => getCells$(sheet))
    .concatMap(groupByRow$);
};
