const fc = require('fast-check')
const Trie = require('../lib/trie')

function overrideCommands () {
  const add = {
    run (model, trie) {
      model.size = 1
      model.count++
      trie.add('$')
    },
    check: () => true,
    toString: () => "add('$')"
  }

  const size = {
    run (model, trie) {
      expect(trie.size).toEqual(model.size)
    },
    check: () => true,
    toString: () => 'size'
  }

  const count = {
    run (model, trie) {
      expect(trie.find('$')[0].count).toEqual(model.count)
    },
    check: model => model.size > 0,
    toString: () => 'find()[0].count'
  }

  return [add, size, count].map(fc.constant)
}
overrideCommands.setup = () => ({
  real: Trie.empty(),
  model: { size: 0, count: 0 }
})

function suffixAddCommands () {
  const add = (/** @type {string} */ suffix) => ({
    run (model, trie) {
      trie.add(suffix)
      model.keys.push(suffix)
      model.keys.sort()
    },
    check: () => true,
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

  const size = fc.constant({
    check: () => true,
    toString: () => 'size',
    run (model, trie) {
      expect(trie.size).toEqual(new Set(model.keys).size)
    }
  })

  return [add, find]
    .map(cmd => fc.string(1, 10).map(s => cmd(s)))
    .concat([size])
}

suffixAddCommands.setup = () => ({
  real: Trie.empty(),
  model: { keys: [] }
})
module.exports.overrideCommands = overrideCommands
module.exports.suffixAddCommands = suffixAddCommands
