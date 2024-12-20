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
