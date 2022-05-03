export type Err = { tag: 'Err'; error: string };
export type Ok<T> = { tag: 'Ok'; data: T };
export type Result<T> = Err | Ok<T>;

export const newErr = (message: string): Err => ({ tag: 'Err', error: message });
export const newOk = <T>(data: T): Ok<T> => ({ tag: 'Ok', data });

export const isOk = <T>(res: Result<T>): res is Ok<T> => res.tag === "Ok";
