
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

module.exports.shouldKeep = value => !shouldRemove(value);

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
  if (shouldRemove(fieldValue)) {
    updateParams = {
      ...updateParams,
      UpdateExpression: 'REMOVE #field SET #updatedOn = :now',
      ExpressionAttributeValues: { ':now': `${timestamp}` }
    };
  } else {
    updateParams = {
      ...updateParams,
      UpdateExpression: 'SET #field = :value, #updatedOn = :now',
      ExpressionAttributeValues: { ':value': fieldValue, ':now': `${timestamp}` }
    };
  }
  return updateParams;
};
