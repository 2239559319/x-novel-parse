import { ITree } from './datastructure';
import { getTextNodes } from './utils';

export function parseContent(doc: Document) {
  const textArr = getTextNodes(doc);
  const iTree = new ITree(
    textArr,
    (node: Text) => node.textContent.length > 10,
  );

  const textsNodes = iTree.getSiblingNodes();

  return textsNodes
    ?.reverse()
    .map((node) => node.textContent.trim())
    .join('\n');
}
