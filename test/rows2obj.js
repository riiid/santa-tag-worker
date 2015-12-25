import assert from 'assert';
import {
  isTargetSheet,
  getCells$,
  groupByRow$
} from '../lib/rows2obj';
import auth$ from '../lib/auth';
import credential from '../credential';
import {sheetTitles, sheetKey} from '../config';

describe('rows2obj.js', () => {
  describe('#functions', () => {
    it('isTargetSheet should return true with given obj', () => {
      let obj = {
        title: sheetTitles[0]
      };
      assert.equal(isTargetSheet(obj), true);
    });

    it('groupByRow$ should produce grouped stream with given cells', done => {
      let cells = [
        {row: 0, col: 1, value: 'header'},
        {row: 0, col: 2, value: 'header'},
        {row: 0, col: 3, value: 'header'},
        {row: 0, col: 4, value: 'header'},
        {row: 1, col: 1, value: 'value11'},
        {row: 1, col: 2, value: 'value12'},
        {row: 1, col: 3, value: 'value13'},
        {row: 1, col: 4, value: 'value14'},
        {row: 2, col: 1, value: 'value21'},
        {row: 2, col: 2, value: 'value22'},
        {row: 2, col: 3, value: 'value23'},
        {row: 2, col: 4, value: 'value24'}
      ];
      groupByRow$(cells)
        .toArray()
        .subscribe(
          grouped => {
            assert.equal(grouped.length, 2);
            assert.deepEqual(grouped[0], {
              key: '1',
              values: ['value11', 'value12', 'value13', 'value14']
            });
          },
          err => {
            throw err;
          },
          () => done()
        );
    });
  });

  describe('#fetch-cells', () => {
    let subscription = null;

    it('getCells$ should fetch cells with given auth$ and opt', done => {
      const opt = {
        'min-row': 1,
        'max-row': 1,
        'min-col': 1,
        'max-col': 5
      };
      subscription = auth$(credential, sheetKey)
        .flatMap(sheetInfo => sheetInfo.worksheets)
        .filter(isTargetSheet)
        .take(1)
        .flatMap(ws => getCells$(ws, opt))
        .subscribe(
          cells => {
            let cell = cells[0];
            assert(cells);
            assert(cell.row);
            assert(cell.value);
          },
          err => {
            throw err;
          },
          () => done()
        );
    });

    after(() => subscription.dispose());
  });
});
