'use strict';

const {
  InfoCrudMixin
} = require('lin-mizar/lin/interface');
const {
  merge
} = require('lodash');
const {
  Sequelize,
  Model
} = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Classify extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      name: this.name,
      path: this.path,
      desc: this.desc
    };
    return origin;
  }
}

Classify.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(32),
    comment: '分类名',
    allowNull: false
  },
  path: {
    type: Sequelize.STRING(32),
    comment: '路径',
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING(128),
    comment: '描述',
    allowNull: true
  }
},
merge({
  tableName: 'classify',
  modelName: 'classify',
  sequelize: db
},
InfoCrudMixin.options
));

module.exports = {
  Classify
};
