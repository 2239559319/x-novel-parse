import type { CatalogItem } from './types';
import { ITree } from './datastructure';
import { nodeListToArr, includes, flat } from './polyfill';
import { getDOMbyUrl, forceHttps } from './utils';

function parseCatalogOnePage(doc: Document): CatalogItem[] {
  const aArray = nodeListToArr(doc.querySelectorAll('a'));

  const pickFn = (node: HTMLAnchorElement) =>
    node.pathname.startsWith(location.pathname);

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
    .filter((v) => !!v)
    .reverse();
  return urls;
}

const filterSelectFn = (node: any) => includes(node.value, location.pathname);

export async function parseCatalog(doc: Document) {
  const selects = nodeListToArr(doc.querySelectorAll('select'));
  const filteredSelects = selects.filter(filterSelectFn);

  if (filteredSelects.length === 0 || filteredSelects.length > 1) {
    const catalog = parseCatalogOnePage(doc);
    return catalog;
  } else {
    const select = filteredSelects[0] as HTMLSelectElement;
    const options = nodeListToArr(select.querySelectorAll('option'));
    const linkUrls = options
      .map((node: HTMLOptionElement) => {
        if (filterSelectFn(node)) {
          return node.value;
        } else {
          return '';
        }
      })
      .filter((v) => !!v).map(forceHttps);

    const _catalog = await Promise.all(
      linkUrls.map(async (catalogUrl) => {
        const doc = await getDOMbyUrl(catalogUrl);
        const urls = parseCatalogOnePage(doc);
        return urls;
      }),
    );
    const catalog = flat(_catalog);
    return catalog
  }
}
