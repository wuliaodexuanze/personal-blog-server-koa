'use strict';

const {
  LinRouter,
  adminRequired,
  disableLoading
} = require('lin-mizar');

const { ClassifyDao } = require('../../dao/classify');
const {
  CreateOrUpdateClassifyValidator
} = require('../../validators/classify');
const {
  PositiveIdValidator
} = require('../../validators/common');
const { getSafeParamId } = require('../../libs/util');

const classifyApi = new LinRouter({
  prefix: '/v1/classify'
});

const classifyDao = new ClassifyDao();

/**
 * 添加分类
 */
classifyApi.linPost('addClassify', '/', {
  auth: '添加分类',
  module: '分类',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateClassifyValidator().validate(ctx);
  await classifyDao.createClassify(v);
  ctx.success({
    msg: '添加分类成功'
  });
});

/**
 * 删除分类
 */
classifyApi.linDelete('deleteClassify', '/:id', {
  auth: '删除分类',
  module: '分类',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await classifyDao.deleteClassify(id);
  ctx.success({
    msg: '删除分类成功'
  });
});

/**
 * 编辑分类
 */
classifyApi.linPut('updateClassify', '/:id', {
  auth: '编辑分类',
  module: '分类',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateClassifyValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await classifyDao.updateClassify(v, id);
  ctx.success({
    msg: '更新分类成功'
  });
});

/**
 * 获取单个分类
 */
classifyApi.get('/:id', async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx);
  const tag = await classifyDao.getClassify(v.get('path.id'));
  ctx.json(tag);
});

/**
 * 获取指定分类下的所有文章
 */
classifyApi.get('/:classify_id/blog', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx, {
    id: 'classify_id'
  });
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const blogs = await classifyDao.getBlogsByClassifyId(v.get('path.classify_id'), offset, limit);
  ctx.json(blogs);
});

/**
 * 获取所有分类
 */
classifyApi.get('/', async ctx => {
  const classifys = await classifyDao.getClassifys();
  ctx.json(classifys);
});

module.exports = {
  classifyApi,
  [disableLoading]: false
};
