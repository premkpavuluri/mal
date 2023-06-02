const { MalNil, MalVector, MalValue } = require("./types");

const isTrue = (arg) => {
  if (arg === 0) {
    return true;
  }

  return !(arg instanceof MalNil) && arg.value || arg instanceof MalVector;
};

const areArraysEqual = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let index = 0; index < array1.length; index++) {
    if (!areEqual(array1[index], array2[index])) {
      return false;
    }
  }

  return true;
};

const areEqual = function (a, b) {
  const element1 = a instanceof MalValue ? a.value : a;
  const element2 = b instanceof MalValue ? b.value : b;

  if (Array.isArray(element1) && Array.isArray(element2)) {
    return areArraysEqual(element1, element2)
  }
  return element1 === element2;
};

module.exports = { areEqual, isTrue };
