# Okan Umut Özen — Portfolio

Personal portfolio site, live at **https://umut-hope.github.io/**.

Plain HTML, CSS and JavaScript, no build step. Hosted on GitHub Pages.

## Features

- **Curated projects** — `projects.json` holds each project's summary, highlights, tech stack, areas, live demo and image
- **Area filters** — Web, ML & Data, Games, Hardware, Java & OOP
- **Focus links** — `?focus=web`, `?focus=ml`, `?focus=game`, `?focus=hardware`, `?focus=core` put the matching
  projects first and change the hero text, so each application can link to the most relevant view
- **More on GitHub** — repositories not listed in `projects.json` appear automatically from the GitHub API
- **Responsive and accessible** — mobile menu, keyboard focus styles, reduced-motion support

## Editing

| File | What it holds |
|---|---|
| `config.js` | Contact details, CV path, hero text per focus, about text, timeline, skills |
| `projects.json` | Project cards |
| `style.css` | Theme colors and layout (Nord-inspired dark theme) |

To preview locally, serve the folder with any static server (opening `index.html` directly can't load `projects.json`).
