import Rx from 'rx';
import _ from 'lodash';
import {EOL} from 'os';
import log from './log';
import {
  createGist
}from './api';

export const report2console = data => {
  let {result, errored} = data;
  let saved = _.filter(result, item => !!item);
  process.stderr.write(EOL);
  log.result(`Processed : ${result.length}`)
  log.result(`Saved     : ${saved.length}`)
  log.result(`Errored   : ${errored.length}`);
  return Object.assign({}, data, {saved});
};

export const report2gist = data => {
  let result = {
    processed: data.result.length,
    saved: data.saved.length,
    errored: data.errored.length
  }
  let ids = _.pluck(data.saved, 'publicQnaId');
  return createGist({
    description: `result for santa-tag-worker at ${new Date()}`,
    public: false,
    files: {
      '1-result.json': {
        content: JSON.stringify(result, null, 2)
      },
      '2-error.json': {
        content: JSON.stringify(data.errored, null, 2)
      },
      '3-sucess.json': {
        content: JSON.stringify(ids, null, 2)
      }
    }
  })
  .tap(res => log.result(`Result Saved : ${res.body.html_url}`));
};

export default data => {
  return Rx.Observable.return(data)
    .map(report2console)
    .concatMap(report2gist);
};
