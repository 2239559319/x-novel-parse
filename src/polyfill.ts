export function nodeListToArr(nodeList: NodeList): Node[] {
  return __ES6__ ? [...nodeList] : Array.prototype.slice.call(nodeList);
}

export function cloneArr<T>(arr: T[]): T[] {
  return __ES6__ ? [...arr] : Array.prototype.slice.call(arr);
}

export function includes(s1: string, s2: string) {
  return __ES6__ ? s1.includes(s2) : s1.indexOf(s2) > -1;
}

function _flat(array, depth = 1) {
  const result = [];

  function flatten(arr, currentDepth) {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  flatten(array, depth);
  return result;
}

export function flat(arr: any[]): any[] {
  return __ES6__ ? arr.flat() : _flat(arr);
}
