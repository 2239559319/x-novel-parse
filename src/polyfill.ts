export function nodeListToArr(nodeList: NodeList): Node[] {
  return __ES6__ ? [...nodeList] : Array.prototype.slice.call(nodeList);
}

export function cloneArr<T>(arr: T[]): T[] {
  return __ES6__ ? [...arr] : Array.prototype.slice.call(arr);
}
