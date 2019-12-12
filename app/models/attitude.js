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

class Attitude extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      uid: this.uid,
      comment_id: this.comment_id,
      blog_id: this.blog_id
    };
    return origin;
  }
}

Attitude.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comment_id: {
    type: Sequelize.INTEGER,
    comment: '评论id'
  },
  uid: {
    type: Sequelize.INTEGER,
    comment: '用户id'
  },
  blog_id: {
    type: Sequelize.INTEGER,
    comment: '文章id'
  },
  state: {
    type: Sequelize.ENUM('1', '-1'),
    comment: '对评论态度(1:支持 -1:反对)'
  }
},
merge({
  tableName: 'attitude',
  modelName: 'attitude',
  sequelize: db
},
InfoCrudMixin.options
)
);

module.exports = {
  Attitude
};