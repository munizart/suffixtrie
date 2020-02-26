const Trie = require('../lib/trie')
const fc = require('fast-check')

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
      expect(emptrie.find('')).toEqual([])
    })
  })

  describe('#add', () => {

  })
})
