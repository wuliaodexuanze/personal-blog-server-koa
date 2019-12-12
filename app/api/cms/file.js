'use strict';

const { LinRouter, ParametersException, loginRequired } = require('lin-mizar');
const { Qiniuyun } = require('../../extensions/file/qiniuyun');

const file = new LinRouter({
  prefix: '/cms/file'
});

file.linPost('upload', '/', {
  auth: '文件上传',
  module: '文件',
  mount: false
}, loginRequired, async ctx => {
  const files = await ctx.multipart();
  if (files.length < 1) {
    throw new ParametersException({ msg: '未找到符合条件的文件资源' });
  }
  const uploader = new Qiniuyun();
  const arr = await uploader.upload(files);
  ctx.json(arr);
});

module.exports = { file };
