'use strict';

const {
  LinRouter,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const {
  PositiveIdValidator
} = require('../../validators/common');
const { FavorDao } = require('../../dao/favor');
const { Art } = require('../../dao/art');

const favorApi = new LinRouter({
  prefix: '/v1/favor'
});

const favorDao = new FavorDao();
const art = new Art();

/**
 * 收藏
 */
favorApi.linPost('favor', '/', {
  auth: '文章收藏',
  module: '收藏',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await favorDao.like(v.get('body.id'), uid);
  ctx.success({
    msg: '收藏成功'
  });
});

/**
 * 取消收藏
 */
favorApi.linPost('favorCancle', '/cancel', {
  auth: '取消收藏',
  module: '收藏',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await favorDao.dislike(v.get('body.id'), uid);
  ctx.success({
    msg: '取消收藏成功'
  });
});

/**
 * 获取当前所有收藏
 */
favorApi.linGet('getFavors', '/', {
  auth: '获取收藏列表',
  module: '收藏',
  mount: true
},
groupRequired,
async ctx => {
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const uid = ctx.currentUser.id;
  const q = ctx.query.q || '';
  const blogs = await art.getFavors(uid, offset, limit, q);
  ctx.json(blogs);
});

module.exports = {
  favorApi,
  [disableLoading]: false
};
