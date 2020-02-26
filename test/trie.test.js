const Trie = require('../lib/trie')
const fc = require('fast-check')
const { allCommands } = require('./trie.commands')

describe('=== Trie.js ===', () => {
  describe('.empty()', () => {
    test('Constructed tries must be diferent', () => {
      const emptrie1 = Trie.empty()
      const emptrie2 = Trie.empty()
      expect(emptrie1).not.toBe(emptrie2)
    })

    test('Constructed trie must be empty', () => {
      const emptrie = Trie.empty()
      expect(emptrie.size).toEqual(0)
    })
  })

  describe('model-based', () => {

    test('all commands', () => {
      fc.assert(
        fc.property(fc.commands(allCommands()), cmds => {
          fc.modelRun(allCommands.setup, cmds)
        })
      )
    })
  })
})
