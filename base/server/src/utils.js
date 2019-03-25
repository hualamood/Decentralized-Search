const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

module.exports = class Utils {
  constructor() {}

  static Createhash(hash_string) {
    return crypto.createHash('sha256').update(hash_string).digest("hex");
  }

  static ObjectToBuffer(object) {
    return Buffer.from(JSON.stringify(object))
  }

  static GenID() {
    return uuidv4();
  }
};
