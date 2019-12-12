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

class Comment extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      content: this.content,
      like_nums: this.like_nums,
      dislike_nums: this.dislike_nums,
      blog: this.blog,
      user: this.user,
      uid: this.uid,
      blog_id: this.blog_id,
      comment_state: this.comment_state,
      create_time: this.createTime
    };
    return origin;
  }
}

Comment.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: Sequelize.STRING(256),
    comment: '评论内容',
    allowNull: false
  },
  like_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '支持数'
  },
  dislike_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '反对数'
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
  tableName: 'comment',
  modelName: 'comment',
  sequelize: db
},
InfoCrudMixin.options
));

module.exports = {
  Comment
};