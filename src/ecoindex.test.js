import { test } from "node:test";
import assert from "node:assert/strict";
import { ecoindex, noeuds } from "./ecoindex.js";

test("ecoindex : formule officielle (valeurs de l'API ecoindex.fr)", () => {
  assert.equal(ecoindex(535, 30, 353), 69); // pwablo.be, 10/10/2026
  assert.equal(ecoindex(82, 1, 64.568), 93); // /fr/questions/, 12/10/2026
  assert.equal(ecoindex(98, 1, 69.62), 92); // /fr/methode/, 12/10/2026
});

test("noeuds : éléments du document, sans les enfants des svg ni le contenu des scripts", () => {
  assert.equal(noeuds('<html><head><script>if (a<b) x("<p>")</script></head><body><p>a<br/></p><svg><g><path/></g></svg></body></html>'), 7);
});
