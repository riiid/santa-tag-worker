import Rx from 'rx';
import P from 'progress';
import _ from 'lodash';
import log from './lib/log';
import auth$ from './lib/auth';
import rows2obj$ from './lib/rows2obj';
import transform$ from './lib/transform';
import validate$ from './lib/validate';
import push2server$, {pushError$} from './lib/push2server';
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
    process.stderr.write(EOL);
    log.info(`Public QNA count : ${items.length}`);
    process.stderr.write(EOL);
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
      process.stderr.write(EOL);
      process.stderr.write(EOL);
      let ids = _.chain(res)
        .pluck(res, 'publicQnaId')
        .filter(id => !!id)
        .value()
      log.result(`Process Count : ${res.length}`)
      log.result(`PQNA id Count : ${ids.length}`)
      pushError$.onCompleted();
      pushError$.toArray()
        .subscribe((error) => log.result(`Errored : ${error.length}`))
      log.result(ids);
    },
    err => console.error(err, err.stack),
    () => log.result('DONE')
  );
