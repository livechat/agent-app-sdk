type AnyFunction = (...args: any) => any;

export function pipe(...fns: AnyFunction[]) {
  return (x: any) => fns.reduce((v, fn) => fn(v), x);
}
