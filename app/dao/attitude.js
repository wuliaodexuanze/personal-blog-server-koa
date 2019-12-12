'use strict';

const {
  ParametersException
} = require('lin-mizar');

const { db } = require('lin-mizar/lin/db');
const { SupportOrOpposeError } = require('../libs/err-code')
const { Attitude } = require('../models/attitude');
const { CommentDao } = require('./comment');
const { BlogDao } = require('./blog');

const commentDao = new CommentDao();
const blogDao = new BlogDao();

class AttitudeDao {
  /**
   * 对评论支持
   * @param v
   * @returns {Promise<void>}
   */
  async support (commentId, blogId, uid) {
    const blog = await blogDao.verifyHasBlog(blogId);
    if (!blog) {
      throw new ParametersException({
        msg: '没有对应的文章，请确认参数是否正确传递'
      });
    }
    const attitude = await Attitude.findOne({
      where: {
        uid,
        blog_id: blogId,
        comment_id: commentId,
        delete_time: null
      }
    });
    if (attitude && (Number(attitude.getDataValue('state')) === 1)) {
      throw new SupportOrOpposeError();
    }
    return db.transaction(async (t) => {
      // 用户已经反对了，此时点击支持
      if (attitude) {
        await attitude.update({
          state: '1'
        }, {
          transaction: t
        });
        await attitude.save({
          transaction: t
        });
      } else { // 用户没支持过也没反对过
        await Attitude.create({
          uid,
          blog_id: blogId,
          comment_id: commentId,
          state: '1'
        }, {
          transaction: t
        });
      }

      const comment = await commentDao.getCommentById(commentId);
      if (!comment) {
        throw new ParametersException({
          msg: '没有对应的评论，请确认参数是否正确传递'
        });
      }
      await comment.increment('like_nums', {
        by: 1,
        transaction: t
      });
      // 获取返回数是否为0。如果为0则不再需要减 1，否则执行减 1 操作
      const dislikeNums = comment.getDataValue('dislike_nums');
      if (dislikeNums > 0) {
        await comment.decrement('dislike_nums', {
          by: 1,
          transaction: t
        });
      }
    });
  }

  /**
   * 对评论反对
   * @param v
   * @returns {Promise<void>}
   */
  async oppose (commentId, blogId, uid) {
    const blog = await blogDao.verifyHasBlog(blogId);
    if (!blog) {
      throw new ParametersException({
        msg: '没有对应的文章，请确认参数是否正确传递'
      });
    }
    const attitude = await Attitude.findOne({
      where: {
        uid,
        blog_id: blogId,
        comment_id: commentId,
        delete_time: null
      }
    })

    if (attitude && (Number(attitude.getDataValue('state')) === -1)) {
      throw new SupportOrOpposeError({
        msg: '您已反对过了'
      });
    }

    return db.transaction(async (t) => {
      // 用户已经支持了，此时点击返回
      if (attitude) {
        attitude.update({
          state: '-1'
        }, {
          transaction: t
        });
        await attitude.save({
          transaction: t
        });
      } else { // 用户之前没做过操作
        await Attitude.create({
          uid,
          blog_id: blogId,
          comment_id: commentId,
          state: '-1'
        }, {
          transaction: t
        });
      }

      const comment = await commentDao.getCommentById(commentId);
      if (!comment) {
        throw new ParametersException({
          msg: '没有对应的评论，请确认参数是否正确传递'
        });
      }
      await comment.increment('dislike_nums', {
        by: 1,
        transaction: t
      })
      const likeNums = comment.getDataValue('like_nums');
      if (likeNums > 0) {
        await comment.decrement('like_nums', {
          by: 1,
          transaction: t
        });
      }
    });
  }
}

module.exports = {
  AttitudeDao
};