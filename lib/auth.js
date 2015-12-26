import GSS from 'google-spreadsheet';
import Rx from 'rx';
import log from './log';
import credential from '../credential';
import {sheetKey} from '../config';

export const authenticate = sheet =>
  Rx.Observable.fromNodeCallback(sheet.useServiceAccountAuth);

export const getSheetInfo = sheet =>
  Rx.Observable.fromNodeCallback(sheet.getInfo);

export default () => {
  let Sheet = new GSS(sheetKey);
  let auth$ = authenticate(Sheet);
  let info$ = getSheetInfo(Sheet);
  return auth$(credential)
    .tap(() => {
      log.info(`Service Account   : ${credential.client_email}`);
    })
    .flatMap(() => info$())
    .tap(sheetInfo => {
      log.info(`Target Sheet      : ${sheetInfo.title}`);
      log.info(`Last sheet update : ${sheetInfo.updated}`);
    });
};
