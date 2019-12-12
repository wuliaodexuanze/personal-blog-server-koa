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
const { Blog } = require('./blog');
const { Tag } = require('./tag');

class BlogTag extends Model {

}

BlogTag.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blog_id: {
    type: Sequelize.INTEGER,
    comment: '博客id'
  },
  tag_id: {
    type: Sequelize.INTEGER,
    comment: '标签id'
  }
},
merge({
  tableName: 'blog_tag',
  modelName: 'blog_tag',
  sequelize: db
},
InfoCrudMixin.options
));

Tag.belongsToMany(Blog, {
  through: BlogTag,
  constraints: false,
  foreignKey: 'tag_id'
});

Blog.belongsToMany(Tag, {
  through: BlogTag,
  foreignKey: 'blog_id',
  constraints: false
});

module.exports = {
  BlogTag
};