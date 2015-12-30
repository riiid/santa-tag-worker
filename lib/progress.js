import Progress from 'progress';
import {EOL} from 'os';
import log from './log';

export default (title, items) => {
  process.stderr.write(EOL);
  log.info(`${title}`);
  process.stderr.write(EOL);
  let progress = new Progress('  process [:bar] :current / :total (:percent, :elapseds)', {
    total: items.length,
    width: 50
  });
  return progress;
};
