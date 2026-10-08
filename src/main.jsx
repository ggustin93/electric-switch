import { hydrate } from "preact";
import App from "./App.jsx";
import { pageDuChemin } from "./routes.js";
import "./styles.css";

// La page arrive pré-rendue (vite.config.js, prerendu) : Preact reprend le HTML existant au lieu de le recréer.
// La page (outil ou lecture) se lit dans l'adresse, comme le build l'a choisie pour ce fichier (ADR 0009).
hydrate(<App page={pageDuChemin(location.pathname)} />, document.getElementById("root"));
