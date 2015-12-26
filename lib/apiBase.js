/* eslint camelcase:0 */
import Rx from 'rx';
import Req from 'superagent';
import {
  url,
  api_key,
  token
} from '../config';

const DEFAULT_OPT = {
  api_key,
  token
};

const DEFAULT_URL = {
  host: url,
  path: ''
}

export function get(url, opt) {
  let _url = Object.assign({}, DEFAULT_URL, url);
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.get(`${_url.host}/${_url.path}`)
      .query(_opt)
      .end((err, res) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(res);
          observer.onCompleted();
        }
      });
  });
}

export function post(url, opt) {
  let _url = Object.assign({}, DEFAULT_URL, url);
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.post(`${_url.host}/${_url.path}`)
      .send(_opt)
      .end((err, res) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(res);
          observer.onCompleted();
        }
      });
  });
}

export function patch(url, opt) {
  let _url = Object.assign({}, DEFAULT_URL, url);
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.patch(`${_url.host}/${_url.path}`)
      .send(_opt)
      .end((err, res) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(res);
          observer.onCompleted();
        }
      });
  });
}

export function del(url, opt) {
  let _url = Object.assign({}, DEFAULT_URL, url);
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.del(`${_url.host}/${_url.path}`)
      .send(_opt)
      .end((err, res) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(res);
          observer.onCompleted();
        }
      });
  });
}
