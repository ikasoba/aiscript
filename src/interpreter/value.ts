import type { Node } from '../node';
import type { Scope } from './scope';

export type VNull = {
	type: 'null';
};

export type VBool = {
	type: 'bool';
	value: boolean;
};

export type VNum = {
	type: 'num';
	value: number;
};

export type VStr = {
	type: 'str';
	value: string;
};

export type VArr = {
	type: 'arr';
	value: Value[];
};

export type VObj = {
	type: 'obj';
	value: Map<string, Value>;
};

export type VFn = {
	type: 'fn';
	args?: string[];
	statements?: Node[];
	native?: (args: (Value | undefined)[], opts: {
		call: (fn: VFn, args: Value[]) => Promise<Value>;
		registerAbortHandler: (handler: () => void) => void;
		unregisterAbortHandler: (handler: () => void) => void;
	}) => Value | Promise<Value> | void;
	scope?: Scope;
};

export type VReturn = {
	type: 'return';
	value: Value;
};

export type VBreak = {
	type: 'break';
	value: null;
};

export type VContinue = {
	type: 'continue';
	value: null;
};

export type VVariable = {
	type: 'variable';
	value: NormalValue;
}

export type Attr = {
	attr?: {
		name: string;
		value: Value;
	}[];
};

export type NormalValue = (VNull | VBool | VNum | VStr | VArr | VObj | VFn | VReturn | VBreak | VContinue) & Attr;
export type Value = NormalValue | (VVariable) & Attr;

export const NULL = {
	type: 'null' as const,
};

export const TRUE = {
	type: 'bool' as const,
	value: true,
};

export const FALSE = {
	type: 'bool' as const,
	value: false,
};

export const NUM = (num: VNum['value']): VNum => ({
	type: 'num' as const,
	value: num,
});

export const STR = (str: VStr['value']): VStr => ({
	type: 'str' as const,
	value: str,
});

export const BOOL = (bool: VBool['value']): VBool => ({
	type: 'bool' as const,
	value: bool,
});

export const OBJ = (obj: VObj['value']): VObj => ({
	type: 'obj' as const,
	value: obj,
});

export const ARR = (arr: VArr['value']): VArr => ({
	type: 'arr' as const,
	value: arr,
});

export const FN = (args: VFn['args'], statements: VFn['statements'], scope: VFn['scope']): VFn => ({
	type: 'fn' as const,
	args: args,
	statements: statements,
	scope: scope,
});

export const FN_NATIVE = (fn: VFn['native']): VFn => ({
	type: 'fn' as const,
	native: fn,
});

// Return文で値が返されたことを示すためのラッパー
export const RETURN = (v: VReturn['value']): Value => ({
	type: 'return' as const,
	value: v,
});

export const BREAK = (): Value => ({
	type: 'break' as const,
	value: null,
});

export const CONTINUE = (): Value => ({
	type: 'continue' as const,
	value: null,
});

export const VARIABLE = (value: NormalValue): VVariable => ({
	type: 'variable',
	value: value,
});

export const unWrapRet = (v: Value): Value => v.type === 'return' ? v.value : v;

export const unWrapValue = (v: Value): NormalValue => {
	if (v.type === 'variable') {
		return v.value;
	}
	return v;
};
