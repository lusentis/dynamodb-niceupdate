
const test = require('tape');
const { filter } = require('./filter');
const { shouldKeep } = require('./index');

test('filter(shouldKeep) with primitive types', t => {
  const source = ['a', 'b', 2, 0, null, '', 'c'];
  const expected = ['a', 'b', 2, 0, 'c'];
  const actual = filter(shouldKeep)(source);
  t.deepEqual(actual, expected);
  t.end();
});

test('filter(shouldKeep) with nested objects types', t => {
  const source = [
    0,
    '',
    [],
    ['keep', 'me'],
    { and: 'me' },
    'and me',
    {}
  ];
  const expected = [
    0,
    ['keep', 'me'],
    { and: 'me' },
    'and me'
  ];
  const actual = filter(shouldKeep)(source);
  t.deepEqual(actual, expected);
  t.end();
});

test('filter(shouldKeep) with nested objects types / 2', t => {
  const source = [
    ['keep', 'me'],
    [{ keep: 'me' }, {}, 'and me'],
    [],
    {},
    { and: 'me' }
  ];
  const expected = [
    ['keep', 'me'],
    [{ keep: 'me' }, 'and me'],
    { and: 'me' }
  ];
  const actual = filter(shouldKeep)(source);
  t.deepEqual(actual, expected);
  t.end();
});

test('filter(shouldKeep) with nested objects types / 3', t => {
  const source = [
    ['keep', 'me'],
    [{ keep: 'me' }, { x: { a: 'b' } }, 'and me'],
    [],
    [{}],
    { and: 'me' }
  ];
  const expected = [
    ['keep', 'me'],
    [{ keep: 'me' }, { x: { a: 'b' } }, 'and me'],
    { and: 'me' }
  ];
  const actual = filter(shouldKeep)(source);
  t.deepEqual(actual, expected);
  t.end();
});

test('filter(shouldKeep) with nested objects types / 4', t => {
  const source = [
    ['keep', 'me'],
    [{ keep: 'me' }, { x: { a: 'b', c: [] } }, 'and me'],
    [{ a: '' }],
    [{}, ''],
    { and: 'me', also: ['', null, { y: [] }] }
  ];
  const expected = [
    ['keep', 'me'],
    [{ keep: 'me' }, { x: { a: 'b' } }, 'and me'],
    { and: 'me' }
  ];
  const actual = filter(shouldKeep)(source);
  t.deepEqual(actual, expected);
  t.end();
});
