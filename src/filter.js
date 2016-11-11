
const filterArray = module.exports.filterArray = callback => arr => {
  const ret = [];
  arr.forEach(val => {
    if (callback(val)) {
      if (typeof val === 'object') {
        const filtered = filter(callback)(val);
        if (callback(filtered)) {
          ret.push(filtered);
        }
      } else {
        ret.push(val);
      }
    }
  });
  return ret;
}

const filterObjectValues = module.exports.filterObjectValues = callback => object => {
  const ret = {};
  Object.keys(object).forEach(key => {
    const val = object[key];
    if (callback(val)) {
      if (typeof val === 'object') {
        const filtered = filter(callback)(val);
        if (callback(filtered)) {
          ret[key] = filtered;
        }
      } else {
        ret[key] = val;
      }
    }
  });
  return ret;
};

const filter = module.exports.filter = callback => what => {
  if (Array.isArray(what)) {
    return filterArray(callback)(what);
  }
  if (typeof what === 'object' && what !== null) {
    return filterObjectValues(callback)(what);
  }
  return what;
  // if (callback(what)) {
  //   return true;
  // }
  // return false;
}