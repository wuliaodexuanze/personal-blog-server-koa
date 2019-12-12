const qiniu = require('qiniu');
const nanoid = require('nanoid');
const { Uploader } = require('lin-mizar/lin/file');
const { File } = require('lin-mizar');
const path = require('path');
const { qiniu: {
  bucket,
  img,
  AK,
  SK
} } = require('./config');

const mac = new qiniu.auth.digest.Mac(AK, SK);
const options = {
  scope: bucket
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

class Qiniuyun extends Uploader {
  static async _uploadToQiniu (data, key) {
    return new Promise((resolve, reject) => {
      formUploader.put(uploadToken, key, data, putExtra, (err, ret, info) => {
        if (err) {
          reject(err);
        } else {
          if (info.statusCode === 200) {
            resolve({ key });
          } else {
            reject(info);
          }
        }
      });
    });
  }
  /**
   * 处理文件对象
   * { size, encoding, fieldname, filename, mimeType, data }
   */
  async upload (files) {
    const arr = [];
    for (const file of files) {
      // 由于stream的特性，当读取其中的数据时，它的buffer会被消费
      // 所以此处深拷贝一份计算md5值
      const md5 = this.generateMd5(file);
      // 检查md5存在
      const exist = await File.findOne({
        where: {
          md5: md5
        }
      });
      if (exist) {
        arr.push({
          key: file.fieldname,
          id: exist.id,
          path: exist.path,
          url: `${img}/${exist.path}`
        });
      } else {
        const ext = path.extname(file.filename);
        const realName = nanoid() + ext;
        try {
          const imageData = await Qiniuyun._uploadToQiniu(file.data, realName);
          if (imageData.key) {
            const saved = await File.createRecord(
              {
                path: imageData.key,
                name: realName,
                extension: ext,
                size: file.size,
                md5: md5
              },
              true
            );
            arr.push({
              key: file.fieldname,
              id: saved.id,
              path: imageData.key,
              url: `${img}/${imageData.key}`
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return arr;
  }
}

module.exports = { Qiniuyun };
