const { MalSymbol, MalList, MalVector, MalNil, MalBoolean, MalKeyWord, MalString } =
  require('./types.js');

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = (str) => {
  const RE =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g

  return [...str.matchAll(RE)]
    .map(x => x[1])
    .slice(0, -1);
};

const read_atom = (reader) => {
  const token = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }
  if (token === 'true' || token === 'false') {
    return new MalBoolean(token === 'true')
  }
  if (token === 'nil') {
    return new MalNil();
  }
  if (token[0] === ':') {
    return new MalKeyWord(token);
  }
  if (token[0] == '"') {
    return new MalString(token);
  }

  return new MalSymbol(token);
};

const read_seq = (reader, closingSymbol) => {
  const ast = [];
  reader.next();

  while (reader.peek() != closingSymbol) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }
  reader.next();

  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token[0]) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);

  return read_form(reader);
};

module.exports = { read_str };
