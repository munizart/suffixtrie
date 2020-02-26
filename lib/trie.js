const terminal = Symbol.for('@munizart/suffixtrie/terminal')
const vault = new WeakMap()

function entries (obj) {
  return (
    Object.getOwnPropertySymbols(obj)
      // @ts-ignore
      .concat(Object.getOwnPropertyNames(obj))
      .map(k => [k, obj[k]])
  )
}

function uncons (listable) {
  const list = Array.isArray(listable) ? listable : [...listable]
  return [list.slice(0, -1), list[list.length - 1]]
}

function Trie () {
  if (Trie.caller !== Trie$empty) {
    throw new TypeError('Illegal constructor.')
  }
  this.size = 0
}
function Trie$empty () {
  const t = new Trie()
  vault.set(t, {})
  return t
}

/**
 * @param { string } suffix
 * @memberof Trie.prototype
 */
function Trie$prototype$add (suffix, data = suffix) {
  if (typeof suffix !== 'string' || !suffix) {
    throw TypeError('first argument must be a non-empty string')
  }
  let state = vault.get(this)
  let sux = [terminal, ...Array.from(suffix)]
  while (sux[0]) {
    let last
    ;[sux, last] = uncons(sux)
    state[last] = state[last] || {}
    state = state[last]
  }

  if (!state.count) {
    this.size++
  }

  state.data = data
  state.count = (state.count || 0) + 1
  return this
}

function Trie$prototype$find (suffix) {
  if (typeof suffix !== 'string' || !suffix) {
    throw TypeError('first argument must be a non-empty string')
  }
  let [rest, key] = uncons(suffix)
  let pointer = vault.get(this)
  do {
    pointer = pointer[key]
    ;[rest, key] = uncons(rest)
  } while (key && pointer)
  return expand(pointer)
}

function Trie$prototype$has (/** @type { string } */ k) {
  if (typeof k !== 'string' || !k) {
    throw TypeError('first argument must be a non-empty string')
  }
  let [init, key] = uncons(k)
  let pointer = vault.get(this)
  do {
    pointer = pointer[key]
    ;[init, key] = uncons(init)
  } while (!Object.is(key, undefined) && pointer && pointer[key])

  return Object.is(key, undefined) && typeof pointer === 'object' && terminal in pointer
}

function Trie$prototype$findExact (/** @type { string } */ k) {
  if (typeof k !== 'string' || !k) {
    throw TypeError('first argument must be a non-empty string')
  }
  let [init, key] = uncons(k)
  let pointer = vault.get(this)
  do {
    pointer = pointer[key]
    ;[init, key] = uncons(init)
  } while (!Object.is(key, undefined) && pointer && pointer[key])

  if (Object.is(key, undefined) && typeof pointer === 'object' && terminal in pointer) {
    return pointer[terminal]
  }
}

Trie.empty = Trie$empty
Trie.prototype.add = Trie$prototype$add
Trie.prototype.find = Trie$prototype$find
Trie.prototype.findExact = Trie$prototype$findExact
Trie.prototype.has = Trie$prototype$has

function expand (node) {
  return (
    (node &&
      entries(node).flatMap(([k, v]) => {
        if (k === terminal) {
          return [v]
        } else {
          return expand(v)
        }
      })) ||
    []
  )
}

module.exports = Trie
