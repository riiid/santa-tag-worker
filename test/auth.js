import GSS from 'google-spreadsheet';
import assert from 'assert';
import {authenticate, getSheetInfo} from '../lib/auth';
import credential from '../credential';
import {sheetKey, sheetTitles} from '../config';

describe('auth.js', () => {
  let authSubscription = null;
  let infoSubscription = null;
  let sheet = new GSS(sheetKey);

  it('credentail.json should include client_email & private_key', () => {
    assert(credential.client_email);
    assert(credential.private_key);
  });

  it('sheetInfo.json should include sheetKey & sheetTitles', () => {
    assert(sheetKey);
    assert(sheetTitles);
  });

  it('authenticate should propagate callback with given credentials', done => {
    authSubscription = authenticate(sheet)(credential)
      .subscribe(
        () => {
        },
        err => {
          throw err;
        },
        () => done()
      );
  });

  it('getSheetInfo should propagate sheetInfo', done => {
    infoSubscription = getSheetInfo(sheet)().subscribe(
      sheetInfo => {
        assert(sheetInfo);
        assert(sheetInfo.title);
        assert(sheetInfo.worksheets);
      },
      err => {
        throw err;
      },
      () => done()
    );
  });

  after(() => {
    authSubscription.dispose();
    infoSubscription.dispose();
  });
});
