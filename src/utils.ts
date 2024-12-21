export function findMostFrequentNode(nodes: Node[]) {
  let maxCount = 0;
  let mostFrequentNode = null;
  const indices = [];

  for (let i = 0; i < nodes.length; i++) {
    let count = 1;
    const currentIndices = [i];

    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i] === nodes[j]) {
        count++;
        currentIndices.push(j);
      }
    }

    if (count > maxCount) {
      maxCount = count;
      mostFrequentNode = nodes[i];
      indices.length = 0;
      indices.push(...currentIndices);
    }
  }

  return { node: mostFrequentNode, indices, maxCount };
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
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      textNodes.push(...getTextNodes(child));
    }
  }

  return textNodes;
}
