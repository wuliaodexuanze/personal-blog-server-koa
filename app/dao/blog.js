'use strict';

const {
  sampleSize
} = require('lodash');
const {
  NotFound,
  Forbidden,
  ParametersException
} = require('lin-mizar');
const { db } = require('lin-mizar/lin/db');
const { Blog } = require('../models/blog');
const { User } = require('../models/user');
const { Tag } = require('../models/tag');
const { BlogTagDao } = require('./blog_tag');
const Sequelize = require('sequelize');

const blogTagDao = new BlogTagDao();

class BlogDao {
  /**
   * 创建博客
   * @param v
   * @returns {Promise<void>}
   */
  async createBlog (v, uid) {
    const blog = await Blog.findOne({
      where: {
        title: v.get('body.title'),
        delete_time: null
      }
    });
    if (blog) {
      throw new Forbidden({
        msg: '文章名已存在'
      });
    }
    return db.transaction(async (t) => {
      const tags = v.get('body.tags');
      const newBlog = await Blog.create({
        title: v.get('body.title'),
        desc: v.get('body.desc') || v.get('body.title'),
        image: v.get('body.image'),
        content: v.get('body.content'),
        classify_id: v.get('body.classify_id'),
        uid
      }, {
        transaction: t
      });
      // 创建博客和标签关系
      await blogTagDao.createBlogTag(newBlog.getDataValue('id'), tags, t);
    });
  }

  /**
   * 删除博客
   * @param id
   * @returns {Promise<void>}
   */
  async deleteBlog (id) {
    const blog = await Blog.findOne({
      where: {
        id
      }
    });
    if (!blog) {
      throw new NotFound({
        msg: '没有找到相关文章'
      });
    }
    await blog.destroy({
      force: true
    });
    return blog;
  }

  /**
   * 更新博客
   * @param v
   * @param id
   * @returns {Promise<void>}
   */
  async updateBlog (v, id) {
    const blog = await Blog.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!blog) {
      throw new NotFound({
        msg: '没有找到相关文章'
      });
    }

    const title = v.get('body.title');

    // 排除修改时，添加与存在标签名一样的链接
    const rBlog = await Blog.findOne({
      where: {
        title,
        delete_time: null,
        id: {
          [Sequelize.Op.not]: id
        }
      }
    });
    if (rBlog) {
      throw new ParametersException({
        msg: '文章名以存在'
      });
    }

    return db.transaction(async (t) => {
      const tags = v.get('body.tags');
      blog.update({
        title: v.get('body.title'),
        desc: v.get('body.desc') || v.get('body.title'),
        image: v.get('body.image'),
        content: v.get('body.content'),
        classify_id: v.get('body.classify_id')
      }, {
        transaction: t
      });
      blog.save({
        transaction: t
      });
      // 删除博客所属标签
      await blogTagDao.deleteBlogTag(blog.getDataValue('id'));
      // 创建博客和标签关系
      await blogTagDao.createBlogTag(blog.getDataValue('id'), tags);
      return blog;
    });
  }

  /**
   * 置顶文章
   * @param {*} id 文章id
   */
  async topBlog (id) {
    const blog = await Blog.findOne({
      where: {
        id
      }
    });
    if (!blog) {
      throw new NotFound({
        msg: '没有找到相关文章'
      });
    }

    if (!blog.image) {
      throw new ParametersException({
        msg: '没有封面图的文章不能置顶'
      });
    }

    blog.istop = 1;
    const ret = await blog.save();

    return ret;
  }

  /**
   * 取消置顶文章
   * @param {*} id 文章id
   */
  async topBlogCancel (id) {
    const blog = await Blog.findOne({
      where: {
        id
      }
    });
    if (!blog) {
      throw new NotFound({
        msg: '没有找到相关文章'
      });
    }
    blog.istop = 0;
    const ret = await blog.save();

    return ret;
  }

  /**
   * 获取文章点赞收藏数
   */
  async getLikeCount (id) {
    const likeCount = await Blog.findOne({
      attributes: ['fav_nums'],
      where: {
        id,
        delete_time: null
      }
    });

    if (!likeCount) {
      throw new ParametersException({
        msg: '没有获取对应文章，请确认参数是否传递正确'
      });
    }

    return likeCount;
  }

  /**
   * 根据分类获取文章
   * @param {*} classifyId
   * @param {*} offset
   * @param {*} limit
   * @returns
   * @memberof BlogDao
   */
  async getBlogsByClassifyId (classifyId, offset, limit) {
    const blogs = await Blog.findAndCountAll({
      attributes: {
        exclude: ['content']
      },
      where: {
        classify_id: classifyId,
        delete_time: null
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['nickname', 'username', 'avatar'],
        association: Blog.hasMany(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      },
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }],
      order: [
        ['create_time', 'DESC']
      ],
      offset,
      limit
    });

    return blogs;
  }

  /**
   * 获取指定用户的文章
   * @param {*} uid 用户id
   * @param {*} offset
   * @param {*} limit
   * @returns
   * @memberof BlogDao
   */
  async getBlogsByUid (uid, offset, limit) {
    const blogs = await Blog.findAndCountAll({
      attributes: {
        exclude: ['content']
      },
      where: {
        uid,
        delete_time: null
      },
      distinct: true,
      include: [{
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }],
      order: [
        ['create_time', 'DESC']
      ],
      offset,
      limit
    });

    return blogs;
  }

  /**
   * 获取对应博客上一个博客和下一个博客
   * @param {*} id
   */
  async getOrsoBlog (id) {
    const blogPrev = await Blog.findOne({
      attributes: ['id', 'title'],
      where: {
        id: {
          [Sequelize.Op.gt]: id
        }
      }
    });

    const blogNext = await Blog.findOne({
      attributes: ['id', 'title'],
      where: {
        id: {
          [Sequelize.Op.lt]: id
        }
      },
      order: [
        ['create_time', 'DESC']
      ]
    });

    return {
      nextArticle: blogNext,
      prevArticle: blogPrev
    };
  }

  /**
   * 查询被置顶的文章
   * @memberof BlogDao
   */
  async getBlogTops () {
    const blogs = await Blog.findAll({
      attributes: ['id', 'image', 'title'],
      where: {
        delete_time: null,
        istop: 1
      }
    });

    return sampleSize(blogs, 6);
  }

  async getFavorCount (id) {
    const blog = await Blog.findOne({
      attributes: ['fav_nums'],
      where: {
        id,
        delete_time: null
      }
    });

    return blog;
  }

  /**
   * 验证博客是否存在
   * @param {*} id
   * @returns
   * @memberof BlogDao
   */
  async verifyHasBlog (id) {
    const blog = Blog.findOne({
      attributes: {
        exclude: ['content']
      },
      where: {
        id
      }
    });

    return blog;
  }
}

module.exports = {
  BlogDao
};