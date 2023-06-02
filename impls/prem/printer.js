const { MalValue } = require('./types.js');

const pr_str = (malValue) => {
  if (typeof malValue == 'function') {
    return '#<function>';
  }

  return (malValue instanceof MalValue) ?
    malValue.pr_str() : malValue.toString();
};

module.exports = { pr_str };
