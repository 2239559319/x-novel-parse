require('dotenv').config();
const { writeFile, ensureDir } = require('fs-extra');
const { join } = require('node:path');
const { getText } = require('./utils');

async function download(url) {
  const domText = await getText(url);

  const outputPath = join(__dirname, '../dev');
  await ensureDir(outputPath);

  const filename = join(outputPath, 'index.html');
  await writeFile(filename, domText, {
    encoding: 'utf-8',
  });
  console.log('download html done')
}

download(process.env.DEBUG_URL);
