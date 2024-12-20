import type { CatalogItem } from './types';
import { ITree } from './datastructure';
import { nodeListToArr } from './polyfill';

function parseCatalog(doc: Document): CatalogItem[] {
  const aArray = nodeListToArr(doc.querySelectorAll('a'));

  const pickFn = (node: HTMLAnchorElement) =>
    node.href.startsWith(location.href);

  const iTree = new ITree(aArray, pickFn as any);
  const catalogs: HTMLAnchorElement[] = iTree.getSiblingNodes() as any;

  const s = new Set();

  const urls = catalogs
    .map((node: HTMLAnchorElement) => {
      const url = node.href;

      const res =
        s.has(url) || !pickFn(node)
          ? null
          : {
              name: node.textContent,
              url,
            };
      s.add(url);

      return res;
    })
    .filter((v) => !!v).reverse();
  return urls;
}

parseCatalog(document);
