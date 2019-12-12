'use strict';

const {
  LinValidator,
  Rule
} = require('lin-mizar');

/**
 * 分类添加和更新参数验证
 */
class CreateOrUpdateClassifyValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '分类名必须传入');
    this.path = new Rule('isNotEmpty', '分类路径必须传入');
  }
}

module.exports = {
  CreateOrUpdateClassifyValidator
};
