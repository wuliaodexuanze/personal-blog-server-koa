'use strict';

const {
  LinValidator,
  Rule
} = require('lin-mizar');

/**
 * 博客添加和更新参数验证
 */
class CreateOrUpdateCommentValidator extends LinValidator {
  constructor () {
    super();
    this.blog_id = new Rule('isInt', '必须为正整数');
    this.content = new Rule('isNotEmpty', '必须传入评论内容');
  }
}

module.exports = {
  CreateOrUpdateCommentValidator
};