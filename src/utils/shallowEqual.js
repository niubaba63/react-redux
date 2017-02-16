const hasOwn = Object.prototype.hasOwnProperty
/**
 * 浅相等比较
 * @param a
 * @param b
 * @returns {boolean}
 */

export default function shallowEqual(a, b) {
  if (a === b) return true

  let countA = 0
  let countB = 0
  
  for (let key in a) {
    if (hasOwn.call(a, key) && a[key] !== b[key]) return false
    countA++
  }

  for (let key in b) {
    if (hasOwn.call(b, key)) countB++
  }

  return countA === countB
}
