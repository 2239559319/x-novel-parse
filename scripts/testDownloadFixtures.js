const { getText } = require('./utils');
const { writeFile, ensureFile } = require('fs-extra');
const { join } = require('path');
const { catalogUrls } = require('../config/catalog');

async function downloadCatalogUrls() {
  for (let i = 0; i < catalogUrls.length; i++) {
    const url = catalogUrls[i];
    const domText = await getText(url);
    const outpath = join(__dirname, '../__tests__/catalog/fixtures', i.toString(), 'index.html');
    await ensureFile(outpath);

    await writeFile(outpath, domText, {
      encoding: 'utf-8',
    });
  }
}

downloadCatalogUrls();
