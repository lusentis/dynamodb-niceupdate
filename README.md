dynamodb-niceupdate
===================

Creates DynamoDB's `DocumentClient.update()` param object that performs an update operation, using [`UpdateExpression`](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Modifying.html).
Any empty value will be recursively removed, to make [DynamoDB happy](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html).

![](https://nodei.co/npm/dynamodb-niceupdate.png?mini=true)   
[![Build Status](https://travis-ci.org/lusentis/dynamodb-niceupdate.svg?branch=master)](https://travis-ci.org/lusentis/dynamodb-niceupdate) 
[![Coverage Status](https://coveralls.io/repos/github/lusentis/dynamodb-niceupdate/badge.svg?branch=maste&maxAge=3600)](https://coveralls.io/github/lusentis/dynamodb-niceupdate?branch=master)


### Usage

```js
import { createFieldsUpdateParams } from 'dynamodb-niceupdate'

const params = createFieldsUpdateParams({
  tableName: 'DynamoDB_Table_name',
  keySchema: { Id: '123' },
  item: {
    a: 'b',
    b: { foo: ['bar'] },
    c: 3,
    d: [], // this empty list is removed
    e: {}, // this empty set is removed
    f: [{ x: '' }], // this empty object is removed
  }
})

assert.deepEqual(params, {
  TableName: 'DynamoDB_Table_name',
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
})

const doc = new DynamoDB.DocumentClient({})
doc.update(params, callback)
```

Checkout the tests in [`src/index.spec.js`](src/index.spec.js).
