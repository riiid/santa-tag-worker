import debug from 'debug';
import auth$ from './lib/auth';
import rows2obj$ from './lib/rows2obj';
import transform$ from './lib/transform';
import validate$ from './lib/validate';
import push2server$ from './lib/push2server';

import credential from './credential';
import {sheetKey} from './config';

const info = debug('info');
const result = debug('result');

auth$(credential, sheetKey)
  .concatMap(rows2obj$)
  .bufferWithCount(5)
  .concatMap(transform$)
  .concatMap(validate$)
  .take(1)
  .concatMap(push2server$)
  .subscribe(
      res => result(JSON.stringify(res, null, 2)),
      err => console.error(err, err.stack),
      () => info('==========COMPLETED=========='));
