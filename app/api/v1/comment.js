'use strict';

const {
  LinRouter,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const {
  PositiveIdValidator
} = require('../../validators/common');
const {
  CreateOrUpdateCommentValidator
} = require('../../validators/comment');
const { CommentDao } = require('../../dao/comment');
const { UserInfo } = require('../../moddleware');
const {
  Art
} = require('../../dao/art');

const art = new Art();

const commentApi = new LinRouter({
  prefix: '/v1/comment'
});

const commentDao = new CommentDao();

/**
 * 添加评论
 */
commentApi.linPost('addComment', '/', {
  auth: '添加评论',
  module: '评论',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new CreateOrUpdateCommentValidator().validate(ctx);
  const uid = ctx.currentUser.id;
  await commentDao.createComment(v, uid);
  ctx.success({
    msg: '添加评论成功'
  });
});

/**
 * 删除评论
 */
commentApi.linDelete('deleteComment', '/:id', {
  auth: '删除评论',
  module: '评论',
  mount: true
},
groupRequired,
async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await commentDao.deleteComment(id);
  ctx.success({
    msg: '删除评论成功'
  });
});

/**
 * 获取文章对应的所有评论
 */
commentApi.get('/blog/:id', new UserInfo().m, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx);
  const uid = ctx.currentUser && ctx.currentUser.id;
  const id = v.get('path.id');
  const offset = Number(ctx.query.offset) || 0;
  const limit = Number(ctx.query.limit) || 10;
  const comments = await art.getBlogComments(uid, id, offset, limit);

  ctx.json(comments);
});

/**
 * 获取指定用户评论列表
 */
commentApi.linGet('getComments', '/', {
  auth: '获取评论列表',
  module: '评论',
  mount: true
},
groupRequired,
async ctx => {
  const uid = ctx.currentUser.id;
  const comments = await art.getUserComments(uid);
  ctx.json(comments);
});

module.exports = {
  commentApi,
  [disableLoading]: false
};