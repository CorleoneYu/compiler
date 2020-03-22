import { IdentifierExpression, BlockStatement, ErrorExpression } from "./node";

export enum BaseType {
  ERROR = 'ERROR',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  RETURN_VALUE = 'RETURN_VALUE',
  NULL = 'NULL',
  FUNCTION_CALL = 'FUNCTION_CALL',
  ARRAY = 'ARRAY',
  MAP = 'MAP',
}

export class Base {
  value: any;
  type: BaseType = BaseType.ERROR;
  inspect: string = '';
}

export interface IBaseProp {
  value: any;
}

export class IntegerNode extends Base {
  value: number;
  type = BaseType.INTEGER;

  constructor(props: IBaseProp) {
    super();
    this.value = props.value;
    this.inspect = `integer with value ${this.value}`;
  }
}

export class BooleanNode extends Base {
  value: Boolean;
  type = BaseType.BOOLEAN;

  constructor(props: IBaseProp) {
    super();
    this.value = props.value;
    this.inspect = `integer with value ${this.value}`;
  }
}

export class ErrorNode extends Base {
  value: string;
  type = BaseType.ERROR;

  constructor(props: IBaseProp) {
    super();
    this.value = props.value;
    this.inspect = `error with value ${this.value}`;
  }
}

export class NullNode extends Base {
  value: null = null;
  type = BaseType.NULL;
  inspect = `null`;
}

export class StringNode extends Base {
  value: string;
  type = BaseType.STRING;

  constructor(props: IBaseProp) {
    super();
    this.value = props.value;
    this.inspect = `string with value ${this.value}`;
  }
}

export class ReturnNode extends Base {
  value: any;
  type = BaseType.RETURN_VALUE;

  constructor(props: IBaseProp) {
    super();
    this.value = props.value;
    this.inspect = `return with value ${this.value}`;
  }
}

interface IFnCallNodeProps {
  identifiers: IdentifierExpression[] | ErrorExpression[];
  blockStmt: BlockStatement;
  environment: Environment;
}
export class FnCallNode extends Base implements IFnCallNodeProps {
  value: any = 'function call';
  type = BaseType.FUNCTION_CALL;
  identifiers: IdentifierExpression[] | ErrorExpression[];
  blockStmt: BlockStatement;
  environment: Environment;

  constructor(props: IFnCallNodeProps) {
    super();
    this.identifiers = props.identifiers;
    this.blockStmt = props.blockStmt;
    this.environment = props.environment;
    this.inspect = `function call`;
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

interface IArrayNodeProps {
  elements: Base[];
}
export class ArrayNode extends Base {
  type = BaseType.ARRAY;
  elements: Base[] = [];
  value = 'array';

  constructor(props: IArrayNodeProps) {
    super();
    this.elements = props.elements;
    this.inspect = `array with value ${this.value}`;
  }
}

interface IMapNodeProps {
  keys: Base[];
  values: Base[];
}
export class MapNode extends Base {
  type = BaseType.MAP;
  keys: Base[] = [];
  values: Base[] = [];
  value = 'map';

  constructor(props: IMapNodeProps) {
    super();
    this.keys = props.keys;
    this.values = props.values;
    this.inspect = `map with value ${this.value}`;
  }
}