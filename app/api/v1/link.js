'use strict';

const {
  LinRouter,
  disableLoading,
  adminRequired
} = require('lin-mizar');
const {
  LinkDao
} = require('../../dao/link');
const {
  PositiveIdValidator
} = require('../../validators/common');
const {
  CreateOrUpdateLinkValidator
} = require('../../validators/link');
const {
  getSafeParamId
} = require('../../libs/util');

const linkApi = new LinRouter({
  prefix: '/v1/link'
});
const linkDao = new LinkDao();

/**
 * 添加链接
 */
linkApi.linPost('addLink', '/', {
  auth: '添加链接',
  module: '链接',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateLinkValidator().validate(ctx);
  await linkDao.createLink(v);
  ctx.success({
    msg: '添加链接成功'
  });
});

/**
 * 删除链接
 */
linkApi.linDelete('deleteLink', '/:id', {
  auth: '删除链接',
  module: '链接',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await linkDao.deleteLink(id);
  ctx.success({
    msg: '删除链接成功'
  });
});

/**
 * 编辑链接
 */
linkApi.linPut('updateLink', '/:id', {
  auth: '编辑链接',
  module: '链接',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateLinkValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await linkDao.updateLink(v, id);
  ctx.success({
    msg: '更新链接成功'
  });
});

/**
 * 获取所有链接
 */
linkApi.get('/', async ctx => {
  const links = await linkDao.getLinks();
  ctx.json(links);
});

/**
 * 通过指定连接
 */
linkApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const link = await linkDao.getLink(v.get('path.id'));
  ctx.json(link);
});

module.exports = { linkApi, [disableLoading]: false };
