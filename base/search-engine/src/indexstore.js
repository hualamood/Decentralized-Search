const si = require('search-index');

module.exports = class IndexStorage {
  constructor() {
    this.db = si({ name: 'searchbase' })
  }

  Put(item) {
    return new Promise((resolve, reject) => {
      this.db.PUT([item]).then(() => {
        resolve()
      })
    })
  }

  Search(query) {
    return new Promise((resolve, reject) => {
      this.db.SEARCH(query).then((result) => {
        resolve(result)
      })
    })
  }
}
