/**
 *  扩展userModel的示例
 *  如果你的数据库中，已经存在了lin_user这张表
 *  你使用扩展userModel后，或许不会生效，请先在数据库删除原来的lin_user
 *  然后再运行程序
 */
'use strict';

const { modelExtend } = require('lin-mizar/lin/factory');
const { UserInterface } = require('lin-mizar/lin/interface');
const { User } = require('lin-mizar');
const Sequelize = require('sequelize');

modelExtend(UserInterface, {
  openid: {
    type: Sequelize.STRING(64),
    allowNull: true
  },
  avatar: {
    // 用户默认生成图像，为null
    type: Sequelize.default.STRING({ length: 500 }),
    comment: '头像url',
    get () {
      // @ts-ignore
      return this.getDataValue('avatar')
    }
  }
});

module.exports = { User };
