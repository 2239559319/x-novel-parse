
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

  it("test catalog parse https://www.trongyi.vip/109_109270/", async () => {
    document.documentElement.innerHTML = html;
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL("https://www.trongyi.vip/109_109270/"),
    });

    const res = await parseCatalog(document);
    expect(res).toMatchSnapshot();
  });
});
