import Rx from 'rx';
import P from 'progress';
import _ from 'lodash';
import log from './lib/log';
import auth$ from './lib/auth';
import rows2obj$ from './lib/rows2obj';
import transform$ from './lib/transform';
import validate$ from './lib/validate';
import push2server$ from './lib/push2server';
import error$ from './lib/error'
import {EOL} from 'os';

import credential from './credential';
import {sheetKey} from './config';

let progress;

auth$(credential, sheetKey)
  .concatMap(rows2obj$)
  .bufferWithCount(5)
  .concatMap(transform$)
  .concatMap(validate$)
  .toArray()
  .tap(items => {
    log.info(EOL);
    log.info(`Public QNA count : ${items.length}`);
    log.info(EOL);
    progress = new P('  process [:bar] :percent :etas', {
      total: items.length,
      width: 50
    })
  })
  .concatMap(items => Rx.Observable.from(items))
  .concatMap(push2server$)
  .tap(() => progress.tick())
  .toArray()
  .subscribe(
    res => {
      log.info(EOL);
      log.info(EOL);
      let ids = _.chain(res)
        .pluck(res, 'publicQnaId')
        .filter(id => !!id)
        .value()
      log.result(`Process Count : ${res.length}`)
      log.result(`PQNA id Count : ${ids.length}`)
      error$.onCompleted();
      error$.toArray()
        .subscribe((error) => log.result(`Errored : ${error.length}`))
      log.result(ids);
    },
    err => console.error(err, err.stack),
    () => log.result('DONE')
  );
