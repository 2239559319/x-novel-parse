const { writeFile, ensureFile, remove } = require('fs-extra');
const { JSDOM } = require('jsdom');
const { join } = require('path');
const { parseContent, parseCatalog } = require('../dist/cjs/index-es6');
const { getText } = require('./utils');

async function search(page, text) {
  const f = page === 1 ? 1 : (page - 1) * 10;
  const url = `https://cn.bing.com/search?q=${encodeURIComponent(text)}&qs=ds&first=${f}&FORM=PQRE`;

  const res = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    },
  });

  const content = await res.text();
  return content;
}

async function getSearchLinks(page, _text) {
  const text = await search(page, _text);

  const dom = new JSDOM(text);
  const { window } = dom;
  const { document } = window;

  const rawUrls = [
    ...document.querySelector('#b_results').querySelectorAll('.b_algoheader'),
  ].map((v) => v.querySelector('a').href);
  return rawUrls;
}

const keyword = '斗罗大陆小说阅读';

async function downloadLinks() {
  const urls = [];

  const set = new Set();

  for (let i = 1; i <= 10; i++) {
    const _urls = await getSearchLinks(i, keyword);
    const _resurls = _urls
      .map((urlstr) => {
        const u = new URL(urlstr);

        if (set.has(u.hostname)) {
          return '';
        }

        set.add(u.hostname);
        return u.origin + u.pathname;
      })
      .filter((v) => !!v);

    urls.push(..._resurls);
  }

  const configPath = join(__dirname, '../benchmark/config.json');
  await ensureFile(configPath);

  await writeFile(configPath, JSON.stringify(urls), 'utf-8');
}

async function getDom(url) {
  const text = await getText(url);

  const dom = new JSDOM(text, {
    url,
  });
  const { window } = dom;
  const { document } = window;
  return {
    dom,
    window,
    document,
  };
}

function blockForSeconds(seconds) {
  const end = Date.now() + seconds * 1000;
  while (Date.now() < end) {}
}

async function getContentUrlFromLink(catalogUrl) {
  const { document } = await getDom(catalogUrl);

  global.location = new URL(catalogUrl);
  const res = parseCatalog(document);
  global.location = null;

  if (res.length) {
    const u = res[0].url;
    return u;
  } else {
    console.log(`${catalogUrl}没有找到目录`);
    return '';
  }
}

async function downloadText(contentUrl, outpath) {
  const { document } = await getDom(contentUrl);

  global.location = new URL(contentUrl);
  const res = parseContent(document);
  global.location = null;

  await writeFile(outpath, res.trimText, 'utf-8');
}

function isBlockUrl(url) {
  const keywords = ['baidu', 'qq', 'shuqi', 'qidian', 'douban'];

  for (const t of keywords) {
    if (url.includes(t)) {
      return true;
    }
  }
  return false;
}

async function start() {
  global.Node = {};
  global.Node.TEXT_NODE = 3;
  global.Node.ELEMENT_NODE = 1;

  await downloadLinks();

  const configPath = join(__dirname, '../benchmark/config.json');
  const catalogUrls = require(configPath);

  for (let i = 0; i < catalogUrls.length; i++) {
    const catalogUrl = catalogUrls[i];
    const contentUrl = await getContentUrlFromLink(catalogUrl);
    if (contentUrl && !isBlockUrl(contentUrl) && contentUrl.startsWith('http')) {
      const dir = join(__dirname, `../benchmark/${i}`);
      await remove(dir);

      const outpath = join(__dirname, `../benchmark/${i}/out.txt`);
      await ensureFile(outpath);
      const metapath = join(__dirname, `../benchmark/${i}/meta.json`);
      await ensureFile(metapath);
      await writeFile(metapath, JSON.stringify({ url: contentUrl }), 'utf-8');

      await downloadText(contentUrl, outpath);
      blockForSeconds(2);
    }
  }
}

start();
