'use strict';

const {
  NotFound,
  ParametersException
} = require('lin-mizar');
const { Comment } = require('../models/comment');
const { Blog } = require('../models/blog');
const { BlogDao } = require('./blog');

const blogDao = new BlogDao();

class CommentDao {
  /**
   * 创建评论
   * @param v 评论内容
   * @param uid 用户id
   * @returns {Promise<void>}
   */
  async createComment (v, uid) {
    const blogId = v.get('body.blog_id');
    const blog = await blogDao.verifyHasBlog(blogId);
    if (!blog) {
      throw new ParametersException({
        msg: '没有对应的文章信息，请确认参数是否正确传递'
      });
    }
    const comment = new Comment();
    comment.content = v.get('body.content');
    comment.blog_id = v.get('body.blog_id');
    comment.uid = uid;
    await comment.save();
  }

  /**
   * 删除评论
   * @param id
   * @returns {Promise<void>}
   */
  async deleteComment (id) {
    const comment = await Comment.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!comment) {
      throw new NotFound({
        msg: '没有找到相关评论'
      });
    }
    comment.destroy();
  }

  /**
   * 通过id获取评论
   * @param id
   * @returns {Promise<void>}
   */
  async getCommentById (id) {
    const comment = await Comment.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return comment;
  }

  /**
   * 获取指定用户的所有评论
   * @param {*} uid 用户id
   * @returns
   * @memberof CommentDao
   */
  async getComments (uid, offset, limit) {
    const comments = await Comment.findAndCountAll({
      attributes: {
        exclude: ['uid', 'blog_id']
      },
      where: {
        uid,
        delete_time: null
      },
      distinct: true,
      include: [
        {
          model: Blog,
          attributes: {
            exclude: ['content']
          },
          association: Comment.hasMany(Blog, {
            foreignKey: 'id',
            sourceKey: 'blog_id'
          })
        }
      ],
      order: [
        ['create_time', 'DESC']
      ],
      offset,
      limit
    });
    return comments;
  }
}

module.exports = {
  CommentDao
};