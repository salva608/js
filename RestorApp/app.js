import { router } from "./routes/router.js";

const app = document.getElementById("app");

export function render(content) {
  app.innerHTML = content;
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
