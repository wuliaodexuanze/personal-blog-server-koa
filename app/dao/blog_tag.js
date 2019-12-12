'use strict';

const {
  ParametersException
} = require('lin-mizar');
const {
  each,
  uniq
} = require('lodash');
const { BlogTag } = require('../models/blog_tag');

class BlogTagDao {
  /**
   * 为博客添加标签
   * @param {*} blogId
   * @param {*} tagIds
   * * @param {*} t 执行事务是传递参数
   * @memberof BlogTagDao
   */
  async createBlogTag (blogId, tagIds, t) {
    // 添加前先清除对应文章对应的所有标签
    let ret = null;
    await BlogTag.destroy({
      force: true,
      where: {
        blog_id: blogId
      }
    });
    if (tagIds.length > 0) {
      const li = [];
      each(tagIds, tid => {
        li.push({
          blog_id: blogId,
          tag_id: tid
        });
      });
      // 将数据插入标签表
      if (t) {
        ret = await BlogTag.bulkCreate(li, {
          transaction: t
        });
      } else {
        ret = await BlogTag.bulkCreate(li);
      }
      return ret;
    }
  }

  /**
   * 删除博客标签
   * @static
   * @param {*} blogId 博客id
   * @param {*} t 执行事务是传递参数
   * @memberof BlogTag
   */
  async deleteBlogTag (blogId, t) {
    const blogTag = await BlogTag.findOne({
      where: {
        blog_id: blogId,
        delete_time: null
      }
    });
    if (!blogTag) {
      throw new ParametersException({
        msg: '没有查到对应的信息，请确认参数是否正确传递'
      });
    }
    if (t) {
      await blogTag.destroy({
        force: true,
        transaction: t
      });
    } else {
      await blogTag.destroy({
        force: true
      });
    }
  }

  /**
   * 获取指定标签对应的所有博客
   */
  async getBlogsByTagId (tagId, offset, limit) {
    const tagIds = await BlogTag.findAll({
      attributes: ['blog_id'],
      where: {
        tag_id: tagId,
        delete_time: null
      }
    });
    let ids = [];
    each(tagIds, item => {
      ids.push(item.blog_id);
    });

    const newTagIds = uniq(ids);
    const { BlogDao } = require('./blog');
    const blogDao = new BlogDao();
    const blogs = await blogDao.getBlogsByIds(newTagIds, offset, limit);
    return blogs;
  }
}

module.exports = {
  BlogTagDao
};
