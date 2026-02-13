/**
 * https://github.com/tc39/proposal-await-dictionary
 */
export async function promiseAllKeyed<T extends Record<string, any>>(obj: {
  [K in keyof T]: T[K] | Promise<T[K]>;
}): Promise<T> {
  const keys = Object.keys(obj) as Array<keyof T>;
  const promises = keys.map((key) => obj[key]);
  const values = await Promise.all(promises);

  const result = {} as T;
  keys.forEach((key, index) => {
    result[key] = values[index]!;
  });
  return result;
}
