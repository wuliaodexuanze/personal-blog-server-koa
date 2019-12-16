手里有糖个人博客
=================

* [手里有糖个人博客](#%E6%89%8B%E9%87%8C%E6%9C%89%E7%B3%96%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2)
  * [个人博客简介](#%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E7%AE%80%E4%BB%8B)
    * [线上Demo](#%E7%BA%BF%E4%B8%8Ademo)
    * [完成功能](#%E5%AE%8C%E6%88%90%E5%8A%9F%E8%83%BD)
    * [获取项目工程](#%E8%8E%B7%E5%8F%96%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B)
    * [安装依赖包](#%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96%E5%8C%85)
    * [数据库配置](#%E6%95%B0%E6%8D%AE%E5%BA%93%E9%85%8D%E7%BD%AE)
    * [项目启动](#%E9%A1%B9%E7%9B%AE%E5%90%AF%E5%8A%A8)
  * [其他文件](#%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6)
    * [状态码文件](#%E7%8A%B6%E6%80%81%E7%A0%81%E6%96%87%E4%BB%B6)



## 个人博客简介

开发框架借鉴了 [Lin-CMS-Koa](https://github.com/TaleLin/lin-cms-koa) ，在这里非常感谢。

### 线上Demo

[手里有糖个人博客](http://wayne.whgjh.top)
[手里有糖个人博客CMS](http://sugar.whgjh.top)

### 完成功能

- 1、博客首页

- 2、前端

- 3、服务端
- 4、关于
- 5、文章列表
- 6、文章详情
- 7、标签
- 8、用户中心
- 9、用户评论
- 10、用户收藏
- 11、用户评论支持
- 12、我的收藏
- 13、我的评论

### 获取项目工程

``` shell
git clone https://github.com/wuliaodexuanze/personal-blog-server-koa.git
```

### 安装依赖包

``` javascript
cd personal-blog-server-koa && npm install
```

如果你使用**yarn**

``` javascript
cd personal-blog-server-koa && yarn
```

### 数据库配置

需要你自己在 MySQL 中新建一个数据库，名字由你自己决定。例如，新建一个名为 personal-blog 的数据库，数据库字符编码设置为`utf-8mb4`。接着，我们需要在工程中进行一项 简单的配置。使用编辑器工程的`app/config/secure.js`，找到如下配置项：

``` javascript
db: {
    database: 'personal_blog',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    username: 'root',
    password: 'q350413177',
    logging: true,
    timezone: '+08:00'
  },
```

> 请在`db`这项中配置 MySQL 数据库的用户名、密码、ip、端口号与数据库名。**请务必根 据自己的实际情况修改此配置项**。

### 项目启动

一切就绪后，再次从命令行中使用命令运行项目 app 目录下的`starter.js`：

``` javascript
node app/starter.js
```

如果你喜爱 npm scripts 的方式来运行，那么输入如下命令：

``` javascript
npm run start:dev
```

如果一切顺利，你将在命令行中看到项目成功运行的信息。如果你没有修改代码，Lin 将默 认在本地启动一个端口号为 5000 的端口用来监听请求。此时，我们访 问http://localhost:5000，将看到一组字符：



“手里有糖"



这证明你已经成功的将项目运行起来了。



欣喜之余，请你运行一下根目录下的`tests/helper/add_super.js`文件，我们会为在数据 库中新建一个超级管理员账户，方便你后续在前端登陆。

``` javascript
node tests/helper/add_super.js
```

> 执行之后会默认创建一个，账号：super, 密码为：123456 的账户。

如果你安装遇到问题，可以参考 [Lin-CMS-Koa](http://doc.cms.7yue.pro/lin/start/) 文档，或者联系我。

## 其他文件

### 状态码文件

``` javascript
app/code.md
```

