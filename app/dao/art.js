'use strict';

const {
  each,
  some,
  uniq,
  split,
  map,
  isArray
} = require('lodash');

const { File } = require('lin-mizar');
const { config } = require('lin-mizar/lin/config');
const { Blog } = require('../models/blog');
const { User } = require('../models/user');
const { Favor } = require('../models/favor');
const { Classify } = require('../models/classify');
const { Tag } = require('../models/tag');
const { BlogTag } = require('../models/blog_tag');
const { Link } = require('../models/link');
const { Comment } = require('../models/comment');
const { Attitude } = require('../models/attitude');
const Sequelize = require('sequelize');

class Art {
  /**
   * 获取文章id列表
   * @memberof Art
   */
  static _getIds (list = []) {
    const arr = [];
    each(list, (item) => {
      arr.push(item.id);
    });

    return arr;
  }

  /**
   * 查询用户对列表文章是否收藏
   * @param {*} uid
   * @param {*} blogId
   * @returns
   * @memberof Art
   */
  static async _getFavorsState (uid, blogId) {
    const favor = await Favor.findOne({
      where: {
        uid,
        blog_id: blogId,
        delete_time: null
      }
    });

    return !!favor;
  }

  /**
   * 获取收藏文章列表
   * @param {*} ids
   * @memberof BlogDao
   */
  static async _getBlogsByIds (ids, offset, limit, q) {
    const blogs = await Blog.findAndCountAll({
      attributes: {
        exclude: ['content', 'classify_id']
      },
      where: {
        delete_time: null,
        id: {
          [Sequelize.Op.in]: ids
        },
        title: {
          [Sequelize.Op.like]: `%${q}%`
        }
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'username', 'avatar', 'create_time'],
        association: Blog.hasOne(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      },
      {
        model: Classify,
        attributes: ['id', 'name', 'path'],
        association: Blog.hasOne(Classify, {
          foreignKey: 'id',
          sourceKey: 'classify_id'
        })
      },
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }],
      offset,
      limit
    });

    return {
      ...blogs,
      offset,
      limit
    };
  }

  /**
   * 获取博客列表
   * @param {number} [offset=0]
   * @param {number} [limit=10]
   * @param {string} [q='']
   * @returns
   * @memberof Art
   */
  async getBlogList (offset = 0, limit = 10, q = '', type = '') {
    const query = {
      delete_time: null,
      title: {
        [Sequelize.Op.like]: `%${q}%`
      }
    };
    if (type) {
      const classify = await Classify.findOne({
        where: {
          path: type
        }
      });

      if (classify) {
        query.classify_id = classify.id;
      }
    }
    const blogs = await Blog.findAndCountAll({
      attributes: {
        exclude: ['content', 'classify_id']
      },
      where: {
        ...query
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'username', 'avatar', 'create_time'],
        association: Blog.hasOne(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      },
      {
        model: Classify,
        attributes: ['id', 'name', 'path'],
        association: Blog.hasOne(Classify, {
          foreignKey: 'id',
          sourceKey: 'classify_id'
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
    const rows = blogs && blogs.rows;
    let arr = [];
    if (blogs) {
      const ids = Art._getIds(rows);
      const comments = await Comment.findAll({
        attributes: ['blog_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: 'blog_id',
        raw: true,
        where: {
          delete_time: null,
          blog_id: {
            [Sequelize.Op.in]: ids
          }
        }
      });

      arr = map(rows, (item) => {
        item.comment_nums = 0;
        some(comments, (val) => {
          if (Number(item.id) === Number(val.blog_id)) {
            item.comment_nums = val.count;
            return true;
          }
        });
        return item;
      });
    } else {
      arr = map(rows, (item) => {
        item.comment_nums = 0;
        return item;
      });
    }

    return {
      ...blogs,
      rows: arr,
      offset,
      limit
    };
  }

  /**
   * 通过id获取博客(博客详情)
   * @param uid 当前登录用户id
   * @param id 文章id
   * @returns {Promise<void>}
   */
  async getBlog (uid, id) {
    const blog = await Blog.findOne({
      where: {
        id,
        delete_time: null
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'username', 'avatar', 'create_time'],
        association: Blog.hasOne(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      },
      {
        model: Classify,
        attributes: ['id', 'name', 'path'],
        association: Blog.hasOne(Classify, {
          foreignKey: 'id',
          sourceKey: 'classify_id'
        })
      },
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }]
    });

    // 获取用户对当前文章的点赞情况
    let favState = false;
    if (uid) {
      favState = await Art._getFavorsState(uid, id);
    }
    blog.fav_state = favState;

    const imageUrl = blog.image || '';
    if (imageUrl) {
      const imgFont = config.getItem('qiniu.img') + '/';
      const imgPath = split(imageUrl, imgFont);

      const imgFile = await File.findOne({
        attributes: ['id'],
        where: {
          path: imgPath
        }
      });

      blog.image = {
        id: imgFile.id,
        display: imageUrl
      };
    }

    return blog;
  }

  /**
   * 获取收藏列表
   * @returns {Promise<*>}
   */
  async getFavors (uid, offset, limit, q) {
    const favors = await Favor.findAll({
      attributes: ['uid', 'blog_id'],
      where: {
        uid,
        delete_time: null
      },
      order: [
        ['create_time', 'DESC']
      ]
    });

    let ids = [];
    each(favors, item => {
      ids.push(item.blog_id);
    });
    const newTagIds = uniq(ids);
    const blogs = await Art._getBlogsByIds(newTagIds, offset, limit, q);
    const rows = blogs && blogs.rows;
    let arr = [];
    if (blogs) {
      const ids = Art._getIds(rows);
      const comments = await Comment.findAll({
        attributes: ['blog_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: 'blog_id',
        raw: true,
        where: {
          delete_time: null,
          blog_id: {
            [Sequelize.Op.in]: ids
          }
        }
      });

      arr = map(rows, (item) => {
        item.comment_nums = 0;
        some(comments, (val) => {
          if (Number(item.id) === Number(val.blog_id)) {
            item.comment_nums = val.count;
            return true;
          }
        });
        return item;
      });
    } else {
      arr = map(rows, (item) => {
        item.comment_nums = 0;
        return item;
      });
    }
    return {
      ...blogs,
      rows: arr
    };
  }

  /**
   * 侧边栏信息获取
   * @returns
   * @memberof Art
   */
  async getSide () {
    const recommendList = await Blog.findAll({
      attributes: ['id', 'image', 'title', 'create_time'],
      where: {
        delete_time: null
      },
      order: [
        ['create_time', 'DESC']
      ],
      limit: 5
    });

    const popularList = await Blog.findAll({
      attributes: ['id', 'image', 'title', 'create_time'],
      where: {
        delete_time: null
      },
      order: [
        ['fav_nums', 'DESC']
      ],
      limit: 5
    });

    const tags = await Tag.findAll({
      attributes: ['id', 'name'],
      where: {
        delete_time: null
      }
    });

    const links = await Link.findAll({
      attributes: ['id', 'name', 'path'],
      where: {
        delete_time: null
      }
    });

    return {
      recommendList,
      popularList,
      tags,
      links
    };
  }

  /**
   * 获取文章对应的所有评论
   * @param {*} id 文章id
   * @memberof CommentDao
   */
  async getBlogComments (uid, id, offset, limit) {
    const comments = await Comment.findAndCountAll({
      attributes: {
        exclude: ['uid', 'blog_id']
      },
      where: {
        blog_id: id,
        delete_time: null
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'username', 'avatar', 'create_time'],
        association: Comment.hasOne(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      }],
      order: [
        ['create_time', 'ASC']
      ],
      offset,
      limit
    });
    const rows = comments.rows;
    let arr = [];
    if (uid) {
      const ids = Art._getIds(rows);
      const states = await Attitude.findAll({
        attributes: ['id', 'comment_id', 'uid', 'blog_id', 'state'],
        where: {
          uid,
          blog_id: id,
          comment_id: {
            [Sequelize.Op.in]: ids
          },
          delete_time: null
        }
      });

      arr = map(rows, (item) => {
        item.comment_state = false;
        some(states, (val) => {
          if (Number(item.id) === Number(val.comment_id)) {
            item.comment_state = Number(val.state);
            return true;
          }
        });
        return item;
      });
    } else {
      arr = map(rows, (item) => {
        item.comment_state = false;
        return item;
      });
    }
    return {
      ...comments,
      rows: arr,
      offset,
      limit
    };
  }

  /**
   * 根据标签获取对应的文章
   * @param {*} tagId
   * @param {*} offset
   * @param {*} limit
   * @returns
   * @memberof Art
   */
  async getBlogsByTagId (tagId, offset, limit) {
    const tags = await BlogTag.findAll({
      attributes: ['id', 'blog_id'],
      where: {
        tag_id: tagId,
        delete_time: null
      }
    });
    let ids = [];
    each(tags, (item) => {
      ids.push(item.blog_id);
    });

    const blogs = await Blog.findAndCountAll({
      attributes: {
        exclude: ['content', 'classify_id']
      },
      where: {
        delete_time: null,
        id: {
          [Sequelize.Op.in]: ids
        }
      },
      distinct: true,
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'username', 'avatar', 'create_time'],
        association: Blog.hasOne(User, {
          foreignKey: 'id',
          sourceKey: 'uid'
        })
      },
      {
        model: Classify,
        attributes: ['id', 'name', 'path'],
        association: Blog.hasOne(Classify, {
          foreignKey: 'id',
          sourceKey: 'classify_id'
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

    const rows = blogs.rows;
    let arr = [];
    if (blogs) {
      const ids = Art._getIds(rows);
      const comments = await Comment.findAll({
        attributes: ['blog_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: 'blog_id',
        raw: true,
        where: {
          delete_time: null,
          blog_id: {
            [Sequelize.Op.in]: ids
          }
        }
      });

      arr = map(rows, (item) => {
        item.comment_nums = 0;
        some(comments, (val) => {
          if (Number(item.id) === Number(val.blog_id)) {
            item.comment_nums = val.count;
            return true;
          }
        });
        return item;
      });
    } else {
      arr = map(rows, (item) => {
        item.comment_nums = 0;
        return item;
      });
    }

    return {
      ...blogs,
      rows: arr,
      offset,
      limit
    };
  }

  /**
   * 获取用户所有评论
   * @param {*} uid
   * @memberof Art
   */
  async getUserComments (uid) {
    const comments = await Comment.findAll({
      attributes: ['id', 'blog_id', 'content', 'create_time'],
      where: {
        uid,
        delete_time: null
      }
    });

    let arr = [];
    each(comments, (item) => {
      arr.push(item.blog_id);
    });
    const blogIds = uniq(arr);

    const blogs = await Blog.findAll({
      attributes: ['id', 'title'],
      where: {
        delete_time: null,
        id: {
          [Sequelize.Op.in]: blogIds
        }
      }
    });

    const commentList = map(blogs, (blog) => {
      if (!blog.comment_list || !isArray(blog.comment_list)) {
        blog.comment_list = [];
      }
      each(comments, (comment) => {
        if (Number(blog.id) === Number(comment.blog_id)) {
          blog.comment_list.push({
            id: comment.id,
            content: comment.content,
            create_time: comment.create_time
          });
        }
      });
      return blog;
    });

    return commentList;
  }
}

module.exports = {
  Art
};
