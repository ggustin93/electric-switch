/* Icônes de modes de transport — tracés issus de Tabler Icons (MIT, © Paweł Kuna, tabler.io/icons),
   fusionnés en un seul chemin par icône (2 nœuds DOM). Trait 1,75 px, sans remplissage. */

const TRACES = {
  marche: "M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M7 21l3 -4M16 21l-2 -4l-3 -3l1 -6M6 12l2 -3l4 -1l3 3l3 1",
  velo: "M2 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0M16 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0M12 19v-4l-3 -3l5 -4l2 3h3M13.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
  trottinette: "M16 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M8 17h5a6 6 0 0 1 5 -5v-5a2 2 0 0 0 -2 -2h-1",
  deuxRoues: "M2 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M16 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M7.5 14h5l4 -4h-10.5m1.5 4l4 -4M13 6h2l1.5 3l2 4",
  bus: "M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8M16 5l1.5 7l4.5 0M2 10l15 0M7 5l0 5M12 5l0 5",
  train: "M21 13c0 -3.87 -3.37 -7 -10 -7h-8M3 15h16a2 2 0 0 0 2 -2M3 6v5h17.5M3 11v4M8 11v-5M13 11v-4.5M3 19h18",
  voiture: "M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5",
  avion: "M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3l4 7",
};
const ECLAIR = "M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11";

// Mode → icône de base ; `elec` ajoute un éclair (même famille de tracés)
export const ICONE_MODE = {
  marche: ["marche"], velo: ["velo"], vae: ["velo", true], trottinette: ["trottinette", true],
  tgv: ["train"], tram: ["train"], metro: ["train"], intercites: ["train"], rer: ["train"], ter: ["train"],
  busElec: ["bus", true], autocar: ["bus"], busThermique: ["bus"],
  covoitElec: ["voiture", true], voitureElec: ["voiture", true], covoitThermique: ["voiture"], voitureThermique: ["voiture"],
  scooterElec: ["deuxRoues", true], scooter: ["deuxRoues"], moto: ["deuxRoues"],
  avionCO2: ["avion"], avion: ["avion"],
};

export function Icone({ mode }) {
  const [nom, elec] = ICONE_MODE[mode];
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden="true">
      <path d={TRACES[nom]} />
      {elec && <path className="eclair" transform="translate(13 -1) scale(.5)" d={ECLAIR} />}
    </svg>
  );
}
