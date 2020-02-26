const terminal = Symbol.for('@munizart/suffixtrie/terminal')
const vault = new WeakMap()

function entries (obj) {
  return Object.getOwnPropertySymbols(obj)
    .concat(Object.getOwnPropertyNames(obj))
    .map(k => [k, obj[k]])
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

function Trie$prototype$add (string, data = string) {
  if (typeof string !== 'string' || !string) {
    return
  }
  this.size++
  let state = vault.get(this)
  string = [terminal, ...string]
  while (string[0]) {
    let last
    ;[string, last] = uncons(string)
    state[last] = state[last] || {}
    state = state[last]
  }

  state.data = data
  state.count = (state.count || 0) + 1
  return this
}

function Trie$prototype$find (suffix) {
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
  return entries(node).flatMap(([k, v]) => {
    if (k === terminal) {
      return [v]
    } else {
      return expand(v)
    }
  })
}

module.exports = Trie
