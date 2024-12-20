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

export async function getDOMbyUrl(url: string) {
  const res = await fetch(url);

  const arrayBuffer = await res.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  let domText = decoder.decode(arrayBuffer);

  if (domText.includes('gbk')) {
    const gbkDecoder = new TextDecoder('gbk');
    domText = gbkDecoder.decode(arrayBuffer);
  }
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
