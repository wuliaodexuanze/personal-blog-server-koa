'use strict';

const {
  NotFound,
  Forbidden,
  ParametersException
} = require('lin-mizar');
const { Classify } = require('../models/classify');
const Sequelize = require('sequelize');

class ClassifyDao {
  /**
   * 创建标签
   * @param {*} name 标签名
   */
  async createClassify (v) {
    const name = v.get('body.name');
    const classify = await Classify.findOne({
      where: {
        name,
        delete_time: null
      }
    });
    if (classify) {
      throw new Forbidden({
        msg: '标签已存在'
      });
    }
    const cls = new Classify();
    cls.name = name;
    cls.path = v.get('body.path');
    cls.desc = v.get('body.desc') || '';
    const ret = await cls.save();

    return ret;
  }

  /**
   * 删除标签
   * @param {*} id 标配id
   */
  async deleteClassify (id) {
    const classify = await Classify.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!classify) {
      throw new NotFound({
        msg: '没有找到相关的分类'
      });
    }
    await classify.destroy({
      force: true
    });
    return classify;
  }

  /**
   * 编辑标签
   * @param {*} v 主题内容
   * @param {*} id 标签id
   */
  async updateClassify (v, id) {
    const classify = await Classify.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!classify) {
      throw new NotFound({
        msg: '没有找到相关分类'
      });
    }

    const name = v.get('body.name');
    // 排除修改时，添加与存在标签名一样的链接
    const rCls = await Classify.findOne({
      where: {
        name,
        delete_time: null,
        id: {
          [Sequelize.Op.not]: id
        }
      }
    });
    if (rCls) {
      throw new ParametersException({
        msg: '名称以存在'
      });
    }

    classify.name = name;
    classify.path = v.get('body.path');
    classify.desc = v.get('body.desc') || '';
    const ret = await classify.save();
    return ret;
  }

  /**
   * 通过id获取分类
   * @param {*} id 分类id
   */
  async getClassify (id) {
    const classify = await Classify.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return classify;
  }

  /**
   * 获取分类列表
   */
  async getClassifys () {
    const classifys = await Classify.findAll({
      where: {
        delete_time: null
      }
    });

    return classifys;
  }
}

module.exports = {
  ClassifyDao
}
