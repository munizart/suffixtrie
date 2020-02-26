const Trie = require('../lib/trie')
const fc = require('fast-check')
const { overrideCommands, suffixAddCommands } = require('./trie.commands')

describe('=== Trie.js ===', () => {
  describe('.empty()', () => {
    test('must construct a trie', () => {
      const emptrie = Trie.empty()
      expect(emptrie).toBeInstanceOf(Trie)
    })

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

  describe('#add', () => {
    test('override commands', () => {
      fc.assert(
        fc.property(
          fc.commands(overrideCommands()),
          cmds => {
            fc.modelRun(overrideCommands.setup, cmds)
          }
        )
      )
    })

    test('add trie commands', () => {
      fc.assert(
        fc.property(
          fc.commands(suffixAddCommands()),
          cmds => {
            fc.modelRun(suffixAddCommands.setup, cmds)
          }
        )
      )
    })
  })
})
