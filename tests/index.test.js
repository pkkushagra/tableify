const test = require('tape')
const tableify = require('../index')
const oneLine = require('oneline')
const safeGet = require('just-safe-get')

const items = [
  {
    name: 'Lipstick',
    vat_rate: 19,
    net: 6.58
  },
  {
    name: 'Shoelaces',
    vat_rate: 19,
    net: 7.34
  },
  {
    name: 'Apple',
    vat_rate: 7,
    net: 0.43
  }
]

test('can handle missing items', function(t) {
  t.equal(tableify(), undefined, 'returns undefined on missing items')
  t.end()
})

test('can create correct table without given headers', function(t) {
  const expected = oneLine`
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>vat_rate</th>
          <th>net</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lipstick</td>
          <td>19</td>
          <td>6.58</td>
        </tr>
        <tr>
          <td>Shoelaces</td>
          <td>19</td>
          <td>7.34</td>
        </tr>
        <tr>
          <td>Apple</td>
          <td>7</td>
          <td>0.43</td>
        </tr>
      </tbody>
    </table>
  `.replace(/ /g, '')

  t.equal(tableify(items), expected, 'correct html')
  t.end()
})

test('can create correct table with given headers and custom classes', function(t) {
  const expected = oneLine`
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>net</th>
        <th class="green">VAT</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="red">Lipstick</td>
        <td>6.58</td>
        <td>19</td>
      </tr>
      <tr>
        <td class="red">Shoelaces</td>
        <td>7.34</td>
        <td>19</td>
      </tr>
      <tr>
        <td class="red">Apple</td>
        <td>0.43</td>
        <td>7</td>
      </tr>
    </tbody>
  </table>
`.replace(/ /g, '')

  const map = {
    name: {
      custom: null,
      default: 'Product'
    },
    vat_rate: {
      custom: 'VAT',
      default: 'VAT Rate'
    },
    net: {
      custom: null
    }
  }

  const options = {
    headers: ['name', 'net', 'vat_rate'],
    bodyCellClass: function(row, col) {
      if (col === 'name') return 'red'
    },
    headerCellClass: function(row, col) {
      if (col === 'vat_rate') return 'green'
    },
    headerCellContent: function(row, col) {
      if (map[col]) {
        return map[col].custom || map[col].default
      }
    }
  }

  t.equal(tableify(items, options), expected, 'correct html')
  t.end()
})
