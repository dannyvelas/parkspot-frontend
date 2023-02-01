// REF: https://stackoverflow.com/questions/28150967/typescript-cloning-object
export function deepCopy<T>(target: T): T {
  if (target === null) {
    return target;
  }

  if (target instanceof Date) {
    let copy = new Date();
    copy.setTime(target.getTime());
    return copy as any;
  }

  if (target instanceof Array) {
    let copy = [];
    for (let i = 0, len = target.length; i < len; i++) {
      copy[i] = deepCopy(target[i]);
    }
    return copy as any;
  }

  if (typeof target === "object") {
    let copy: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(target)) {
      copy[key] = deepCopy(value);
    }
    return copy as any;
  }

  return target;
}
