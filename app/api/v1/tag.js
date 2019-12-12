'use strict';

const {
  LinRouter,
  adminRequired,
  disableLoading
} = require('lin-mizar');
const { PositiveIdValidator } = require('../../validators/common');
const {
  Art
} = require('../../dao/art');
const { TagDao } = require('../../dao/tag');
const {
  CreateOrUpdateTagValidator,
  TagSearchValidator
} = require('../../validators/tag');
const { getSafeParamId } = require('../../libs/util');
const { DataNotFound } = require('../../libs/err-code');

const tagApi = new LinRouter({
  prefix: '/v1/tag'
});

const tagDao = new TagDao();
const art = new Art();

/**
 * 添加标签
 */
tagApi.linPost('addTag', '/', {
  auth: '添加标签',
  module: '标签',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx);
  await tagDao.createTag(v);
  ctx.success({
    msg: '添加标签成功'
  });
});

/**
 * 删除标签
 */
tagApi.linDelete('deleteTag', '/:id', {
  auth: '删除标签',
  module: '标签',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await tagDao.deleteTag(id);
  ctx.success({
    msg: '删除标签成功'
  });
});

/**
 * 编辑标签
 */
tagApi.linPut('updateTag', '/:id', {
  auth: '编辑标签',
  module: '标签',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateTagValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await tagDao.updateTag(v, id);
  ctx.success({
    msg: '更新标签成功'
  });
});

/**
 * 标签搜索
 */
tagApi.get('/search', async ctx => {
  const v = await new TagSearchValidator().validate(ctx);
  const book = await tagDao.getTagByKeyword(v.get('query.q'));
  if (!book) {
    throw new DataNotFound({
      msg: '没有查到相关的标签信息'
    });
  }
  ctx.json(book);
});

/**
 * 获取标签
 */
tagApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const tag = await tagDao.getTag(v.get('path.id'));
  ctx.json(tag);
});

/**
 * 通过标签获取对应的所有博客文章
 */
tagApi.get('/:id/blog', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const blogs = await art.getBlogsByTagId(v.get('path.id'), offset, limit);

  ctx.json(blogs);
});

/**
 * 获取所有标签
 */
tagApi.get('/', async ctx => {
  const tags = await tagDao.getTags();
  ctx.json(tags);
});

module.exports = { tagApi, [disableLoading]: false };
