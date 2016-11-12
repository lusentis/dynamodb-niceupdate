
const { filter } = require('./filter');

const shouldRemove = module.exports.shouldRemove = value => {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string' && value.length === 0) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  return false;
};

const shouldKeep = module.exports.shouldKeep = value => !shouldRemove(value);

module.exports.createFieldUpdateParams = function createFieldUpdateParams ({
  tableName,
  keySchema,
  fieldName,
  fieldValue,
  timestamp = Date.now()
}) {
  let updateParams = {
    TableName: tableName,
    ReturnValues: 'ALL_NEW',
    Key: keySchema,
    ExpressionAttributeNames: { '#field': `${fieldName}`, '#updatedOn': 'UpdatedOn' }
  };
  const cleanValue = filter(shouldKeep)(fieldValue);
  if (shouldRemove(cleanValue)) {
    updateParams = {
      ...updateParams,
      UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
      ExpressionAttributeValues: { ':now': `${timestamp}` }
    };
  } else {
    updateParams = {
      ...updateParams,
      UpdateExpression: 'SET #field = :value, #updatedOn = :now',
      ExpressionAttributeValues: { ':value': cleanValue, ':now': `${timestamp}` }
    };
  }
  return updateParams;
};

module.exports.createFieldsUpdateParams = function createFieldsUpdateParams ({
  tableName,
  keySchema,
  item,
  timestamp = Date.now()
}) {
  let updateExpression = '';
  let attiributeNames = { '#updatedOn': 'UpdatedOn' };
  let attiributeValues = { ':now': `${timestamp}` };
  let removes = [];
  let sets = [['#updatedOn', ':now']];

  Object.keys(item).forEach((key, index) => {
    const nameKey = `#field${index}`;
    const valueKey = `:value${index}`;
    const value = filter(shouldKeep)(item[key]);
    attiributeNames = {
      ...attiributeNames,
      [nameKey]: key
    };
    if (shouldKeep(value)) {
      attiributeValues = {
        ...attiributeValues,
        [valueKey]: value
      };
      sets = [...sets, [nameKey, valueKey]];
    } else {
      removes = [...removes, nameKey];
    }
  });

  if (removes.length > 0) {
    updateExpression = `${updateExpression}REMOVE ${removes.join(', ')} `;
  }

  if (sets.length > 0) {
    updateExpression = `${updateExpression}SET ${sets.map(([k, v]) => `${k}=${v}`).join(', ')} `;
  }

  let updateParams = {
    TableName: tableName,
    ReturnValues: 'ALL_NEW',
    Key: keySchema,
    ExpressionAttributeNames: attiributeNames,
    ExpressionAttributeValues: attiributeValues,
    UpdateExpression: updateExpression.trim()
  };

  return updateParams;
};
