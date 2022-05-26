export type Err = { tag: 'Err'; message: string; data: undefined };
export type Ok<T> = { tag: 'Ok'; data: T };
export type Result<T> = Err | Ok<T>;

export const newErr = (message: string): Err => ({ tag: 'Err', message, data: undefined });
export const newOk = <T>(data: T): Ok<T> => ({ tag: 'Ok', data });
export const isOk = <T>(res: Result<T> | Status<T>): res is Ok<T> => res.tag === 'Ok';

export type Loading = { tag: 'Loading'; message: 'loading...'; data: undefined };
export type Status<T> = Err | Ok<T> | Loading
