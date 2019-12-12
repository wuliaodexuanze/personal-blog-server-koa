require('../helper/initial');
const { BlogDao } = require('../../app/api/v1/blog');
// const { CreateOrUpdateBookValidator } = require("../../app/validators/cms");
const { db } = require('lin-mizar/lin/db');

describe('blog.test.js', () => {
  /**
   * @type BlogDao
   */
  let blogDao;

  beforeAll(async () => {
    blogDao = new BlogDao();
  });

  afterAll(() => {
    setTimeout(() => {
      db.close();
    }, 500);
  });

  test('获取一篇文章', async () => {
    const blog = await blogDao.getBlog(1);
    expect(blog).not.toBe(undefined);
  });

  // test("创建书籍", async () => {
  //   // const ctx = context({
  //   //   url: "",
  //   //   body: {}
  //   // });
  //   const form = new CreateOrUpdateBookValidator();
  //   form.data.title = "平凡的程序";
  //   form.data.author = "pedro";
  //   form.data.summary = "~~~~~~~~~~~~~~~~~~~~~~~~~ a book";
  //   form.data.image = "$$$$$$$$$$$$$$$$$$$$$";
  //   await BlogDao.createBook(form);
  // });

  test('搜索一本书', async () => {
    const blog = await blogDao.getBlogByKeyword('koa');
    expect(blog).not.toBe(undefined);
  });

  test('获取所有书', async () => {
    const blogs = await blogDao.getBlogs();
    expect(blogs).not.toBe(undefined);
  });

  test('删除书籍', async () => {
    await blogDao.deleteBlog(1);
  });
});
