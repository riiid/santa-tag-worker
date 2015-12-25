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

export function get(endPoint, opt) {
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.get(`${url}/${endPoint}`)
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

export function post(endPoint, opt) {
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.post(`${url}/${endPoint}`)
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

export function patch(endPoint, opt) {
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.patch(`${url}/${endPoint}`)
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

export function del(endPoint, opt) {
  let _opt = Object.assign({}, DEFAULT_OPT, opt);
  return Rx.Observable.create(observer => {
    Req.del(`${url}/${endPoint}`)
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
