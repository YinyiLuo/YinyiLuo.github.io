# Yinyi Luo — Academic Homepage

A clean, responsive academic-style personal homepage for Yinyi Luo, adapted to the structure of common academic GitHub Pages templates. It includes a small browser-side research-agent demo alongside research interests and selected projects.

## Run locally

From this directory:

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Customize

- Update the copy and project links in `index.html`.
- Change colors and layout in `styles.css`.
- Theme switching, mobile navigation, and the interactive agent demo live in `script.js`.

The current agent is self-contained and does not call an API. Replace `responses` and `runAgent()` in `script.js` with a backend request when a real agent endpoint is ready.
