import Progress from 'progress';
import {EOL} from 'os';
import log from './log';

let progress;

const create = items => {
  process.stderr.write(EOL);
  log.info(`Public QNA count : ${items.length}`);
  process.stderr.write(EOL);
  progress = new Progress('  process [:bar] :percent :elapseds', {
    total: items.length,
    width: 50
  });
};

const tick = () => {
  progress.tick();
};

export default {
  create,
  tick
};
