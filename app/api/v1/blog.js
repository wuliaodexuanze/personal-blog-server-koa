'use strict';

const {
  LinRouter,
  disableLoading,
  adminRequired
} = require('lin-mizar');
const {
  BlogDao
} = require('../../dao/blog');
const {
  Art
} = require('../../dao/art');
const {
  PositiveIdValidator
} = require('../../validators/common');
const {
  CreateOrUpdateBlogValidator
} = require('../../validators/blog');
const {
  getSafeParamId
} = require('../../libs/util');
const { UserInfo } = require('../../moddleware');

const blogApi = new LinRouter({
  prefix: '/v1/blog'
});
const blogDao = new BlogDao();
const art = new Art();

/**
 * 添加文章
 */
blogApi.linPost('addBlog', '/', {
  auth: '添加文章',
  module: '文章',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateBlogValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await blogDao.createBlog(v, uid);
  ctx.success({
    msg: '添加文章成功'
  });
});

/**
 * 删除文章
 */
blogApi.linDelete('deleteBlog', '/:id', {
  auth: '删除文章',
  module: '文章',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await blogDao.deleteBlog(id);
  ctx.success({
    msg: '删除文章成功'
  });
});

/**
 * 置顶文章
 */
blogApi.linPost('topBlog', '/:id/top', {
  auth: '置顶文章',
  module: '文章',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await blogDao.topBlog(id);
  ctx.success({
    msg: '置顶文章成功'
  });
});

/**
 * 取消置顶文章
 */
blogApi.linPost('camcelTopBlog', '/:id/top/cancel', {
  auth: '取消置顶文章',
  module: '文章',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await blogDao.topBlogCancel(id);
  ctx.success({
    msg: '取消置顶文章成功'
  });
});

/**
 * 编辑文章
 */
blogApi.linPut('updateBlog', '/:id', {
  auth: '编辑文章',
  module: '文章',
  mount: true
},
adminRequired,
async ctx => {
  const v = await new CreateOrUpdateBlogValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await blogDao.updateBlog(v, id);
  ctx.success({
    msg: '更新文章成功'
  });
});

/**
 * 通过置顶文章
 */
blogApi.get('/tops', async ctx => {
  const blogs = await blogDao.getBlogTops();
  ctx.json(blogs);
});

/**
 * 获取所有前端文章
 */
blogApi.get('/web', async ctx => {
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const q = ctx.query.q || '';
  const blogs = await art.getBlogList(offset, limit, q, '/web');
  ctx.json(blogs);
});

/**
 * 获取所有后端文章
 */
blogApi.get('/server', async ctx => {
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const q = ctx.query.q || '';
  const blogs = await art.getBlogList(offset, limit, q, '/server');
  ctx.json(blogs);
});

/**
 * 获取指定文章前后一篇文章
 */
blogApi.get('/:id/orso', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const blogs = await blogDao.getOrsoBlog(id);
  ctx.json(blogs);
});

/**
 * 获取指定文章前后一篇文章
 */
blogApi.get('/:id/favcount', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const blog = await blogDao.getFavorCount(id);
  ctx.json(blog);
});

/**
 * 通过指定文章
 */
blogApi.get('/:id', new UserInfo().m, async ctx => {
  // 用户登录则获取其id
  const uid = ctx.currentUser && ctx.currentUser.id;
  const v = await new PositiveIdValidator().validate(ctx);
  const blog = await art.getBlog(uid, v.get('path.id'));
  ctx.json(blog);
});

/**
 * 获取所有文章
 */
blogApi.get('/', async ctx => {
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const q = ctx.query.q || '';
  const blogs = await art.getBlogList(offset, limit, q);
  ctx.json(blogs);
});

module.exports = { blogApi, [disableLoading]: false };
