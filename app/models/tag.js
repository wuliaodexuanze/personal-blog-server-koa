'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Tag extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      name: this.name,
      desc: this.desc
    };
    return origin;
  }
}

Tag.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(32),
    unique: true,
    comment: '标签名'
  },
  desc: {
    type: Sequelize.STRING(128),
    comment: '描述',
    allowNull: true
  }
},
merge(
  {
    tableName: 'tag',
    modelName: 'tag',
    sequelize: db
  },
  InfoCrudMixin.options
));

module.exports = {
  Tag
};
