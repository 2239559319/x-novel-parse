import { getContent } from './text';
import { parseCatalog } from './catalog';

const catalog = parseCatalog(document);
console.log(catalog);
