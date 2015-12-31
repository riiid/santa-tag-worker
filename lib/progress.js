import Progress from 'progress';
import {EOL} from 'os';
import log from './log';

const PROGRESS_FMT = '  process [:bar] :current / :total (:percent, :elapseds)';

export default (title, items) => {
  process.stderr.write(EOL);
  log.info(`${title}`);
  process.stderr.write(EOL);
  let progress = new Progress(PROGRESS_FMT, {
    total: items.length,
    width: 50
  });
  return progress;
};
