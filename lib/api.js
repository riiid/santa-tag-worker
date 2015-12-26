/* eslint camelcase:0 */
import {get, post, patch, del} from './apiBase';

/**
 * fetch tags.
 * @param {Object} opt - query params.
 * @param {nubmer} [opt.per_page=200] - response items per page.
 * @return {Observable} - observable response.
 */
export function getTags(opt = {}) {
  const _opt = Object.assign({}, {per_page: 200}, opt);
  return get({path: 'tags.json'}, _opt);
}

/**
 * fetch wrong answers.
 * @param {Object} opt - query params.
 * @param {string} [opt.public_qna_ids] - comma seperated public qna ids.
 * @return {Observable} - observable response.
 */
export function getWrongAnswers(opt = {}) {
  return get({path: 'wrong_answers.json'}, opt);
}

/**
 * fetch wrong answer with given id.
 * @param {number} id - wrong answer id
 * @return {Observable} - observable response.
 */
export function getWrongAnswersById(id) {
  return get({path: `wrong_answers/${id}.json`});
}

/**
 * create wrong answer.
 * @param {Object} opt - params.
 * @param {number} opt.public_qna_id - public qna id.
 * @param {number} opt.number - number.
 * @return {Observable} - observable response.
 */
export function createWrongAnswers(opt = {}) {
  return post({path: 'wrong_answers.json'}, opt);
}

/**
 * fetch wrong answer tags with given id.
 * @param {number} id - wrong answer tag id.
 * @return {Observable} - observable response.
 */
export function getWrongAnswerTags(id) {
  return get({path: `wrong_answer_tags/${id}.json`});
}

/**
 * create wrong answer tags.
 * @param {Object} opt - parmas.
 * @param {number} opt.tag_id - tag's id.
 * @param {number} opt.wrong_answer_id - wrong answer id.
 * @return {Observable} - observable response.
 */
export function createWrongAnswerTags(opt = {}) {
  return post({path: 'wrong_answer_tags.json'}, opt);
}

/**
 * update wrong answer tags.
 * @param {Object} opt - parmas.
 * @param {number} opt.id - wrong answer tag id.
 * @param {number} opt.tag_id - tag's id.
 * @param {number} opt.wrong_answer_id - wrong answer id.
 * @return {Observable} - observable response.
 */
export function updateWrongAnswerTags(opt = {}) {
  return patch({path: `wrong_answer_tags/${opt.id}.json`}, opt);
}

/**
 * delete wrong answer tags.
 * @param {Object} opt - parmas.
 * @param {number} opt.id - wrong answer tag id.
 * @return {Observable} - observable response.
 */
export function deleteWrongAnswerTags(opt = {}) {
  return del({path: `wrong_answer_tags/${opt.id}.json`});
}


/**
 * update public qna with given id.
 * @param {Object} opt - parmas.
 * @param {number} opt.id - public qna id.
 * @param {number} opt.core_tag_id - public qna's core tag id.
 * @return {Observable} - observable response.
 */
export function updatePublicQna(opt = {}) {
  return patch({path: `public_qnas/${opt.id}.json`}, opt);
}

/**
 * create gist.
 * @param {Object} opt - parmas for gist.
 * @param {boolean} opt.public - Indicates whether the gist is public.
 * @param {string} opt.description - A description of this gist.
 * @param {Object} opt.files - Files for this gist.
 * @return {Observable} - observable response.
 */
export function createGist(opt = {}) {
  return post({
    host: 'https://api.github.com',
    path: 'gists'
  }, opt);
}
