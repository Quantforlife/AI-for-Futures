# AI Futures Goa — The Journey
Three.js globe + GSAP ScrollTrigger + MapLibre (Panaji). Everything is vendored in `vendor/` and `assets/`; all paths are relative, so it works at https://quantforlife.github.io/AI-for-Futures/ with no CDN.
Run locally: `python3 -m http.server` (opening index.html via file:// blocks texture loading).
Deploy: put the *contents* of this folder (including `.nojekyll`) at the repo root, commit, push; Settings → Pages → branch/root.
Data: Earth textures are three.js example textures (MIT). City map = Esri World Imagery raster tiles (no token; keep the attribution; check Esri's terms for your traffic). 3D buildings/terrain need a vector/terrain provider (e.g. MapTiler key) and are not included.
Waitlist: set `endpoint` in `js/config.js` (see `apps-script/Code.gs`). Empty endpoint = labelled demo, nothing saved.
