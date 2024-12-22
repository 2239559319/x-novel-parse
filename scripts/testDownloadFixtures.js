const { getText } = require('./utils');
const { writeFile, ensureFile, remove } = require('fs-extra');
const { join } = require('path');
const { catalogUrls, textUrls } = require('../config/catalog');

function getTestjs(url, type) {
  const exportName = type === 'catalog' ? 'parseCatalog' : 'getContent';

  const jstemplete = `
const { join } = require("node:path");
const fs = require("fs");
const nodefetch = require("node-fetch");
const { ${exportName} } = require("../../../../dist/cjs/index-es6");

describe("load catalog config", () => {

  const filepath = join(__dirname, "./index.html");
  const html = fs.readFileSync(filepath, "utf-8");

  it("test catalog parse ${url}", async () => {
    document.documentElement.innerHTML = html;
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL(${JSON.stringify(url)}),
    });

    const res = await ${exportName}(document);
    expect(res).toMatchSnapshot();
  });
});
`;
  return jstemplete;
}

async function downloadCatalogUrls(type) {
  const urls = type === 'catalog' ? catalogUrls : textUrls;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const domText = await getText(url);
    const outpath = join(
      __dirname,
      `../__tests__/${type}/fixtures`,
      i.toString(),
      'index.html',
    );
    await ensureFile(outpath);

    const domTextWithBase = domText.replace(
      '</head>',
      `<base href="${url}" /></head>`,
    );

    await remove(outpath);
    await writeFile(outpath, domTextWithBase, {
      encoding: 'utf-8',
    });

    const metaOutpath = join(
      __dirname,
      `../__tests__/${type}/fixtures`,
      i.toString(),
      'meta.json',
    );
    await remove(metaOutpath);
    await writeFile(
      metaOutpath,
      JSON.stringify({
        url,
        index: i,
      }),
      {
        encoding: 'utf-8',
      },
    );

    const testFilepath = join(
      __dirname,
      `../__tests__/${type}/fixtures`,
      i.toString(),
      'index.test.ts',
    );

    await remove(testFilepath);
    await writeFile(testFilepath, getTestjs(url, type), {
      encoding: 'utf-8',
    });
  }
}

downloadCatalogUrls('catalog');
downloadCatalogUrls('text');
