
const test = require('tape');
const {
  createFieldUpdateParams
} = require('./index');

const timestamp = Date.now();

test('createFieldUpdateParams should set a field when a non-empty value is provided', t => {
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

test('createFieldUpdateParams should remove a field when an empty value is provided', t => {
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

test('createFieldUpdateParams should set a field to a filtered value when an empty nested value is provided', t => {
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

test('createFieldUpdateParams should remove a field when a null-ish value is provided', t => {
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

test('createFieldUpdateParams should remove a field when an empty array value is provided', t => {
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

test('createFieldUpdateParams should remove a field when an empty object value is provided', t => {
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
