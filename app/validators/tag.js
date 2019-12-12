'use strict';

const {
  LinValidator,
  Rule
} = require('lin-mizar');

/**
 * 标签添加和更新参数验证
 */
class CreateOrUpdateTagValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '标签名必须传入');
  }
}

/**
 * 搜索标签关键字验证
 */
class TagSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '搜索关键字必须传入');
  }
}

module.exports = {
  CreateOrUpdateTagValidator,
  TagSearchValidator
};
