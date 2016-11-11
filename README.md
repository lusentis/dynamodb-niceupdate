# dynamodb-niceupdate
Creates DynamoDB's `DocumentClient.update()` param object that performs an update operation, using [`UpdateExpression`](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Modifying.html).
Any empty value will be recursively removed, to make [DynamoDB happy](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html).

![](https://nodei.co/npm/dynamodb-niceupdate.png?mini=true)   
[![Build Status](https://travis-ci.org/lusentis/dynamodb-niceupdate.svg?branch=master)](https://travis-ci.org/lusentis/dynamodb-niceupdate) 
[![Coverage Status](https://coveralls.io/repos/github/lusentis/dynamodb-niceupdate/badge.svg?branch=maste&maxAge=3600)](https://coveralls.io/github/lusentis/dynamodb-niceupdate?branch=master)

No docs, for now. Checkout the tests in [`src/index.spec.js`](src/index.spec.js).
