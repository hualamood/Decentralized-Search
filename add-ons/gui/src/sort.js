const Sort = require('fast-sort')

module.exports = class DupSort {
   constructor(arr) {
      this.arr = arr
      this.values = []
   }

   add(val) {
    return new Promise(resolve => {
      if (this.values.includes(val)) {
        let pos = this.values.indexOf(val)
        this.arr[pos].count = this.arr[pos].count + 1
      } else {
         this.arr.push({'val':val, count: 1})
         this.values.push(val)
      }
      resolve(Sort(this.arr).asc(u => u.count))
    })
   }
}
