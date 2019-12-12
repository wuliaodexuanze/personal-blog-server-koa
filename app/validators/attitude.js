'use strict';

const {
  LinValidator,
  Rule
} = require('lin-mizar');

/**
 * 评论支持或反对参数验证
 */
class AttitudeValidator extends LinValidator {
  constructor () {
    super();
    this.blog_id = new Rule('isInt', '必须为正整数', {
      min: 1
    });
    this.comment_id = new Rule('isInt', '必须为正整数', {
      min: 1
    });
  }
}

module.exports = {
  AttitudeValidator
};