'use strict';

module.exports = {
  file: {
    storeDir: 'app/assets',
    singleLimit: 1024 * 1024 * 2,
    totalLimit: 1024 * 1024 * 20,
    nums: 10,
    include: ['.jpg', '.jpeg', '.gif', '.png', '.svg']
  },
  qiniu: {
    bucket: 'personal-blog-img',
    img: '',
    AK: '',
    SK: ''
  }
};
