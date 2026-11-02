# Yinyi Luo — Agent Builder Homepage

A lightweight, responsive academic-style personal homepage for Yinyi Luo, built with plain HTML, CSS, and JavaScript. It includes a browser-side research-agent demo so visitors can interact with the site rather than only read a project list.

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
