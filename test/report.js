import assert from 'assert';
import {
  report2console,
  report2gist
} from '../lib/report';

describe('report.js', () => {
  it('report2console should return following object', () => {
    const data = {
      result: [{}, {}, {}, null, {}, {}],
      errored: [{}]
    };
    let result = report2console(data, true);
    assert(result);
    assert(result.saved);
    assert.deepEqual(result, {
      result: [{}, {}, {}, null, {}, {}],
      saved: [{}, {}, {}, {}, {}],
      errored: [{}]
    });
  });

  it('report2gist should return following object', done => {
    const data = {
      result: [{}, {}, {}, null, {}, {}],
      saved: [{publicQnaId: 1}],
      errored: [{}]
    };
    report2gist(data, true)
      .subscribe(res => {
        assert(res);
        assert(res.result);
        assert(res.ids);
        assert.deepEqual(res.result, {
          processed: 6,
          saved: 1,
          errored: 1
        });
        assert.deepEqual(res.ids, [1]);
        done();
      });
  });
});
