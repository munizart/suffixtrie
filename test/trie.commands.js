const fc = require('fast-check')
const Trie = require('../lib/trie')

function allCommands () {
  const add = (/** @type {string} */ suffix) => ({
    run (model, trie) {
      trie.add(suffix)
      model.keys.push(suffix)
      model.keys.sort()
    },
    check: () => Boolean(suffix.trim()),
    toString: () => `add(${JSON.stringify(suffix)})`
  })

  const find = (/** @type {string} */ suffix) => ({
    run (model, trie) {
      const found = trie
        .find(suffix)
        .map(({ data }) => data)
        .sort()
      expect(found).toEqual(model.keys.filter(key => key.endsWith(suffix)))
    },
    check: () => true,
    toString: () => `find(${JSON.stringify(suffix)})`
  })

  const findExact = (/** @type {string} */ suffix) => ({
    run (model, trie) {
      const found = trie
        .findExact(suffix)
      expect(found && found.data).toEqual(model.keys.find(key => key === suffix))
    },
    check: () => true,
    toString: () => `findExact(${JSON.stringify(suffix)})`
  })

  const has = (/** @type {string} */ key) => ({
    run (model, trie) {
      const found = trie.has(key)
      expect(found).toEqual(model.keys.includes(key))
    },
    check: () => Boolean(key.trim()),
    toString: () => `has(${JSON.stringify(key)})`
  })

  const size = fc.constant({
    check: () => true,
    toString: () => 'size',
    run (model, trie) {
      expect(trie.size).toEqual(new Set(model.keys).size)
    }
  })

  return [add, find, findExact, has]
    .map(cmd => fc.string(1, 10).map(s => cmd(s)))
    .concat([size])
}

allCommands.setup = () => ({
  real: Trie.empty(),
  model: { keys: [] }
})

module.exports.allCommands = allCommands
