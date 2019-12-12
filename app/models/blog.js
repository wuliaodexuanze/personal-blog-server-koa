'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Blog extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      index: this.index,
      title: this.title,
      desc: this.desc,
      content: this.content,
      image: this.image,
      fav_nums: this.fav_nums,
      comment_nums: this.comment_nums,
      istop: this.istop,
      classify_id: this.classify_id,
      create_time: this.create_time,
      user: this.user,
      tags: this.tags,
      fav_state: this.fav_state,
      classify: this.classify,
      comment_time: this.comment_time,
      comment_list: this.comment_list
    };
    return origin;
  }
}

Blog.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    index: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      comment: '排序'
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: '图片链接'
    },
    title: {
      type: Sequelize.STRING(128),
      comment: '标题'
    },
    desc: {
      type: Sequelize.STRING(128),
      comment: '文章描述',
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      comment: '内容',
      allowNull: false
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '点赞数量'
    },
    istop: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      comment: '是否顶置 0:未顶置 1:顶置'
    },
    uid: {
      type: Sequelize.INTEGER,
      comment: '用户id',
      allowNull: false
    },
    classify_id: {
      type: Sequelize.INTEGER,
      comment: '分类id',
      allowNull: false
    }
  },
  merge(
    {
      tableName: 'blog',
      modelName: 'blog',
      sequelize: db
    },
    InfoCrudMixin.options
  )
);

module.exports = { Blog };
