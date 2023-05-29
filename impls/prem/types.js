class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    const list = this.value.map(x => x instanceof MalValue ? x.pr_str() : x);
    return '(' + list.join(' ') + ')';
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    const vector = this.value.map(x => x instanceof MalValue ? x.pr_str() : x);
    return '[' + vector.join(' ') + ']';
  }
}

class MalNil extends MalValue {
  constructor() {
    super('nil');
  }
}

class MalBoolean extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalKeyWord extends MalValue {
  constructor(value) {
    super(value);
  }
}

module.exports = {
  MalValue,
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalBoolean,
  MalKeyWord
};
