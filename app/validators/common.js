'use strict';

const { LinValidator, Rule } = require('lin-mizar');
const { config } = require('lin-mizar/lin/config');

class PositiveIdValidator extends LinValidator {
  constructor () {
    super();
    this.id = new Rule('isInt', '必须为正整数', { min: 1 });
  }
}

class PaginateValidator extends LinValidator {
  constructor () {
    super();
    this.count = [
      new Rule('isOptional', '', config.getItem('countDefault')),
      new Rule('isInt', 'count必须为正整数', { min: 1 })
    ];
    this.page = [
      new Rule('isOptional', '', config.getItem('pageDefault')),
      new Rule('isInt', 'page必须为整数，且大于等于0', { min: 0 })
    ];
  }
}

module.exports = {
  PaginateValidator,
  PositiveIdValidator
};
