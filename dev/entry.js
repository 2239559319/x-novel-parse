/**
 * dev entry
 */

window.addEventListener('DOMContentLoaded', () => {
  startDev();
});

async function getScript() {
  const res = await fetch('/index.js');
  const text = await res.text();
  return text;
}

async function startDev() {
  const js = await getScript();

  const locationProxy = new URL(__CATALOG_URL__);
  const runFn = new Function('location', js);

  runFn(locationProxy);
}
