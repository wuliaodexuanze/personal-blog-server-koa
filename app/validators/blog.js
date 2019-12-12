'use strict';

const { LinValidator, Rule } = require('lin-mizar');

/**
 * 博客添加和更新参数验证
 */
class CreateOrUpdateBlogValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '文章名必须传入');
    this.image = [
      new Rule('isOptional'),
      new Rule('isLength', '图书插图的url长度必须在0~255之间', {
        min: 0,
        max: 255
      })
    ];
    this.content = new Rule('isNotEmpty', '文章内容必须传入');
    this.classify_id = [
      new Rule('isNotEmpty', '请选择分类'),
      new Rule('isInt', '分类参数错误')
    ];
    this.tags = new Rule('isNotEmpty', '请选择标签');
  }
}

/**
 * 搜索博客关键字验证
 */
class BlogSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入搜索关键字');
  }
}

module.exports = {
  CreateOrUpdateBlogValidator,
  BlogSearchValidator
};
