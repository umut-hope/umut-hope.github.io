# 🚀 Developer Portfolio

A sleek, modern portfolio website that dynamically pulls your projects and profile data from the GitHub API. Zero build tools required — just edit one config file and deploy.

## ✨ Features

- **Live GitHub Integration** — Automatically fetches your repositories, avatar, stats, and profile info via the GitHub API
- **Single-File Configuration** — All personal details are managed in `config.js`; no need to touch the HTML
- **Language Filtering** — Filter displayed repos by programming language with dynamically generated filter buttons
- **Animated Stats** — Repo count, stars, and forks animate into view with smooth easing
- **Responsive Design** — Fully mobile-friendly with a collapsible hamburger menu
- **Glassmorphism UI** — Modern glass-card effects, gradient accents, and subtle micro-animations
- **Scroll Reveal Animations** — Elements fade in as you scroll using IntersectionObserver
- **Pinning & Hiding Repos** — Pin specific repos to the top or hide ones you don't want shown
- **Dark Theme** — Premium dark color scheme with vibrant gradient highlights
- **No Dependencies** — Pure HTML, CSS, and vanilla JavaScript — no frameworks, no build step

## 📁 Project Structure

```
portfolio-site/
├── index.html   # Page structure and semantic HTML
├── style.css    # All styling — layout, animations, glassmorphism, responsive
├── config.js    # ⚙️  Your personal configuration (edit this!)
├── app.js       # Application logic — GitHub fetch, rendering, interactions
└── README.md    # You are here
```

## 🛠️ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. **Edit `config.js`** with your information

   ```js
   const CONFIG = {
     githubUsername: "your-github-username",  // Required
     name: "Your Name",
     title: "Software Engineer",
     bio: "A short tagline for the hero section.",
     aboutDescription: "A longer paragraph about you.",
     location: "Your City, Country",
     email: "you@example.com",
     linkedin: "https://linkedin.com/in/your-profile",
     skills: [
       { name: "JavaScript", icon: "⚡", color: "#f1e05a" },
       { name: "Python",     icon: "🐍", color: "#3572A5" },
       // ...add more
     ],
     maxRepos: 12,
     pinnedRepos: ["repo-to-pin"],
     hiddenRepos: ["repo-to-hide"],
   };
   ```

3. **Open `index.html`** in your browser — that's it!

   You can also use a local dev server for live reload:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```

## ⚙️ Configuration Reference

| Property           | Type       | Description                                              |
| ------------------ | ---------- | -------------------------------------------------------- |
| `githubUsername`    | `string`   | **Required.** Your GitHub username for API fetches       |
| `name`             | `string`   | Display name shown in hero, footer, and code window      |
| `title`            | `string`   | Professional title / role                                |
| `bio`              | `string`   | Short hero section tagline                               |
| `aboutDescription` | `string`   | Longer bio for the About section                         |
| `location`         | `string`   | Your location                                            |
| `email`            | `string`   | Contact email address                                    |
| `linkedin`         | `string`   | LinkedIn profile URL (leave `""` to hide the card)       |
| `skills`           | `array`    | Array of `{ name, icon, color }` objects                 |
| `maxRepos`         | `number`   | Maximum number of repositories to display                |
| `pinnedRepos`      | `string[]` | Repo names to pin at the top of the grid                 |
| `hiddenRepos`      | `string[]` | Repo names to exclude from the grid                      |

## 🌐 Deployment

### GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the branch (e.g. `main`) and root (`/`).
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Netlify / Vercel

Simply connect the repository — no build command or output directory is needed since this is a static site.

### Any Static Host

Upload `index.html`, `style.css`, `config.js`, and `app.js` to any static file host.

## 📝 Notes

- **GitHub API Rate Limits** — Unauthenticated requests are limited to 60/hour. For normal portfolio usage this is more than enough, but if you hit the limit during development, wait a few minutes.
- **Fallbacks** — If you leave `bio` or `location` at their default values, the app will automatically use the corresponding values from your GitHub profile.
- **Topics** — Repos with GitHub topics will display them as tags on the card. Add topics to your repos on GitHub for richer cards.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
