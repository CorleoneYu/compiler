import { IdentifierExpression, BlockStatement, ErrorExpression } from "./node";

export enum BaseType {
  ERROR = 'ERROR',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  RETURN_VALUE = 'RETURN_VALUE',
  NULL = 'NULL',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export interface IBase {
  value: any;
  type: () => BaseType;
  inspect: () => void;
}

export interface IBaseProp {
  value: any;
}

export class IntegerNode implements IBase {
  value: Number;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return BaseType.INTEGER;
  }

  inspect() {
    console.log(`integer with value ${this.value}`);
  }
}

export class BooleanNode implements IBase {
  value: Boolean;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return BaseType.BOOLEAN;
  }

  inspect() {
    console.log(`boolean with value ${this.value}`);
  }
}

export class ErrorNode implements IBase {
  value: string;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return BaseType.ERROR;
  }

  inspect() {
    console.log(`boolean with value ${this.value}`);
  }
}

export class NullNode implements IBase {
  value: null = null;

  type() {
    return BaseType.NULL;
  }

  inspect() {
    console.log(`null`);
  }
}

export class StringNode implements IBase {
  value: string;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return BaseType.STRING;
  }

  inspect() {
    console.log(`string with value ${this.value}`);
  }
}

export class ReturnNode implements IBase {
  value: any;
  constructor(props: IBaseProp) {
    this.value = props.value;
  }

  type() {
    return BaseType.RETURN_VALUE;
  }

  inspect() {
    console.log(`return with value ${this.value}`);
  }
}

interface IFnCallNodeProps {
  identifiers: IdentifierExpression[] | ErrorExpression[];
  blockStmt: BlockStatement;
  environment: Environment;
}
export class FnCallNode implements IFnCallNodeProps {
  value: any = "fn call";
  identifiers: IdentifierExpression[] | ErrorExpression[];
  blockStmt: BlockStatement;
  environment: Environment;
  constructor(props: IFnCallNodeProps) {
    this.identifiers = props.identifiers;
    this.blockStmt = props.blockStmt;
    this.environment = props.environment;
  }

  type() {
    return BaseType.FUNCTION_CALL;
  }

  inspect() {
    console.log(`function call`);
  }
}

export class Environment {
  valueMap: Map<string, any> = new Map();
  outer: Environment | null = null;

  constructor(outer: Environment | null) {
    this.outer = outer;
  }

  get(key: string): any {
    if (this.valueMap.has(key)) {
      return this.valueMap.get(key);
    }

    if (!this.outer) {
      return undefined;
    }

    return this.outer.get(key);
  }

  set(key: string, value: any) {
    this.valueMap.set(key, value);
    console.log(this.valueMap);
  }
}
