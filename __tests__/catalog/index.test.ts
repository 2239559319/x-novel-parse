const { catalogUrls } = require('../../config/catalog.js');
const { join } = require('node:path');
const fs = require('fs');

describe('load catalog config', () => {

  catalogUrls.forEach((url, index) => {
    const filepath = join(__dirname, `./fixtures/${index}/index.html`);
    const html = fs.readFileSync(filepath, 'utf-8');

    document.documentElement.outerHTML = html;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: new URL(url),
    });

    it('test catalog parse', () => {

    });

  });
});
