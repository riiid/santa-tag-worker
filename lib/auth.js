import GSS from 'google-spreadsheet';
import Rx from 'rx';
import debug from 'debug';

const info = debug('info');

export const authenticate = sheet =>
  Rx.Observable.fromNodeCallback(sheet.useServiceAccountAuth);

export const getSheetInfo = sheet =>
  Rx.Observable.fromNodeCallback(sheet.getInfo);

export default (credential, sheetKey) => {
  let Sheet = new GSS(sheetKey);
  let auth$ = authenticate(Sheet);
  let info$ = getSheetInfo(Sheet);
  return auth$(credential)
    .tap(() => {
      info(`Service Account   : ${credential.client_email}`);
    })
    .flatMap(() => info$())
    .tap(sheetInfo => {
      info(`Processing        : ${sheetInfo.title}`);
      info(`Last sheet update : ${sheetInfo.updated}`);
    });
};
