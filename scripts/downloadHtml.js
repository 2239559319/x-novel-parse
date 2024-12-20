require('dotenv').config();
const { writeFile, ensureDir } = require('fs-extra');
const { join } = require('node:path');

async function download(url) {
  const res = await fetch(url);

  const arrayBuffer = await res.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  let domText = decoder.decode(arrayBuffer);

  if (domText.includes('gbk')) {
    const gbkDecoder = new TextDecoder('gbk');
    domText = gbkDecoder.decode(arrayBuffer);
  }

  const outputPath = join(__dirname, '../dev');
  await ensureDir(outputPath);

  const filename = join(outputPath, 'index.html');
  await writeFile(filename, domText, {
    encoding: 'utf-8',
  });
  console.log('download html done')
}

download(process.env.CATALOG_URL);
