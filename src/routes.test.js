import { test } from "node:test";
import assert from "node:assert/strict";
import { PAGES, chemin, pageDuChemin, ancienneAncre } from "./routes.js";

test("chemin : /{langue}/ pour l'outil, /{langue}/{page}/ pour une page de lecture", () => {
  assert.equal(chemin("fr"), "/fr/");
  assert.equal(chemin("nl", "outil"), "/nl/");
  assert.deepEqual(PAGES.map((p) => chemin("fr", p)), ["/fr/methode/", "/fr/ecoconception/", "/fr/mentions/"]);
});

test("pageDuChemin : la page servie se lit dans l'adresse, avec ou sans barre finale", () => {
  assert.equal(pageDuChemin("/fr/methode/"), "methode");
  assert.equal(pageDuChemin("/nl/mentions"), "mentions");
  assert.equal(pageDuChemin("/fr/"), "outil");
  assert.equal(pageDuChemin("/"), "outil");
  assert.equal(pageDuChemin("/fr/inconnue/"), "outil");
});

test("ancienneAncre : les anciens liens #methode… mènent à la vraie page, ancre H comprise", () => {
  assert.equal(ancienneAncre("#methode", "fr"), "/fr/methode/");
  assert.equal(ancienneAncre("#methode/h5", "fr"), "/fr/methode/#h5");
  assert.equal(ancienneAncre("#ecoconception", "nl"), "/nl/ecoconception/");
  assert.equal(ancienneAncre("#mentions", "en"), "/en/mentions/");
  assert.equal(ancienneAncre("", "fr"), null);
  assert.equal(ancienneAncre("#", "fr"), null);
  assert.equal(ancienneAncre("#h5", "fr"), null);
});
