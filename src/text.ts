import { ITree } from './datastructure';
import { getTextNodes, countChineseCharacters } from './utils';

export function parseContent(doc: Document) {
  const textArr = getTextNodes(doc);
  const iTree = new ITree(
    textArr,
    (node: Text) => countChineseCharacters(node.textContent) > 10,
  );

  const textsNodes = iTree.getSiblingNodes();

  const { trim: trimArr, raw: rawArr } = textsNodes
    .reverse()
    .reduce<{ trim: string[]; raw: string[] }>(
      (acc, node: Node) => {
        const rawText = node.textContent;
        const trimText = rawText.trim();

        acc.raw.push(rawText);
        acc.trim.push(trimText);
        return acc;
      },
      { trim: [], raw: [] },
    );

  const trimText = trimArr.join('\n');
  const rawText = rawArr.join('\n');
  return {
    trimArr,
    rawArr,
    trimText,
    rawText,
  };
}
