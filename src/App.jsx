import { createContext } from "preact";
import { useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  PAYS, SEGMENTS, BATTERIES, MOTORS, MODES, AGE_SUGGESTION, SEUIL_SERRE, KM_AN_MAX_COMPTEUR, byId,
  mixMoyen, calc, fenetre, decider, calcConfig, departager, kmPivot, kmBascule,
  budget, PRIX_ENERGIE, ENTRETIEN,
} from "./model.js";
import { STR, HYP_REFS, SOURCES } from "./i18n.jsx";
import { Icone } from "./icones.jsx";
import { mesurer } from "./mesure.js";

/* ============================================================
   LANGUE ET FORMATS
   ============================================================ */

const NB = " ";
const Ctx = createContext(null);
const useT = () => useContext(Ctx);

function langueInitiale() {
  try {
    const l = localStorage.getItem("lang");
    if (l === "fr" || l === "en") return l;
  } catch { /* stockage indisponible */ }
  return (navigator.language || "fr").startsWith("fr") ? "fr" : "en";
}

function formats(lang) {
  const s = STR[lang];
  const nf = (o) => new Intl.NumberFormat(s.locale, o).format;
  const n0 = nf({ maximumFractionDigits: 0 });
  const n1 = nf({ maximumFractionDigits: 1 });
  const n1f = nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const pc = nf({ style: "percent", maximumFractionDigits: 1 });
  const euro = nf({ style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return {
    s, lang, n0, n1, n1f, pc,
    t: (x) => `${n1(x)}${NB}t`,
    eur: (x) => euro(Math.round(x / 100) * 100 || 0), // arrondi à 100 € (ordres de grandeur), jamais « −0 € »
    tco2: (x) => `${n1(x)}${NB}tCO₂e`,
    km: (x) => `${n0(x)}${NB}km`,
    gkm: (x) => `${n0(x)}${NB}gCO₂e/km`,
    gkwh: (x) => `${n0(x)}${NB}gCO₂e/kWh`,
    kmAn: (x) => s.kmAn(n0(x)),
    ans: (x) => s.ans(n1(x), x),
    age: (x) => s.age(n1(x), x),
  };
}

/* ============================================================
   CONTRÔLES
   ============================================================ */

function BoutonAide({ id, label, open, setOpen }) {
  const { s } = useT();
  return (
    <button type="button" className="aide" aria-expanded={open} aria-controls={`${id}-aide`}
      aria-label={s.aideOuvrir(label)} onClick={() => setOpen(!open)}>
    </button>
  );
}

function TexteAide({ id, open, setOpen, children }) {
  const { s } = useT();
  if (!open) return null;
  return (
    <p id={`${id}-aide`} className="aide-texte" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      {lierHyp(children, s.prefixeHyp)}
    </p>
  );
}

// « (H5) », « H8 à H10 » dans un texte → liens vers la page Méthode (#methode/h5)
function lierHyp(texte, prefixe) {
  if (typeof texte !== "string") return texte;
  return texte.split(new RegExp(`\\b${prefixe}(\\d{1,2})\\b`)).map((morceau, i) =>
    i % 2 === 1 ? <a key={i} href={`#methode/h${morceau}`}>{prefixe}{morceau}</a> : morceau);
}

// Champ libellé : en-tête (libellé, aide, valeur) puis contrôle
function Champ({ id, label, aide, valeur, saisie, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="champ">
      <div className="champ-tete">
        <label htmlFor={id}>{label}</label>
        {aide && <BoutonAide id={id} label={label} open={open} setOpen={setOpen} />}
        {saisie}
        {valeur != null && <output htmlFor={id}>{valeur}</output>}
      </div>
      {aide && <TexteAide id={id} open={open} setOpen={setOpen}>{aide}</TexteAide>}
      {children}
    </div>
  );
}

// Curseur + valeur saisissable au clavier (pas plus fin que le curseur), synchronisés.
// Pendant la frappe, un brouillon évite de rejeter « 1 » en tapant « 12000 » ; hors bornes : ramené à la sortie.
function Curseur({ id, label, aide, value, min, max, step, pas = step, unite, onChange, format }) {
  const [brouillon, setBrouillon] = useState(null);
  const valide = (x) => x !== "" && Number.isFinite(+x) && +x >= min && +x <= max;
  const saisie = (
    <span className="saisie">
      <input type="number" inputMode="decimal" min={min} max={max} step={pas} value={brouillon ?? value}
        aria-label={`${label} (${unite})`}
        onInput={(e) => { setBrouillon(e.target.value); if (valide(e.target.value)) onChange(+e.target.value); }}
        onBlur={() => {
          if (brouillon !== null && !valide(brouillon) && Number.isFinite(+brouillon) && brouillon !== "") {
            onChange(Math.min(max, Math.max(min, +brouillon)));
          }
          setBrouillon(null);
        }} />
      <span className="saisie-unite">{unite}</span>
    </span>
  );
  return (
    <Champ id={id} label={label} aide={aide} saisie={saisie}>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        aria-describedby={aide ? `${id}-aide` : undefined} aria-valuetext={format(value)}
        onInput={(e) => onChange(+e.target.value)} />
      <div className="bornes" aria-hidden="true"><span>{format(min)}</span><span>{format(max)}</span></div>
    </Champ>
  );
}

function Liste({ id, label, aide, value, onChange, options }) {
  return (
    <Champ id={id} label={label} aide={aide}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        aria-describedby={aide ? `${id}-aide` : undefined}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
      </select>
    </Champ>
  );
}

// Choix unique : vrais boutons radio, flèches clavier natives
function Choix({ label, aide, options, value, onChange, cartes }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <fieldset className="champ" aria-labelledby={`${id}-l`} aria-describedby={aide ? `${id}-aide` : undefined}>
      <div className="champ-tete">
        <span id={`${id}-l`} className="libelle">{label}</span>
        {aide && <BoutonAide id={id} label={label} open={open} setOpen={setOpen} />}
      </div>
      {aide && <TexteAide id={id} open={open} setOpen={setOpen}>{aide}</TexteAide>}
      <div className={cartes ? "cartes" : "segments"}>
        {options.map((o) => (
          <label key={o.v} className="option">
            <input type="radio" name={id} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} />
            <span className="option-corps">
              <span className="option-titre">{o.label}</span>
              {o.sub && <span className="option-sous">{o.sub}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Case({ checked, onChange, children, detail }) {
  return (
    <label className="case">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {children}
        {detail && <span className="case-detail">{detail}</span>}
      </span>
    </label>
  );
}

const Coche = () => (
  <svg className="coche" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
);

/* ============================================================
   APP
   ============================================================ */

const ONGLETS = ["decision", "explorer", "modes"];
const lienCarbone4 = (t) => <a href="https://www.carbone4.com/analyse-faq-voiture-electrique" target="_blank" rel="noreferrer">{t}</a>;

// Pages de lecture dans le même fichier (une seule requête) : #methode, #methode/h5, #ecoconception
const PAGES = ["methode", "ecoconception", "mentions"];
function lireRoute() {
  const [page, ancre] = location.hash.slice(1).split("/");
  return PAGES.includes(page) ? { page, ancre: ancre || null } : { page: "outil", ancre: null };
}

export default function App() {
  const [lang, setLang] = useState(langueInitiale);
  const [route, setRoute] = useState(lireRoute);
  const [onglet, setOnglet] = useState("decision");
  // Un onglet n'est monté qu'à sa première visite (DOM initial minimal), puis reste monté
  const [visites, setVisites] = useState({ decision: true });
  const [vue, setVue] = useState("tout");
  const [detention, setDetention] = useState(8);
  const [phevShare, setPhevShare] = useState(0.5);
  // Profil partagé par tous les onglets : jamais demandé deux fois
  const [paysId, setPaysId] = useState("BE");
  const [kmAn, setKmAn] = useState(12000);
  const [segId, setSegId] = useState("compacte");
  const [etatVE, setEtatVE] = useState("neuf");
  const [ageVE, setAgeVE] = useState(3);
  const [odo, setOdo] = useState(50000);
  const [decarb, setDecarb] = useState(true);
  const [battId, setBattId] = useState("ue");
  const [conv, setConv] = useState("marginale");
  const f = useMemo(() => formats(lang), [lang]);
  const { s } = f;
  const tabsRef = useRef([]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch { /* stockage indisponible */ }
  }, [lang]);

  useEffect(() => {
    const suivre = () => setRoute(lireRoute());
    addEventListener("hashchange", suivre);
    return () => removeEventListener("hashchange", suivre);
  }, []);

  // Changement de page : titre du document, puis défilement vers l'ancre ou le haut, focus sur le titre
  useEffect(() => {
    document.title = route.page === "outil" ? s.titre : `${s.pages[route.page]} · ${s.titre}`;
    if (route.page !== "outil") mesurer("page", { nom: route.page, lang });
    const cible = route.ancre && document.getElementById(route.ancre);
    if (cible) cible.scrollIntoView();
    else window.scrollTo(0, 0);
    if (route.page !== "outil") document.getElementById("titre-page")?.focus({ preventScroll: Boolean(cible) });
  }, [route, s]);

  const shared = {
    pays: byId(PAYS, paysId), paysId, setPaysId, kmAn, setKmAn, decarb, setDecarb,
    batt: byId(BATTERIES, battId), battId, setBattId,
    segId, setSegId, etatVE, setEtatVE, ageVE, setAgeVE, odo, setOdo, conv, setConv,
    detention, setDetention, phevShare, setPhevShare,
  };

  const ouvrir = (o) => {
    if (!visites[o]) mesurer("onglet", { nom: o, lang });
    setOnglet(o);
    setVisites((v) => (v[o] ? v : { ...v, [o]: true }));
  };
  const allerOnglet = (o) => {
    ouvrir(o);
    tabsRef.current[ONGLETS.indexOf(o)]?.focus();
  };
  const allerExplorer = (v) => { setVue(v); allerOnglet("explorer"); };

  // Onglets : tabindex itinérant, flèches / Début / Fin
  const clavierOnglets = (e) => {
    const i = ONGLETS.indexOf(onglet);
    const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ONGLETS.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    allerOnglet(ONGLETS[(j + ONGLETS.length) % ONGLETS.length]);
  };

  return (
    <Ctx.Provider value={f}>
      <div className="page">
        <header className="entete">
          <div className="entete-haut">
            <h1>{s.h1}</h1>
            <div className="entete-actions">
              <nav aria-label={s.navSite}>
                <a className="nav-site" href="#methode" aria-current={route.page === "methode" ? "page" : undefined}>{s.pages.methode}</a>
              </nav>
            <fieldset className="langue" aria-label={s.langue}>
              {["fr", "en"].map((l) => (
                <label key={l} className="option">
                  <input type="radio" name="langue" value={l} checked={lang === l} onChange={() => setLang(l)} />
                  <span className="option-corps" lang={l} aria-label={l === "fr" ? "Français" : "English"}>{l.toUpperCase()}</span>
                </label>
              ))}
            </fieldset>
            </div>
          </div>
          {route.page === "outil" && <p className="lede">{s.lede}</p>}
        </header>

        {/* L'outil reste monté (réponses conservées) mais masqué sur les pages de lecture */}
        <div hidden={route.page !== "outil"}>
        <div className="onglets" role="tablist" aria-label="Sections" onKeyDown={clavierOnglets}>
          {ONGLETS.map((o, i) => (
            <button key={o} ref={(el) => (tabsRef.current[i] = el)} role="tab" id={`tab-${o}`}
              aria-selected={onglet === o} aria-controls={`panel-${o}`} tabIndex={onglet === o ? 0 : -1}
              onClick={() => ouvrir(o)}>
              {s.onglets[o]}
            </button>
          ))}
        </div>

        {/* Les onglets restent montés : leurs réponses survivent à la navigation */}
        <div role="tabpanel" id="panel-decision" aria-labelledby="tab-decision" hidden={onglet !== "decision"}>
          <Decision shared={shared} allerExplorer={allerExplorer} />
        </div>
        <div role="tabpanel" id="panel-explorer" aria-labelledby="tab-explorer" hidden={onglet !== "explorer"}>
          {visites.explorer && <Explorer shared={shared} vue={vue} setVue={setVue} />}
        </div>
        <div role="tabpanel" id="panel-modes" aria-labelledby="tab-modes" hidden={onglet !== "modes"}>
          {visites.modes && <Modes />}
        </div>
        </div>

        {route.page === "methode" && <PageMethode />}
        {route.page === "ecoconception" && <PageEco />}
        {route.page === "mentions" && <PageMentions />}

        <footer className="pied">
          <nav className="liens-pied" aria-label={s.navSite}>
            <a href="#methode">{s.pages.methode}</a>
            <a href="#ecoconception" aria-label={s.ecoLienLong}>{s.ecoLien}</a>
            <a href="#mentions">{s.pages.mentions}</a>
          </nav>
          <p>{s.footer(lienCarbone4)} {s.credit(<a href="https://pwablo.be" rel="author">Pwablo</a>)}</p>
        </footer>
      </div>
    </Ctx.Provider>
  );
}

function optionsPays(f) {
  return PAYS.map((p) => ({ v: p.id, label: f.s.paysOption(f.s.pays[p.id], f.n0(p.g)) }));
}

const optionsCategorie = (s, sous) => SEGMENTS.map((x) => ({ v: x.id, label: s.seg[x.id].nom, sub: sous(x) }));

/* ============================================================
   ONGLET 1 — MA DÉCISION
   ============================================================ */

function Decision({ shared, allerExplorer }) {
  const f = useT();
  const { s } = f;
  const { pays, paysId, setPaysId, kmAn, setKmAn, decarb, batt, segId, setSegId, etatVE, setEtatVE, ageVE, setAgeVE } = shared;
  const [etape, setEtape] = useState(0);
  const [maxEtape, setMaxEtape] = useState(0);
  const [carb, setCarb] = useState("essence");
  const [conso, setConso] = useState(6.5);
  const [annees, setAnnees] = useState(5);
  const titreRef = useRef(null);
  const etapePrec = useRef(etape);

  const seg = byId(SEGMENTS, segId);
  const params = { carb, conso, annees, seg, etatVE, ageVE, pays, decarb, efBatt: batt.ef };
  const v = decider({ ...params, kmAn });
  // Le seuil ne dépend pas du kilométrage : recalculé seulement si une autre réponse change
  const seuil = useMemo(
    () => (etape === 3 ? kmBascule(params) : null),
    [etape, carb, conso, annees, segId, etatVE, ageVE, pays, decarb, batt], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const etat = etatVE === "neuf" ? s.etatNeuve : s.etatOcc(f.n0(ageVE), ageVE);

  // Au changement d'étape, le focus va au titre de la nouvelle étape
  useEffect(() => {
    if (etapePrec.current !== etape) titreRef.current?.focus();
    if (etape === 3 && etapePrec.current !== 3) {
      // Valeurs grossières uniquement (kilométrage arrondi à 5 000 km) : rien d'identifiant
      mesurer("verdict", { verdict: v.verdict, pays: pays.id, segment: segId, etat: etatVE, km: Math.round(kmAn / 5000) * 5000, lang: f.lang });
    }
    etapePrec.current = etape;
  }, [etape]);

  const aller = (i) => { setEtape(i); setMaxEtape((m) => Math.max(m, i)); };

  return (
    <div>
      <ol className="etapes" aria-label={s.etapeSur(etape + 1, 4)}>
        {s.etapes.map((e, i) => (
          <li key={i} aria-current={i === etape ? "step" : undefined}>
            <button type="button" disabled={i > maxEtape || i === etape} onClick={() => aller(i)}
              className={classeEtape(i, etape)}>
              <span className="etape-num" aria-hidden="true">{i < etape ? <Coche /> : i + 1}</span>
              {e}
            </button>
          </li>
        ))}
      </ol>

      {etape < 3 && (
        <section className="carte">
          <h2 ref={titreRef} tabIndex={-1}>{s.titreEtape[etape]}</h2>

          {etape === 0 && (
            <>
              <Liste id="pays" label={s.champ.pays} aide={s.aide.pays} value={paysId} onChange={setPaysId} options={optionsPays(f)} />
              <Curseur id="kman" label={s.champ.km} aide={s.aide.km} value={kmAn} min={3000} max={40000} step={500} pas={100}
                unite={s.unites.kmAn} onChange={setKmAn} format={f.kmAn} />
            </>
          )}

          {etape === 1 && (
            <>
              <Choix label={s.champ.carburant} value={carb} onChange={setCarb}
                options={[{ v: "essence", label: s.motor.essence.nom }, { v: "diesel", label: s.motor.diesel.nom }]} />
              <Curseur id="conso" label={s.champ.conso} aide={s.aide.conso} value={conso} min={3} max={15} step={0.1} unite={s.unites.conso}
                onChange={setConso} format={(x) => `${f.n1f(x)}${NB}L/100${NB}km`} />
              <Curseur id="annees" label={s.champ.annees} aide={s.aide.annees} value={annees} min={1} max={12} step={1} unite={s.unites.ans}
                onChange={setAnnees} format={f.ans} />
            </>
          )}

          {etape === 2 && (
            <>
              <Choix cartes label={s.champ.categorie} aide={s.aide.categorie} value={segId} onChange={setSegId}
                options={optionsCategorie(s, (x) => `${x.battKwh}${NB}kWh`)} />
              <Choix label={s.champ.etat} aide={s.aide.etat} value={etatVE} onChange={setEtatVE}
                options={[{ v: "neuf", label: s.neuve }, { v: "occasion", label: s.occasion }]} />
              {etatVE === "occasion" && (
                <>
                  <Curseur id="ageve" label={s.champ.ageAchat} value={ageVE} min={1} max={12} step={1} unite={s.unites.ans}
                    onChange={setAgeVE} format={f.ans} />
                  <p className="note">{s.partOcc(f.pc(v.partVE), f.age(ageVE), f.age(ageVE + v.horizon))}</p>
                </>
              )}
            </>
          )}

          <div className="actions">
            {etape > 0 && <button type="button" className="btn btn-texte" onClick={() => aller(etape - 1)}>{s.retour}</button>}
            <button type="button" className="btn btn-plein" onClick={() => aller(etape + 1)}>{s.suivantVers[etape]}</button>
          </div>
        </section>
      )}

      {etape === 0 && (
        <p className="raccourci">
          <button type="button" className="btn-lien" onClick={() => allerExplorer("tout")}>{s.pasDeVoiture}</button>
        </p>
      )}

      {etape === 3 && (
        <>
          <section className={`verdict sombre verdict-${v.verdict}`} aria-live="polite">
            <h2 ref={titreRef} tabIndex={-1} className="verdict-titre">{s.verdictTitre[v.verdict]}</h2>
            <p className="verdict-texte">
              {v.verdict === "remplacer" && s.verdictRemplacer({
                duree: f.ans(v.horizon), km: f.km(v.km), t: f.tco2(v.tGarder - v.tRemplacer), amorti: f.ans(v.amortiAns), etat,
              })}
              {v.verdict === "garder" && (
                <>
                  {s.verdictGarder({
                    km: f.kmAn(kmAn), etat, duree: f.ans(v.horizon), t: f.tco2(v.tRemplacer - v.tGarder),
                    amorti: Number.isFinite(v.amortiAns) ? f.ans(v.amortiAns) : null,
                  })}
                  {v.suggererOccasion && <> {s.suggestionOcc({ age: f.n0(AGE_SUGGESTION), t: f.t(v.tOccasion), tg: f.t(v.tGarderOcc) })}</>}
                </>
              )}
              {v.verdict === "serre" && s.verdictSerre({ a: f.t(v.tGarder), b: f.t(v.tRemplacer), duree: f.ans(v.horizon) })}
            </p>
            {v.tronque && <p className="verdict-note">{s.tronque(f.ans(v.horizon))}</p>}

            <div className="face-a-face">
              <Colonne gagne={v.verdict === "garder"} titre={s.colGarder(carb)} t={v.tGarder}
                sous={s.colGarderSous(f.gkm(v.usageVieille))} />
              <Colonne gagne={v.verdict === "remplacer"} titre={s.colVE(s.seg[segId].nom, etat)} t={v.tRemplacer}
                sous={s.colVESous(f.t(v.fabVE))} />
            </div>
          </section>

          <section className="carte">
            <p className="bascule">{texteBascule(s, f, seuil)}</p>
            <Curseur id="etsi" label={s.etSi} value={kmAn} min={3000} max={40000} step={500} pas={100} unite={s.unites.kmAn}
              onChange={setKmAn} format={f.kmAn} />
            <Repli className="replie" titre={s.commentLire}>
              <p className="note-petite">{lierHyp(s.conventions, s.prefixeHyp)}</p>
            </Repli>
          </section>

          <Budget carb={carb} conso={conso} kmAn={kmAn} seg={seg} paysId={pays.id} />

          <section className="carte">
            <h2>{s.allerPlusLoin}</h2>
            <div className="actions actions-debut">
              <button type="button" className="btn btn-plein" onClick={() => allerExplorer("tout")}>{s.ctaTout}</button>
              <button type="button" className="btn btn-contour" onClick={() => allerExplorer("duel")}>{s.ctaDuel}</button>
              <button type="button" className="btn btn-texte" onClick={() => aller(0)}>{s.modifier}</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ---------- Budget à l'usage : énergie + entretien, hors prix d'achat du véhicule ---------- */
function ChampPrix({ id, label, value, step, onChange }) {
  return (
    <Champ id={id} label={label}>
      <input id={id} type="number" inputMode="decimal" min="0" step={step} value={value}
        onInput={(e) => onChange(e.target.value === "" ? undefined : +e.target.value)} />
    </Champ>
  );
}

function Budget({ carb, conso, kmAn, seg, paysId }) {
  const f = useT();
  const { s } = f;
  const [sur, setSur] = useState({}); // prix saisis ; sinon prix par défaut du pays
  const maj = (k) => (x) => setSur((o) => ({ ...o, [k]: x }));
  const prixPays = PRIX_ENERGIE[paysId];
  const p = { carb: sur.carb ?? prixPays[carb], elec: sur.elec ?? prixPays.elec };
  const b = budget({ carb, conso, kmAn, seg, prix: { [carb]: p.carb, elec: p.elec }, entretien: ENTRETIEN });
  // Montants arrondis à 100 € ; l'économie affichée est la différence des deux montants affichés
  const th = Math.round(b.usageGarderAn / 100) * 100;
  const ve = Math.round(b.usageVEAn / 100) * 100;

  return (
    <section className="carte">
      <h2>{s.budgetTitre}</h2>
      <p className="bascule">{s.budgetUsageTitre(usage(s, f, th - ve))}</p>
      <dl className="budget-postes">
        <div><dt>{s.budgetVotreVoiture}</dt><dd>{s.budgetLigne(f.eur(th), f.n1f(b.energie100Garder))}</dd></div>
        <div><dt>{s.budgetElectrique}</dt><dd>{s.budgetLigne(f.eur(ve), f.n1f(b.energie100VE))}</dd></div>
      </dl>
      <p className="aide-ligne">{s.budgetPerimetre}</p>
      {/* L'achat, sans prix propre à un pays : combien d'années d'économies pour amortir un écart de prix */}
      <p className="budget-amortir">
        {th - ve >= 50 ? s.budgetAmortir(f.eur(th - ve), f.n0(10000 / (th - ve))) : s.budgetAmortirNon}
      </p>
      <Repli className="replie" titre={s.budgetAjuster}>
        <div className="budget-champs">
          <ChampPrix id="p-carb" label={s.budgetPrixCarb(s.motor[carb].nom)} value={p.carb} step="0.01" onChange={maj("carb")} />
          <ChampPrix id="p-elec" label={s.budgetPrixElec} value={p.elec} step="0.01" onChange={maj("elec")} />
        </div>
        <p className="note-petite">{s.budgetSources}</p>
      </Repli>
    </section>
  );
}

// Usage seul (énergie + entretien), par an : « environ 800 € de moins » ou « à peu près pareil »
function usage(s, f, parAn) {
  if (Math.abs(parAn) < 50) return s.budgetUsagePareil;
  return parAn > 0 ? s.budgetUsageMoins(f.eur(parAn)) : s.budgetUsagePlus(f.eur(-parAn));
}

function texteBascule(s, f, seuil) {
  if (seuil === null) return s.basculeJamais;
  if (seuil <= 3000) return s.basculeToujours;
  return s.bascule(f.kmAn(seuil));
}

function classeEtape(i, etape) {
  if (i === etape) return "on";
  if (i < etape) return "fait";
  return "";
}

function Colonne({ gagne, titre, t, sous }) {
  const f = useT();
  return (
    <div className={`colonne${gagne ? " gagne" : ""}`}>
      <div className="colonne-titre">{titre}</div>
      <div className="colonne-chiffre">{f.t(t)}</div>
      <div className="colonne-sous">{sous}</div>
      {gagne && <div className="etiquette"><Coche />{f.s.moinsEmissions}</div>}
    </div>
  );
}

/* ============================================================
   ONGLET 2 — EXPLORER (toutes les motorisations / deux voitures)
   ============================================================ */

function Explorer({ shared, vue, setVue }) {
  const f = useT();
  const { s } = f;
  const { pays, paysId, setPaysId, kmAn, setKmAn, segId, setSegId, etatVE, setEtatVE, ageVE, setAgeVE, odo, setOdo } = shared;
  const etat = etatVE === "neuf" ? s.etatNeuve : s.etatOcc(f.n0(ageVE), ageVE);
  const odoMax = ageVE * KM_AN_MAX_COMPTEUR;

  return (
    <div>
      <section className="carte">
        <Choix label={s.vue} value={vue} onChange={setVue}
          options={[{ v: "tout", label: s.vues.tout }, { v: "duel", label: s.vues.duel }]} />
        <details className="replie profil">
          <summary>
            <span className="profil-titre">{s.profilTitre}</span>
            <span className="profil-valeur">{s.profil({ pays: s.pays[pays.id], km: f.kmAn(kmAn), voiture: s.voitureProfil(s.seg[segId].nom, etat) })}</span>
            <span className="profil-modifier">{s.modifierProfil}</span>
          </summary>
          <Liste id="paysX" label={s.champ.pays} aide={s.aide.pays} value={paysId} onChange={setPaysId} options={optionsPays(f)} />
          <Curseur id="kmanX" label={s.champ.km} aide={s.aide.kmComp} value={kmAn} min={3000} max={40000} step={500} pas={100} unite={s.unites.kmAn}
            onChange={setKmAn} format={f.kmAn} />
          <Choix cartes label={s.champ.categorie} value={segId} onChange={setSegId}
            options={optionsCategorie(s, (x) => `≈${NB}${f.n0(x.masse)}${NB}kg`)} />
          <p className="aide-ligne">{s.exemples(s.seg[segId].ex, byId(SEGMENTS, segId).battKwh)}</p>
          <Choix label={s.champ.etat} value={etatVE} onChange={setEtatVE}
            options={[{ v: "neuf", label: s.neuve }, { v: "occasion", label: s.occasion }]} />
          {etatVE === "occasion" && (
            <div className="groupe">
              <Curseur id="ageX" label={s.champ.age} aide={s.aide.age} value={ageVE} min={1} max={12} step={1} unite={s.unites.ans}
                onChange={setAgeVE} format={f.ans} />
              <Curseur id="odoX" label={s.champ.odo} aide={s.aide.odo} value={odo} min={0} max={160000} step={1000} pas={500} unite={s.unites.km}
                onChange={setOdo} format={f.km} />
              {odo > odoMax && <p className="note">{s.odoBorne(f.km(odoMax))}</p>}
            </div>
          )}
        </details>
      </section>

      {vue === "tout" ? <Comparateur shared={shared} /> : <Duel shared={shared} />}
    </div>
  );
}

function Comparateur({ shared }) {
  const f = useT();
  const { s } = f;
  const { pays, kmAn, decarb, setDecarb, batt, battId, setBattId, segId, etatVE, ageVE, odo, conv, setConv,
    detention, setDetention, phevShare, setPhevShare } = shared;
  const [revente, setRevente] = useState(true);
  const [hybrides, setHybrides] = useState(true); // affichés par défaut : la comparaison est plus complète

  const occasion = etatVE === "occasion";
  const seg = byId(SEGMENTS, segId);
  const fen = fenetre({ occasion, odo, age: ageVE, kmAn, revente, detention, marginal: conv === "marginale" });
  const anneesDet = fen.kmVous / kmAn;
  const gridEff = mixMoyen(pays.g, anneesDet, decarb, pays.declin);
  const resultats = MOTORS.filter((m) => hybrides || !m.hybride)
    .map((m) => calc(m.id, seg, gridEff, fen.kmVous, fen.ratioFab, phevShare, batt.ef))
    .sort((a, b) => a.perKm - b.perKm);
  const ev = resultats.find((r) => r.motorId === "ev");
  const essence = resultats.find((r) => r.motorId === "essence");
  const pivot = kmPivot(ev, essence, fen.kmVous);
  const best = resultats[0];
  const worst = resultats[resultats.length - 1];

  return (
    <div>
      <section className="verdict sombre resume" aria-live="polite">
        <p className="resume-chiffre" style={{ "--c": `var(--m-${best.motorId})` }}>{f.n0(best.perKm)}<span>gCO₂e/km</span></p>
        <p className="verdict-texte">
          {s.heroComp({
            best: cap(s.motor[best.motorId].le), perKm: f.gkm(best.perKm),
            x: f.n1(worst.perKm / best.perKm), worst: `${s.motor[worst.motorId].le} (${f.n0(worst.perKm)})`,
          })}
        </p>
      </section>

      <section className="carte">
        <h2>{s.barsTitre}</h2>
        <p className="sous-titre">{s.barsSous(f.km(fen.kmVous))}</p>
        <Barres lignes={resultats.map((r) => ({
          key: r.motorId, r, echelle: 100 / worst.totalT,
          nom: <><span className="pastille" />{s.motor[r.motorId].nom}</>,
        }))} />
        <div className="legende">
          <span><span className="pastille pastille-fab" />{s.legFab}</span>
          <span><span className="pastille" />{s.legUse(f.gkwh(gridEff), decarb)}</span>
        </div>
        {!occasion && <p className="aide-ligne">{s.noteConvention[conv]}</p>}

        <details className="replie reglages">
          <summary>{s.avance}</summary>
          <Choix label={s.champ.batterie} aide={s.aide.batterie} value={battId} onChange={setBattId}
            options={BATTERIES.map((b) => ({ v: b.id, label: s.batt[b.id], sub: `${b.ef}${NB}kgCO₂e/kWh` }))} />
          <Choix label={s.champConvention} aide={s.aideConvention} value={conv} onChange={setConv}
            options={[{ v: "marginale", label: s.convOptions.marginale }, { v: "partagee", label: s.convOptions.partagee }]} />
          <Choix label={s.champ.destin} aide={s.aide.destin} value={revente ? "r" : "g"} onChange={(x) => setRevente(x === "r")}
            options={[{ v: "r", label: s.champ.revendue }, { v: "g", label: s.champ.gardee }]} />
          {revente && (
            <>
              <Curseur id="det" label={s.champ.detention} value={detention} min={2} max={15} step={1} unite={s.unites.ans}
                onChange={setDetention} format={f.ans} />
              <p className="note">{s.partRevente({ pc: f.pc(fen.ratioFab), a: f.age(fen.ageEff), b: f.age(fen.ageFinVous), km: f.km(fen.kmRepreneur) })}</p>
            </>
          )}
          {fen.borneParAge && <p className="note">{s.borneAge(f.km(fen.kmVous))}</p>}
          <Case checked={decarb} onChange={setDecarb}
            detail={s.decarbDetail({ pays: s.pays[pays.id], taux: f.pc(pays.declin), g: f.gkwh(gridEff), duree: f.ans(anneesDet) })}>
            {s.champ.decarb}
          </Case>
          <Case checked={hybrides} onChange={setHybrides}>{s.champ.hybrides}</Case>
          {hybrides && (
            <Curseur id="phev" label={s.champ.phev} aide={s.aide.phev} value={Math.round(phevShare * 100)}
              min={0} max={100} step={5} pas={1} unite="%" onChange={(x) => setPhevShare(x / 100)}
              format={(x) => f.pc(x / 100)} />
          )}
        </details>
      </section>

      <section className="carte">
        <h2>{s.pivotTitre}</h2>
        <p className="sous-titre">{s.pivotSous}</p>
        <CourbeCumulee resultats={resultats} kmMax={fen.kmVous} pivot={pivot} ev={ev} />
        <p className="pivot" id="pivot-texte">
          {pivot > 0 && s.pivotKm(f.km(pivot), f.ans(pivot / kmAn), f.kmAn(kmAn))}
          {pivot === 0 && s.pivotZero}
          {pivot === null && s.pivotJamais(f.km(fen.kmVous))}
        </p>
      </section>
    </div>
  );
}

const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);

// Barres empilées fabrication (hachurée) + usage ; `echelle` convertit des tonnes en % de largeur
function Barres({ lignes }) {
  const f = useT();
  return (
    <ul className="barres">
      {lignes.map(({ key, r, nom, apres, echelle }) => (
        <li key={key} style={{ "--c": `var(--m-${r.motorId})` }}>
          <div className="barre-tete">
            <span className="barre-nom">{nom}</span>
            <span className="barre-val"><strong>{f.gkm(r.perKm)}</strong> · {f.t(r.totalT)}{apres}</span>
          </div>
          <div className="piste" aria-hidden="true">
            <div className="barre barre-fab" style={{ width: `${r.fabAttr * echelle}%` }} />
            <div className="barre" style={{ width: `${r.usageT * echelle}%` }} />
          </div>
          <div className="barre-detail">{f.s.barDetail(f.t(r.fabAttr), f.t(r.usageT))}</div>
        </li>
      ))}
    </ul>
  );
}

function pasGraduation(maxY) {
  if (maxY > 40) return 10;
  if (maxY > 16) return 5;
  if (maxY > 6) return 2;
  return 1;
}

/* ---------- Courbe cumulée, dessinée à la largeur réelle ---------- */
function CourbeCumulee({ resultats, kmMax, pivot, ev }) {
  const f = useT();
  const { s } = f;
  const boite = useRef(null);
  const [W, setW] = useState(640);

  useLayoutEffect(() => {
    const el = boite.current;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = Math.round(Math.min(360, Math.max(240, W * 0.6)));
  const PAD = { t: 22, r: 76, b: 34, l: 40 };
  const fin = (r) => r.fabAttr + (r.usage * kmMax) / 1e6;
  const maxY = Math.max(...resultats.map(fin)) * 1.05;
  const x = (km) => PAD.l + (km / kmMax) * (W - PAD.l - PAD.r);
  const y = (t) => H - PAD.b - (t / maxY) * (H - PAD.t - PAD.b);
  const pasY = pasGraduation(maxY);
  const ticksY = [];
  for (let t = 0; t <= maxY; t += pasY) ticksY.push(t);
  const ticksX = [0, 0.25, 0.5, 0.75, 1].map((fr) => kmMax * fr);
  const kLabel = (km) => {
    if (km === 0) return "0";
    return `${km < 10000 ? f.n1(km / 1000) : f.n0(km / 1000)}k`;
  };

  // Étiquettes en bout de courbe, écartées d'au moins 15 px
  const etiquettes = resultats.map((r) => ({ id: r.motorId, y: y(fin(r)) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < etiquettes.length; i++)
    etiquettes[i].y = Math.max(etiquettes[i].y, etiquettes[i - 1].y + 15);

  const pivotY = pivot > 0 ? ev.fabAttr + (ev.usage * pivot) / 1e6 : 0;
  const resume = s.courbeResume(resultats.map((r) => s.courbeLigne(s.motor[r.motorId].nom, f.t(r.fabAttr), f.t(fin(r)))).join(" "));
  const tirets = (id) => (id === "hev" || id === "phev" || id === "diesel" ? "6 5" : undefined);

  return (
    <div ref={boite} className="courbe">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={resume} aria-describedby="pivot-texte">
        {ticksY.map((t) => (
          <g key={t}>
            <line className="grille" x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
            <text className="axe" x={PAD.l - 8} y={y(t) + 4} text-anchor="end">{t}</text>
          </g>
        ))}
        {ticksX.map((km, i) => (
          <text key={i} className="axe" x={x(km)} y={H - PAD.b + 18} text-anchor="middle">{kLabel(km)}</text>
        ))}
        <text className="axe" x={W - PAD.r} y={H - 2} text-anchor="end">{s.axeX}</text>
        <text className="axe" x={PAD.l - 8} y={12}>{s.axeY}</text>
        {resultats.map((r) => (
          <g key={r.motorId} className="ligne" style={{ "--c": `var(--m-${r.motorId})` }}>
            <line x1={x(0)} y1={y(r.fabAttr)} x2={x(kmMax)} y2={y(fin(r))}
              stroke-width={r.motorId === "ev" || r.motorId === "essence" ? 3 : 2} stroke-dasharray={tirets(r.motorId)} />
            <circle cx={x(0)} cy={y(r.fabAttr)} r="4" />
          </g>
        ))}
        {etiquettes.map((e) => (
          <text key={e.id} className="fin-ligne" x={W - PAD.r + 8} y={e.y + 4}
            style={{ "--c": `var(--m-${e.id})` }}>
            {s.motor[e.id].court}
          </text>
        ))}
        {pivot > 0 && (
          <g className="pivot-marque">
            <line x1={x(pivot)} x2={x(pivot)} y1={y(pivotY)} y2={H - PAD.b} stroke-dasharray="3 4" />
            <circle cx={x(pivot)} cy={y(pivotY)} r="6" className="anneau" />
            <circle cx={x(pivot)} cy={y(pivotY)} r="3" />
            <text x={x(pivot)} y={y(pivotY) - 12} text-anchor="middle">{f.km(pivot)}</text>
          </g>
        )}
      </svg>
      {/* Légende statique : toutes les courbes restent visibles (les boutons de mise en évidence prêtaient à confusion) */}
      <ul className="legende-courbe" aria-label={s.legendeCourbe}>
        {resultats.map((r) => (
          <li key={r.motorId} style={{ "--c": `var(--m-${r.motorId})` }}>
            <svg width="18" height="4" aria-hidden="true"><line x1="0" y1="2" x2="18" y2="2" stroke-dasharray={tirets(r.motorId) ? "4 3" : undefined} /></svg>
            {s.motor[r.motorId].nom}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   ONGLET 3 — DUEL
   ============================================================ */

function ConfigVehicule({ lettre, cfg, setCfg }) {
  const f = useT();
  const { s } = f;
  const id = useId();
  return (
    <div className="config">
      <h3><span className="badge" aria-hidden="true">{lettre}</span>{s.vehicule(lettre)}</h3>
      <Liste id={`${id}-seg`} label={s.champ.categorie} value={cfg.segId} onChange={(v) => setCfg({ ...cfg, segId: v })}
        options={SEGMENTS.map((x) => ({ v: x.id, label: s.seg[x.id].nom }))} />
      <Liste id={`${id}-mot`} label={s.champ.motorisation} value={cfg.motorId} onChange={(v) => setCfg({ ...cfg, motorId: v })}
        options={MOTORS.map((m) => ({ v: m.id, label: s.motor[m.id].nom }))} />
      <Choix label={s.champ.etat} value={cfg.etat} onChange={(v) => setCfg({ ...cfg, etat: v })}
        options={[{ v: "neuf", label: s.neuve }, { v: "occasion", label: s.occasion }]} />
      {cfg.etat === "occasion" && (
        <div className="groupe">
          <Curseur id={`${id}-age`} label={s.champ.age} value={cfg.age} min={1} max={12} step={1} unite={s.unites.ans}
            onChange={(v) => setCfg({ ...cfg, age: v })} format={f.ans} />
          <Curseur id={`${id}-odo`} label={s.champ.odo} value={cfg.odo} min={0} max={160000} step={1000} pas={500} unite={s.unites.km}
            onChange={(v) => setCfg({ ...cfg, odo: v })} format={f.km} />
        </div>
      )}
    </div>
  );
}

function Duel({ shared }) {
  const f = useT();
  const { s } = f;
  const { pays, kmAn, decarb, batt, conv, detention, setDetention, phevShare, setPhevShare } = shared;
  const [A, setA] = useState({ segId: "compacte", motorId: "essence", etat: "occasion", age: 6, odo: 80000 });
  const [B, setB] = useState({ segId: "compacte", motorId: "ev", etat: "neuf", age: 6, odo: 80000 });

  const ctx = { pays, kmAn, decarb, efBatt: batt.ef, marginal: conv === "marginale", detention, phevShare };
  const rA = calcConfig(A, ctx);
  const rB = calcConfig(B, ctx);
  const d = departager(rA.perKm, rB.perKm);
  const lignes = [{ l: "A", r: rA, cfg: A }, { l: "B", r: rB, cfg: B }];
  const max = Math.max(rA.totalT / rA.f.kmVous, rB.totalT / rB.f.kmVous);
  const desc = (cfg) => s.duelDesc(s.motor[cfg.motorId].nom, s.seg[cfg.segId].nom, cfg.etat === "neuf" ? s.etatNeuve : s.etatOccasion);

  return (
    <div>
      <section className="carte">
        <h2>{s.duelTitre}</h2>
        <p className="sous-titre">{s.duelCommun(f.kmAn(kmAn), s.pays[pays.id])}</p>
        <div className="duel-grille">
          <ConfigVehicule lettre="A" cfg={A} setCfg={setA} />
          <ConfigVehicule lettre="B" cfg={B} setCfg={setB} />
        </div>
        {(A.etat === "neuf" || B.etat === "neuf") && <p className="aide-ligne">{s.noteConvention[conv]}</p>}
        <details className="replie reglages">
          <summary>{s.communs}</summary>
          <Curseur id="detD" label={s.champ.detention} value={detention} min={2} max={15} step={1} unite={s.unites.ans}
            onChange={setDetention} format={f.ans} />
          {[A, B].some((c) => c.motorId === "phev") && (
            <Curseur id="phevD" label={s.champ.phev} aide={s.aide.phev} value={Math.round(phevShare * 100)}
              min={0} max={100} step={5} pas={1} unite="%" onChange={(x) => setPhevShare(x / 100)}
              format={(x) => f.pc(x / 100)} />
          )}
        </details>
      </section>

      <section className="verdict sombre" aria-live="polite">
        <p className="verdict-texte">
          {d === "serre"
            ? s.duelSerre(f.gkm(rA.perKm), f.gkm(rB.perKm))
            : s.duelGagne({
                l: d === "a" ? "A" : "B", desc: desc(d === "a" ? A : B),
                x: f.n1(Math.max(rA.perKm, rB.perKm) / Math.min(rA.perKm, rB.perKm)),
              })}
        </p>
      </section>

      <section className="carte">
        <Barres lignes={lignes.map(({ l, r, cfg }) => ({
          key: l, r, echelle: 100 / r.f.kmVous / max,
          nom: <><span className="badge" aria-hidden="true">{l}</span>{cap(desc(cfg))}</>,
          apres: ` ${s.duelLigne(f.km(r.f.kmVous))}`,
        }))} />
        <div className="legende">
          <span><span className="pastille pastille-fab" />{s.legFab}</span>
          <span><span className="pastille" />{s.legUse(f.gkwh(mixMoyen(pays.g, 8, decarb, pays.declin)), decarb)}</span>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ONGLET 3 — SE DÉPLACER AUTREMENT (ADEME Impact CO₂)
   ============================================================ */

// Échelle logarithmique 0,1 → 300 g/km : chaque ordre de grandeur occupe la même largeur
const LOG_MIN = Math.log10(0.1);
const LOG_MAX = Math.log10(300);
const posLog = (g) => (g <= 0.1 ? 0 : ((Math.log10(g) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100);
// Couleur séquentielle = position sur l'axe : lo → mid (0–50 %), puis mid → hi (50–100 %)
function teinte(p) {
  if (p <= 50) return { "--c1": "var(--seq-lo)", "--c2": "var(--seq-mid)", "--m": `${p * 2}%` };
  return { "--c1": "var(--seq-mid)", "--c2": "var(--seq-hi)", "--m": `${(p - 50) * 2}%` };
}
const TOUS_MODES = MODES.flatMap((fam) => fam.modes).sort((a, b) => a[1] - b[1]);
const VALEUR_MODE = Object.fromEntries(TOUS_MODES);
// Référence fixe : la voiture thermique avec le seul conducteur, point de départ de l'utilisateur
const REF_ID = "voitureThermique";
const REF = VALEUR_MODE[REF_ID];
const EXEMPLES = ["tgv", "busElec", "vae"];

// « 49 fois moins », « 1,5 fois plus », « autant » (écart < seuil des verdicts) par rapport à la référence
function rapport(s, f, g, ref) {
  if (g === 0) return s.rapport.zero;
  const r = g / ref;
  if (Math.abs(r - 1) < SEUIL_SERRE) return s.rapport.autant;
  const x = r < 1 ? 1 / r : r;
  const n = x < 10 ? f.n1(x) : f.n0(x);
  return r < 1 ? s.rapport.moins(n) : s.rapport.plus(n);
}

function Modes() {
  const f = useT();
  const { s } = f;

  return (
    <div>
      <section className="carte">
        <h2>{s.modesTitre}</h2>
        <p className="lede-carte">{s.modesIntro}</p>
        <p className="sous-titre">{s.ordresSous}</p>
        <p className="bascule resume-ref">
          {s.ordresResume(s.modes[REF_ID])}{" "}
          {EXEMPLES.map((id, i) => <span key={id}>{i > 0 && " · "}{s.modes[id]} : <strong>{rapport(s, f, VALEUR_MODE[id], REF)}</strong></span>)}
        </p>
        <div className="log" style={{ "--ref": `${posLog(REF)}%` }}>
          <div className="log-ligne log-entete" aria-hidden="true">
            <span className="log-axe">
              <span style={{ left: "0%" }}>0</span>
              {[1, 10, 100].map((t) => <span key={t} style={{ left: `${posLog(t)}%` }}>{f.n0(t)}</span>)}
              <span className="log-ref">{s.ordresRef(s.modes[REF_ID])}</span>
            </span>
            <span className="log-val">gCO₂e/km</span>
          </div>
          <ol className="log-lignes">
            {TOUS_MODES.map(([id, g]) => (
              <li key={id} className={id === REF_ID ? "log-ligne log-ligne-ref" : "log-ligne"}>
                <Icone mode={id} />
                <span className="log-nom">
                  {s.modes[id]}
                  <span className="log-rapport">{id === REF_ID ? s.rapport.ref : rapport(s, f, g, REF)}</span>
                </span>
                <span className="log-piste" aria-hidden="true"><span className="log-point" style={{ left: `${posLog(g)}%`, ...teinte(posLog(g)) }} /></span>
                <span className="log-val"><strong>{f.n1(g)}</strong></span>
              </li>
            ))}
          </ol>
          <p className="log-legende"><span className="trait-ref" aria-hidden="true" />{s.ordresRefLegende(s.modes[REF_ID], `${f.n1(REF)}${NB}g/km`)}</p>
          <p className="log-legende">{s.ordresLegende}</p>
        </div>
        {/* Source toujours visible (Licence Ouverte : citer la source) ; précautions repliées */}
        <p className="aide-ligne">
          <a href="https://impactco2.fr/outils/transport" target="_blank" rel="noreferrer">{s.modesSource}</a>
        </p>
        <Repli className="replie precautions" titre={s.modesLire}>
          <ul className="notes-modes">{s.modesNotes.map((n) => <li key={n}>{n}</li>)}</ul>
        </Repli>
      </section>
    </div>
  );
}

/* ============================================================
   PAGES DE LECTURE : MÉTHODE ET SOURCES, ÉCOCONCEPTION, MENTIONS LÉGALES
   ============================================================ */

function RetourOutil() {
  const { s } = useT();
  return <a className="retour" href="#">{s.retourOutil}</a>;
}

function PageMethode() {
  const { s } = useT();
  return (
    <article className="carte lecture">
      <RetourOutil />
      <h2 id="titre-page" tabIndex={-1}>{s.pages.methode}</h2>
      <p className="lede-carte">{s.methodeIntro}</p>
      <h3>{s.hypTitre(s.hyp.length)}</h3>
      <ol className="hyp">
        {s.hyp.map((h, i) => (
          <li key={i} id={`h${i + 1}`}>
            <strong>{s.prefixeHyp}{i + 1}. {h.t}.</strong> {lierHyp(h.d, s.prefixeHyp)}{" "}
            {HYP_REFS[i].map((r) => <a key={r} className="ref" href={`#methode/src-${r}`}>[{r}]</a>)}
          </li>
        ))}
      </ol>
      <h3>{s.sourcesTitre}</h3>
      <ol className="sources">
        {SOURCES.map((src, i) => (
          <li key={i} id={`src-${i + 1}`}>{src}{s.sourcesNotes[i + 1] && <> {s.sourcesNotes[i + 1]}</>}</li>
        ))}
      </ol>
    </article>
  );
}

const REFS_ECO = [
  ["EcoIndex (CNUMR / GreenIT.fr)", "https://www.ecoindex.fr/"],
  ["RGESN 2024 (Arcep, Arcom, DINUM, ADEME)", "https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/lempreinte-environnementale-du-numerique/referentiel-general-ecoconception-services-numeriques.html"],
  ["Green Claude (Institut du Numérique Responsable)", "https://github.com/Institut-du-Numerique-Responsable/green-claude"],
];

// Éditeur repris des mentions légales de pwablo.be (pwablo.be/terms) ; rien d'inventé
function PageMentions() {
  const { s } = useT();
  return (
    <article className="carte lecture">
      <RetourOutil />
      <h2 id="titre-page" tabIndex={-1}>{s.pages.mentions}</h2>
      {s.mentions.map(([titre, lignes]) => (
        <section key={titre}>
          <h3>{titre}</h3>
          {lignes.map((l, i) => <p key={i}>{l}</p>)}
        </section>
      ))}
    </article>
  );
}

function PageEco() {
  const { s } = useT();
  return (
    <article className="carte lecture eco">
      <RetourOutil />
      <h2 id="titre-page" tabIndex={-1}>{s.ecoTitre}</h2>
      <p className="lede-carte">{s.ecoIntro}</p>
      <h3>{s.ecoMesureTitre}</h3>
      <dl className="eco-mesures">
        {s.ecoMesures.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <h3>{s.ecoChoixTitre}</h3>
      <ul>{s.ecoChoix.map((c) => <li key={c}>{c}</li>)}</ul>
      <h3>{s.ecoLimitesTitre}</h3>
      <p>{s.ecoLimites}</p>
      <h3>{s.ecoRefs}</h3>
      <ul>{REFS_ECO.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer">{t}</a></li>)}</ul>
    </article>
  );
}

// <details> dont le contenu n'est rendu qu'une fois ouvert : DOM initial minimal (écoconception)
function Repli({ id, className, titre, children }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <details id={id} className={className} open={ouvert} onToggle={(e) => setOuvert(e.currentTarget.open)}>
      <summary>{titre}</summary>
      {ouvert && children}
    </details>
  );
}
