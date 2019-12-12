'use strict';
const Sequelize = require('sequelize');
const {
  Forbidden,
  NotFound,
  ParametersException
} = require('lin-mizar');
const {
  Link
} = require('../models/link');

class LinkDao {
  /**
   * 创建博客
   * @param v
   * @returns {Promise<void>}
   */
  async createLink (v) {
    const link = await Link.findOne({
      where: {
        name: v.get('body.name'),
        delete_time: null
      }
    });
    if (link) {
      throw new Forbidden({
        msg: '链接已存在'
      });
    }
    const lk = new Link();
    lk.name = v.get('body.name');
    lk.path = v.get('body.path');
    lk.desc = v.get('body.desc') || '';
    const ret = await lk.save();
    return ret;
  }

  /**
   * 删除链接
   * @param {*} id
   * @returns
   * @memberof LinkDao
   */
  async deleteLink (id) {
    const link = await Link.findOne({
      where: {
        id
      }
    });
    if (!link) {
      throw new NotFound({
        msg: '没有找到相关链接'
      });
    }
    await link.destroy({
      force: true
    });
    return link;
  }

  /**
   * 更新链接
   * @param {*} v
   * @param {*} id
   * @memberof LinkDao
   */
  async updateLink (v, id) {
    const link = await Link.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!link) {
      throw new NotFound({
        msg: '没有找到相关链接'
      });
    }

    const name = v.get('body.name');

    // 排除修改时，添加与存在链接名一样的链接
    const rLink = await Link.findOne({
      where: {
        name,
        delete_time: null,
        id: {
          [Sequelize.Op.not]: id
        }
      }
    });
    if (rLink) {
      throw new ParametersException({
        msg: '名称以存在'
      });
    }

    link.name = name;
    link.path = v.get('body.path');
    link.desc = v.get('body.desc') || '';
    const ret = await link.save();
    return ret;
  }

  /**
   * 获取所有链接
   * @returns
   * @memberof LinkDao
   */
  async getLinks () {
    const links = Link.findAll({
      where: {
        delete_time: null
      }
    });
    return links;
  }

  /**
   * 获取指定连接
   * @param {*} id 链接id
   */
  async getLink (id) {
    const link = await Link.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return link;
  }
}

module.exports = {
  LinkDao
};
