const { get } = require('lodash');
const {
  TokenType
} = require('lin-mizar');

class UserInfo {

  /**
   * 根据用户登录获取用户信息并返回
   *
   * @readonly
   * @memberof UserInfo
   */
  get m () {
    return async (ctx, next) => {
      // 此处借鉴了koa-jwt
      if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
          // Bearer 字段
          const scheme = parts[0];
          // token 字段
          const token = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const obj = ctx.jwt.verifyToken(token);
            if (get(obj, 'type') && get(obj, 'type') === TokenType.ACCESS && get(obj, 'scope') && get(obj, 'scope') === 'lin') {
              const user = await ctx.manager.userModel.findByPk(get(obj, 'identity'));
              if (user) {
                // 将user挂在ctx上
                ctx.currentUser = user;
              }
            }
          }
        }
      }
      await next();
    };
  }
}

module.exports = UserInfo;