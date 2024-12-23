async function getText(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    },
  });

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
