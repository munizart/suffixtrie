const terminal: unique symbol = Symbol.for('@munizart/suffixtrie/terminal')

interface State {
  [terminal]?: string
  [k: string]: State
}

const vault = new WeakMap<object, State>()

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

class Trie {
  size = 0

  static empty () {
    const t = new Trie()
    vault.set(t, {})
    return t
  }

  add (suffix: string) {
    if (typeof suffix !== 'string' || !suffix) {
      throw TypeError('first argument must be a non-empty string')
    }
    let state = vault.get(this)
    let sux = Array.from(suffix)
    while (sux[0]) {
      let last
      ;[sux, last] = uncons(sux)
      state[last] = state[last] || {}
      state = state[last]
    }

    if (!state[terminal]) {
      this.size++
    }

    state[terminal] = suffix

    return this
  }

  find (suffix: string) {
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

  findExact (k: string) {
    if (typeof k !== 'string' || !k) {
      throw TypeError('first argument must be a non-empty string')
    }
    let [init, key] = uncons(k)
    let pointer = vault.get(this)
    do {
      pointer = pointer[key]
      ;[init, key] = uncons(init)
    } while (!Object.is(key, undefined) && pointer && pointer[key])

    if (
      Object.is(key, undefined) &&
      typeof pointer === 'object' &&
      terminal in pointer
    ) {
      return pointer[terminal]
    }
  }

  has (key: string) {
    if (typeof key !== 'string' || !key) {
      throw TypeError('first argument must be a non-empty string')
    }
    let [init, k] = uncons(key)
    let pointer = vault.get(this)
    let done = false
    do {
      pointer = pointer[k]
      ;[init, k] = uncons(init)
      done = Object.is(k, undefined)
    } while (!done && pointer && pointer[k])

    return done && typeof pointer === 'object' && terminal in pointer
  }
}

function expand (node: State) {
  return ((node &&
    entries(node).flatMap(([k, v]) => {
      if (k === terminal) {
        return [v as string]
      } else {
        return expand(v as State)
      }
    })) ||
    []) as string[]
}
const empty = Trie.empty
export { empty }
