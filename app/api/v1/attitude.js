'use strict';

const {
  LinRouter,
  groupRequired,
  disableLoading
} = require('lin-mizar');

const {
  AttitudeDao
} = require('../../dao/attitude');
const {
  AttitudeValidator
} = require('../../validators/attitude');

const attitudeApi = new LinRouter({
  prefix: '/v1/attitude'
});

const attitudeDao = new AttitudeDao();

/**
 * 支持
 */
attitudeApi.linPost('support', '/', {
  auth: '支持评论',
  module: '评论',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new AttitudeValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await attitudeDao.support(v.get('body.comment_id'), v.get('body.blog_id'), uid);
  ctx.success({
    msg: '支持操作成功'
  });
});

/**
 * 反对
 */
attitudeApi.linPost('oppose', '/cancel', {
  auth: '反对评论',
  module: '评论',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new AttitudeValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await attitudeDao.oppose(v.get('body.comment_id'), v.get('body.blog_id'), uid);
  ctx.success({
    msg: '反对操作成功'
  });
});

module.exports = {
  attitudeApi,
  [disableLoading]: false
};
