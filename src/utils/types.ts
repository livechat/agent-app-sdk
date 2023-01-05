export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface KeyMap<T = any> {
  [key: string]: T;
}
