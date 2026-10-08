// IndexNow (Bing, Yandex, Seznam, Naver…) : signale les URL du sitemap après chaque déploiement.
// La clé est publique par conception (servie à la racine) : variable GitHub INDEXNOW_KEY, pas un secret.
export const cleValide = (cle) => /^[A-Za-z0-9-]{8,128}$/.test(cle || "");

export function corpsIndexNow(site, cle, sitemapXml) {
  const urlList = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  return { host: new URL(site).host, key: cle, keyLocation: `${site}/${cle}.txt`, urlList };
}
