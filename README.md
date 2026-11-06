# AI Futures — Multiverse Expedition (playable prototype)
Three.js (vendored r149) + GSAP. No CDN, no build step, relative paths: works at https://quantforlife.github.io/AI-for-Futures/.
Test locally: `python3 -m http.server` then open localhost:8000 (file:// blocks textures).
Edit `js/config.js` for robot name, event name, logo, institution, drone image, coordinates (Bambolim 15.470750, 73.861944).
Replace `assets/images/college-drone.jpg` with another 360° equirectangular photo to change the campus. `college-entrance-reference.jpg` is the ground photo used as the modelling reference.
Credits: Earth textures = three.js example textures (MIT). All other geometry is procedural.
Deploy: put the CONTENTS of this folder (incl. `.nojekyll`) at the repo root, commit, push, Settings → Pages → main / root.
