const crypto = require('crypto');

module.exports = class Utils {
  constructor() {}

  static Createhash (hash_string) {
    return crypto.createHash('sha256').update(hash_string).digest('base64');
  }

  static ObjectToBuffer(object) {
    return Buffer.from(JSON.stringify(object))
  }

  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
};
