import { hydrate } from "preact";
import App from "./App.jsx";
import "./styles.css";

// La page arrive pré-rendue (vite.config.js, prerendu) : Preact reprend le HTML existant au lieu de le recréer
hydrate(<App />, document.getElementById("root"));
