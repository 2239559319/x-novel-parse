const { getText } = require('./utils');
const { writeFile, ensureFile, remove } = require('fs-extra');
const { join } = require('path');
const { catalogUrls } = require('../config/catalog');

function getTestjs(url) {
  const jstemplete = `
const { join } = require("node:path");
const fs = require("fs");
const nodefetch = require("node-fetch");
const { parseCatalog } = require("../../../../dist/cjs/index-es6");

describe("load catalog config", () => {
  beforeAll(() => {
    global.fetch = nodefetch;
  });

  const filepath = join(__dirname, "./index.html");
  const html = fs.readFileSync(filepath, "utf-8");

  it("test catalog parse ${url}", async () => {
    document.documentElement.innerHTML = html;
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL(${JSON.stringify(url)}),
    });

    const res = await parseCatalog(document);
    expect(res).toMatchSnapshot();
  });
});
`;
  return jstemplete;
}

async function downloadCatalogUrls() {

  for (let i = 0; i < catalogUrls.length; i++) {
    const url = catalogUrls[i];
    const domText = await getText(url);
    const outpath = join(
      __dirname,
      '../__tests__/catalog/fixtures',
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
      '../__tests__/catalog/fixtures',
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
      '../__tests__/catalog/fixtures',
      i.toString(),
      'index.test.ts',
    );

    await remove(testFilepath);
    await writeFile(testFilepath, getTestjs(url), {
      encoding: 'utf-8',
    });
  }
}

downloadCatalogUrls();
