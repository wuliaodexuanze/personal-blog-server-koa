'use strict';

const {
  LinValidator,
  Rule
} = require('lin-mizar');

/**
 * 分类添加和更新参数验证
 */
class CreateOrUpdateLinkValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '链接名必须传入');
    this.path = new Rule('isNotEmpty', '链接地址必须传入');
  }
}

module.exports = {
  CreateOrUpdateLinkValidator
};
