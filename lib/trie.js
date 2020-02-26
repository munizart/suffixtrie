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
  const list = [...listable]
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

function Trie$prototype$add (suffix, data = suffix) {
  if (typeof suffix !== 'string' || !suffix) {
    throw TypeError('first argument must be a non-empty string')
  }
  let state = vault.get(this)
  suffix = [terminal, ...suffix]
  while (suffix[0]) {
    let last
    ;[suffix, last] = uncons(suffix)
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
  } while (rest[0] && pointer)

  return expand(pointer)
}

Trie.empty = Trie$empty
Trie.prototype.add = Trie$prototype$add
Trie.prototype.find = Trie$prototype$find

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
