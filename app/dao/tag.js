'use strict';

const {
  NotFound,
  Forbidden,
  ParametersException
} = require('lin-mizar');
const { Tag } = require('../models/tag');
const Sequelize = require('sequelize');

class TagDao {
  /**
   * 创建标签
   * @param {*} v
   * @returns
   * @memberof TagDao
   */
  async createTag (v) {
    const name = v.get('body.name');
    const tag = await Tag.findOne({
      where: {
        name,
        delete_time: null
      }
    });
    if (tag) {
      throw new Forbidden({
        msg: '标签名已存在'
      });
    }
    const tg = new Tag();
    tg.name = name;
    tg.desc = v.get('body.desc') || '';
    const ret = await tg.save();
    return ret;
  }

  /**
   * 删除标签
   * @param {*} id 标配id
   */
  async deleteTag (id) {
    const tag = await Tag.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!tag) {
      throw new NotFound({
        msg: '没有找到相关的标签'
      });
    }
    await tag.destroy({
      force: true
    });
    return tag;
  }

  /**
   * 编辑标签
   * @param {*} v 主题内容
   * @param {*} id 标签id
   */
  async updateTag (v, id) {
    const tag = await Tag.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!tag) {
      throw new NotFound({
        msg: '没有找到相关标签'
      });
    }
    const name = v.get('body.name');

    // 排除修改时，添加与存在标签名一样的链接
    const rTag = await Tag.findOne({
      where: {
        name,
        delete_time: null,
        id: {
          [Sequelize.Op.not]: id
        }
      }
    });
    if (rTag) {
      throw new ParametersException({
        msg: '名称以存在'
      });
    }
    tag.name = v.get('body.name');
    tag.desc = v.get('body.desc') || '';
    const ret = await tag.save();
    return ret;
  }

  /**
   * 通过关键字查询标签
   * @param {*} q 关键字
   */
  async getTagByKeyword (q) {
    const tags = await Tag.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${q}%`
        },
        delete_time: null
      }
    });
    return tags;
  }

  /**
   * 获取所有标签
   * @returns
   * @memberof TagDao
   */
  async getTags () {
    const tags = await Tag.findAll({
      where: {
        delete_time: null
      }
    });

    return tags;
  }

  /**
   * 获取标签
   * @param {*} id
   * @memberof TagDao
   */
  async getTag (id) {
    const tag = await Tag.findOne({
      where: {
        id,
        delete_time: null
      }
    });

    return tag;
  }
}

module.exports = {
  TagDao
};
