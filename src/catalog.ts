import type { CatalogItem } from './types';
import { ITree } from './datastructure';
import { nodeListToArr } from './polyfill';

export function parseCatalog(doc: Document): CatalogItem[] {
  const aArray = nodeListToArr(doc.querySelectorAll('a'));

  const pickFn = (node: HTMLAnchorElement) => {
    const url = node.href;
    const u = new URL(url, location.origin);

    const rawHref = node.getAttribute('href');
    return u.href.startsWith(location.href) && !rawHref.startsWith('#');
  };

  const iTree = new ITree(aArray, pickFn as any);
  const catalogs: HTMLAnchorElement[] = iTree.getSiblingNodes() as any;

  const s = new Set();

  const urls = catalogs
    .map((node: HTMLAnchorElement) => {
      const url = node.href;
      const rawHref = node.getAttribute('href');

      const res = s.has(url) || rawHref.startsWith('#')
        ? null
        : {
            name: node.textContent,
            url,
          };
      s.add(url);

      return res;
    })
    .filter((v) => !!v)
    .reverse();
  return urls;
}
