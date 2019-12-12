'use strict';
const {
  NotFound
} = require('lin-mizar');
const { db } = require('lin-mizar/lin/db');
const { LikeOrDislikeError } = require('../libs/err-code')
const { Favor } = require('../models/favor');
const { BlogDao } = require('./blog');

const blogDao = new BlogDao();

class FavorDao {
  /**
   * 收藏
   * @param v
   * @returns {Promise<void>}
   */
  async like (blogId, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        blog_id: blogId,
        delete_time: null
      }
    });
    if (favor) {
      throw new LikeOrDislikeError({
        msg: '已收藏'
      });
    }
    return db.transaction(async (t) => {
      const newFavor = await Favor.create({
        blog_id: blogId,
        uid
      }, {
        transaction: t
      });
      const blog = await blogDao.verifyHasBlog(blogId);
      if (!blog) {
        throw new NotFound({
          msg: '没有找到对应的文章'
        });
      }
      await blog.increment('fav_nums', {
        by: 1,
        transaction: t
      });

      return newFavor;
    });
  }

  /**
   * 取消收藏
   * @param v
   * @returns {Promise<void>}
   */
  async dislike (blogId, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        blog_id: blogId,
        delete_time: null
      }
    });
    if (!favor) {
      throw new LikeOrDislikeError({
        msg: '你还没收藏'
      });
    }
    return db.transaction(async (t) => {
      await favor.destroy({
        force: true,
        transaction: t
      });
      const blog = await blogDao.verifyHasBlog(blogId);
      if (!blog) {
        throw new NotFound({
          msg: '没有找到对应的文章'
        });
      }
      if (blog.fav_nums > 0) {
        await blog.decrement('fav_nums', {
          by: 1,
          transaction: t
        });
      }

      return favor;
    });
  }
}

module.exports = {
  FavorDao
};