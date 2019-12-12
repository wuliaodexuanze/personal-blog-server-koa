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
const {
  db
} = require('lin-mizar/lin/db');

class Favor extends Model {

}

Favor.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: Sequelize.INTEGER,
    comment: '用户id',
    allowNull: false
  },
  blog_id: {
    type: Sequelize.INTEGER,
    comment: '文章id',
    allowNull: false
  }
},
merge({
  tableName: 'Favor',
  modelName: 'Favor',
  sequelize: db
},
InfoCrudMixin.options
));

module.exports = {
  Favor
};