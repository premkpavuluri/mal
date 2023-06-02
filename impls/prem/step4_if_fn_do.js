const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalVector, MalNil } = require('./types.js');
const { Env } = require('./env.js');
const { ns } = require('./core.js');
const { isTrue } = require('./utils.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const READ = (str) => read_str(str);

const defImplementation = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));

  return env.get(ast.value[1]);
};

const letImplementation = (ast, env) => {
  const letEnv = new Env(env);
  const bindingList = ast.value[1].value;
  for (let index = 0; index < bindingList.length; index += 2) {
    letEnv.set(bindingList[index], EVAL(bindingList[index + 1], letEnv));
  }

  const letBody = ast.value[2];
  return letBody ? EVAL(letBody, letEnv) : new MalNil();
};

const doImplementation = (ast, env) => {
  const [, ...doList] = ast.value;
  const evaluatedList = eval_ast(new MalList(doList), env).value;

  return evaluatedList[evaluatedList.length - 1];
};

const fnImplementation = (ast, env) => {
  return (...args) => {
    const fnParameters = ast.value[1].value;
    const fnBody = ast.value[2];
    if (args.length != fnParameters.length) {
      throw `Wrong number of args (${args.length}) passed to function`;
    }
    const newEnv = new Env(env, fnParameters, args);

    return EVAL(fnBody, newEnv);
  }
};

const ifImplementation = (ast, env) => {
  const [, condition, ifPart, elsePart] = ast.value;
  const condResult = EVAL(condition, env);

  if (isTrue(condResult)) {
    return ifPart ? EVAL(ifPart, env) : new MalNil();
  }

  return elsePart ? EVAL(elsePart, env) : new MalNil();
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);

  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!': return defImplementation(ast, env);
    case 'let*': return letImplementation(ast, env);
    case 'do': return doImplementation(ast, env);
    case 'if': return ifImplementation(ast, env);
    case 'fn*': return fnImplementation(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);

const rep = str => PRINT(EVAL(READ(str), env));

const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }

    repl();
  });

const env = new Env();

const main = () => {
  for (symbol in ns) {
    env.set(new MalSymbol(symbol), ns[symbol]);
  }

  repl();
};

main();
