async function getText(url) {
  const res = await fetch(url);

  const arrayBuffer = await res.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  let domText = decoder.decode(arrayBuffer);

  if (domText.includes('gbk')) {
    const gbkDecoder = new TextDecoder('gbk');
    domText = gbkDecoder.decode(arrayBuffer);
  }
  return domText;
}

module.exports = {
  getText,
};
