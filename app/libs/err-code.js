'use strict';

const { HttpException } = require('lin-mizar');
const assert = require('assert');
const { isInteger } = require('lodash');

/**
 * 没有获取到对应数据提示
 * @class DataNotFound
 * @extends {HttpException}
 */
class DataNotFound extends HttpException {
  constructor (ex) {
    super();
    this.code = 404;
    this.msg = '没有找到相关数据信息';
    this.errorCode = 80010;
    if (ex && ex.code) {
      assert(isInteger(ex.code));
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    if (ex && ex.errorCode) {
      assert(isInteger(ex.errorCode));
      this.errorCode = ex.errorCode;
    }
  }
}

/**
 * 收藏提示
 * @class LikeOrDislikeError
 * @extends {HttpException}
 */
class LikeOrDislikeError extends HttpException {
  constructor (ex) {
    super();
    this.code = 400;
    this.msg = '您已收藏了';
    this.errorCode = 60010;
    if (ex && ex.code) {
      assert(isInteger(ex.code));
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    if (ex && ex.errorCode) {
      assert(isInteger(ex.errorCode));
      this.errorCode = ex.errorCode;
    }
  }
}

/**
 * 支持或反对
 * @class SupportOrOpposeError
 * @extends {HttpException}
 */
class SupportOrOpposeError extends HttpException {
  constructor (ex) {
    super();
    this.code = 400;
    this.msg = '您已支持过了';
    this.errorCode = 60020;
    if (ex && ex.code) {
      assert(isInteger(ex.code));
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    if (ex && ex.errorCode) {
      assert(isInteger(ex.errorCode));
      this.errorCode = ex.errorCode;
    }
  }
}

module.exports = {
  DataNotFound,
  LikeOrDislikeError,
  SupportOrOpposeError
};
