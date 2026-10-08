import { test } from "node:test";
import assert from "node:assert/strict";
import { cleValide, corpsIndexNow } from "./indexnow.js";

test("IndexNow : corps de requête tiré du sitemap, clé servie à la racine", () => {
  const xml = "<urlset><url><loc>https://x.eu/</loc></url><url><loc>https://x.eu/fr/methode/</loc></url></urlset>";
  assert.deepEqual(corpsIndexNow("https://x.eu", "abcd1234", xml), {
    host: "x.eu", key: "abcd1234", keyLocation: "https://x.eu/abcd1234.txt",
    urlList: ["https://x.eu/", "https://x.eu/fr/methode/"],
  });
  assert.ok(cleValide("0123abcd-ef"));
  assert.ok(!cleValide("") && !cleValide("court") && !cleValide("a/../b12345"));
});
