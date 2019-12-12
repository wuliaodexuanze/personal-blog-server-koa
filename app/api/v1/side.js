'use strict';

const {
  LinRouter,
  disableLoading
} = require('lin-mizar');
const { Art } = require('../../dao/art');

const tagApi = new LinRouter({
  prefix: '/v1/side'
});

const art = new Art();

/**
 * 获取所有标签
 */
tagApi.get('/', async ctx => {
  const sides = await art.getSide();
  ctx.json(sides);
});

module.exports = { tagApi, [disableLoading]: false };
