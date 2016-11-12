
const tap = require('tap');
const {
  createFieldUpdateParams,
  createFieldsUpdateParams
} = require('./index');

const timestamp = Date.now();

tap.test('createFieldUpdateParams should set a field when a non-empty value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: 'Bar'
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'SET #field = :value, #updatedOn = :now',
    ExpressionAttributeValues: { ':value': 'Bar', ':now': `${timestamp}` }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldUpdateParams should remove a field when an empty value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: ''
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
    ExpressionAttributeValues: { ':now': `${timestamp}` }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldUpdateParams should set a field to a filtered value when an empty nested value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: { Please: 'keep', me: 'and', please: ['remove', 'my', 'sibling', [{ a: '1' }], ''], x1: {}, x2: null, x3: 2 }
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'SET #field = :value, #updatedOn = :now',
    ExpressionAttributeValues: {
      ':value': { Please: 'keep', me: 'and', please: ['remove', 'my', 'sibling', [{ a: '1' }]], x3: 2 },
      ':now': `${timestamp}`
    }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldUpdateParams should remove a field when a null-ish value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: null
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
    ExpressionAttributeValues: { ':now': `${timestamp}` }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldUpdateParams should remove a field when an empty array value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: []
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
    ExpressionAttributeValues: { ':now': `${timestamp}` }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldUpdateParams should remove a field when an empty object value is provided', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    fieldName: 'Foo',
    fieldValue: {}
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: { '#field': `Foo`, '#updatedOn': 'UpdatedOn' },
    UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
    ExpressionAttributeValues: { ':now': `${timestamp}` }
  };
  const actual = createFieldUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldsUpdateParams', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    item: { a: 'b', c: 3, d: [] }
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: {
      '#updatedOn': 'UpdatedOn',
      '#field0': `a`,
      '#field1': `c`,
      '#field2': `d`
    },
    UpdateExpression: 'REMOVE #field2 SET #updatedOn=:now, #field0=:value0, #field1=:value1',
    ExpressionAttributeValues: {
      ':now': `${timestamp}`,
      ':value0': 'b',
      ':value1': 3
    }
  };
  const actual = createFieldsUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});

tap.test('createFieldsUpdateParams', t => {
  const params = {
    timestamp,
    tableName: 'XXX',
    keySchema: { Id: '123' },
    item: {
      a: 'b',
      b: { foo: ['bar'] },
      c: 3,
      d: [], // this empty list is removed
      e: {}, // this empty set is removed
      f: [{ x: '' }] // this empty object is removed
    }
  };
  const expected = {
    TableName: 'XXX',
    ReturnValues: 'ALL_NEW',
    Key: { Id: '123' },
    ExpressionAttributeNames: {
      '#updatedOn': 'UpdatedOn',
      '#field0': `a`,
      '#field1': `b`,
      '#field2': `c`,
      '#field3': `d`,
      '#field4': `e`,
      '#field5': `f`
    },
    UpdateExpression: 'REMOVE #field3, #field4, #field5 SET #updatedOn=:now, #field0=:value0, #field1=:value1, #field2=:value2',
    ExpressionAttributeValues: {
      ':now': `${timestamp}`,
      ':value0': 'b',
      ':value1': { foo: ['bar'] },
      ':value2': 3
    }
  };
  const actual = createFieldsUpdateParams(params);
  t.deepEqual(actual, expected);
  t.end();
});
