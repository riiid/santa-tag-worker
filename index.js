import {EOL} from 'os';
import log from './lib/log';
import auth$ from './lib/auth';
import rows2obj$ from './lib/rows2obj';
import transform$ from './lib/transform';
import validate$ from './lib/validate';
import push2server$ from './lib/push2server';
import error$ from './lib/error';
import afterValidate$ from './lib/afterValidate';
import report from './lib/report';

auth$()
  .tap(() => process.stderr.write(EOL))
  .concatMap(rows2obj$)
  .concatMap(transform$)
  .concatMap(validate$)
  .toArray()
  .concatMap(push2server$)
  .concatMap(afterValidate$)
  .tap(() => error$.onCompleted())
  .combineLatest(error$.toArray(), (result, errored) => {
    return {result, errored};
  })
  .concatMap(report)
  .subscribe(
    () => { },
    err => console.error(err, err.stack),
    () => log.result('DONE')
  );
