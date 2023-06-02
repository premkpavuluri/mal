const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalVector, MalFunction } = require('./types.js');
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

  return [ast.value[2], letEnv];
};

const doImplementation = (ast, env) => {
  const [, ...doForm] = ast.value;
  for (let index = 0; index < doForm.length - 1; index++) {
    EVAL(doForm[index], env);
  }

  return doForm[doForm.length - 1];
};

const fnImplementation = (ast, env) => {
  const [, fnParameters, ...body] = ast.value;
  const fnBody = new MalList([new MalSymbol('do'), ...body]);

  return new MalFunction(fnBody, fnParameters, env);
};

const ifImplementation = (ast, env) => {
  const [, condition, ifPart, elsePart] = ast.value;
  const condResult = EVAL(condition, env);

  if (isTrue(condResult)) {
    return ifPart;
  }

  return elsePart;
};

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);

    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case 'def!': return defImplementation(ast, env);
      case 'let*':
        [ast, env] = letImplementation(ast, env);
        break;
      case 'do':
        ast = doImplementation(ast, env);
        break;
      case 'if':
        ast = ifImplementation(ast, env);
        break;
      case 'fn*':
        ast = fnImplementation(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          const newEnv = new Env(fn.oldEnv, fn.binds.value, args);
          ast = fn.value;
          env = newEnv;
        } else {
          return fn.apply(null, args);
        }
    }
  }
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
