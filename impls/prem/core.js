const { pr_str } = require("./printer");
const { MalList, MalNil, MalVector, MalBoolean } = require("./types");
const { areEqual, isTrue } = require("./utils");

const ns = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),
  'vector': (...args) => new MalVector(args),
  'list': (...args) => new MalList(args),
  'list?': (arg) => new MalBoolean(arg instanceof MalList),
  'vector?': (arg) => new MalBoolean(arg instanceof MalVector),
  'count': (arg) => arg instanceof MalNil ? 0 : arg.value.length,
  'empty?': (arg) => arg.value.length == 0,
  '<': (a, b) => new MalBoolean(a < b),
  '<=': (a, b) => new MalBoolean(a <= b),
  '>': (a, b) => new MalBoolean(a > b),
  '>=': (a, b) => new MalBoolean(a >= b),
  'not': (arg) => new MalBoolean(!isTrue(arg)),
  '=': (a, b) => new MalBoolean(areEqual(a, b)),

  'prn': (...args) => {
    console.log(args.map(element => pr_str(element)).join(' '));
    return new MalNil();
  },
  'str': (...args) => {
    return args.map(x => pr_str(x)).join(' ');
  }
};

module.exports = { ns };
