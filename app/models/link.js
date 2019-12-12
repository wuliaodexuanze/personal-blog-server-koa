'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Link extends Model {
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

Link.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(32),
    unique: true,
    comment: '链接名'
  },
  path: {
    type: Sequelize.STRING(128),
    comment: '地址',
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING(128),
    comment: '链接描述',
    allowNull: true
  }
},
merge(
  {
    tableName: 'link',
    modelName: 'link',
    sequelize: db
  },
  InfoCrudMixin.options
));

module.exports = {
  Link
};
