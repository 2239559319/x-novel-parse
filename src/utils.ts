function findMaxConsecutive(indices: number[]) {
  if (indices.length === 0 || indices.length === 1) {
    return indices;
  }
  
  let res = [];
  let i = 0;
  while (i < indices.length) {
    const curArr = [indices[i]];
    while (i + 1 < indices.length && indices[i] + 1 === indices[i + 1]) {
      curArr.push(indices[i + 1]);
      i += 1;
    }
    i += 1;

    if (curArr.length > res.length) {
      res = curArr;
    }
  }
  return res;
}

export function findMostFrequentNode(nodes: Node[], set: Set<number>) {
  const map = new WeakMap();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!map.has(node)) {
      map.set(node, []);
    }

    map.set(node, [...map.get(node), i]);
  }

  let mostFrequentNode = null;
  let maxCount = 0;
  let resIndices = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const indices = findMaxConsecutive(map.get(node));
    const count = indices.length;

    if (count > maxCount && isConsecutive(indices) && !set.has(indices[0])) {
      maxCount = count;
      mostFrequentNode = node;
      resIndices = [...indices];
    }
  }

  return { node: mostFrequentNode, indices: resIndices, maxCount };
}

export async function getDOMbyUrl(_url: string) {
  let url = _url;

  if (__DEV__) {
    const u = new URL(_url);
    url = window.location.origin + u.pathname;
  }

  const res = await fetch(url);

  const domText = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(domText, 'text/html');
  return doc;
}

export function forceHttps(url: string) {
  const u = new URL(url);
  if (location.protocol === 'https:' && u.protocol === 'http:') {
    return url.replace(/^http/, 'https');
  }
  return url;
}

export function getTextNodes(node: Node): Text[] {
  const textNodes = [];
  const childNodes = node.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
      textNodes.push(child);
    } else if (child.nodeType === Node.ELEMENT_NODE && child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE') {
      textNodes.push(...getTextNodes(child));
    }
  }

  return textNodes;
}

export function isConsecutive(arr: number[]) {
  if (arr.length === 0 || arr.length === 1) return false;

  const min = arr[0];
  const max = arr[arr.length - 1];

  const expectedLength = max - min + 1;

  return expectedLength === arr.length;
}

export function countChineseCharacters(str) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
          count++;
      }
  }

  return count;
}
