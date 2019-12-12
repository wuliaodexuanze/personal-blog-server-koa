require('./initial');
const { db } = require('lin-mizar/lin/db');
const { Blog } = require('../../app/models/blog');

const run = async () => {
  await Blog.bulkCreate();
  db.close();
};

run();
