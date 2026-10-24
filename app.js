// ============================================================
// PORTFOLIO APP
// Renders projects from projects.json, adds focus links
// (?focus=web|ml|game|hardware|core) and a GitHub repo list.
// ============================================================

(function () {
    "use strict";

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    const AREA_COLORS = {
        web: "var(--area-web)",
        ml: "var(--area-ml)",
        game: "var(--area-game)",
        hardware: "var(--area-hardware)",
        core: "var(--area-core)",
    };

    const ICON_EXTERNAL = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>`;
    const ICON_CODE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path></svg>`;

    let projects = [];
    let currentArea = "";

    // ---------- Helpers ----------
    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // GitHub descriptions sometimes contain Markdown; show them as plain text.
    function stripMarkdown(text) {
        return String(text ?? "")
            .replace(/\*\*(.+?)\*\*/g, "$1")
            .replace(/`(.+?)`/g, "$1")
            .replace(/\[(.+?)\]\(.+?\)/g, "$1");
    }

    function areaDot(area) {
        return `<span class="area-dot" style="background:${AREA_COLORS[area] || "var(--text-muted)"}" aria-hidden="true"></span>`;
    }

    function isValidArea(area) {
        return Object.prototype.hasOwnProperty.call(CONFIG.areas, area);
    }

    // ---------- Static content from config ----------
    function populateConfig() {
        $("#hero-location").textContent = CONFIG.location;
        $("#about-location").textContent = CONFIG.location;

        $("#about-text").innerHTML = CONFIG.about.map((p) => `<p>${esc(p)}</p>`).join("");

        const linkedin = $("#contact-linkedin");
        if (CONFIG.linkedin) linkedin.href = CONFIG.linkedin;
        else linkedin.hidden = true;

        const email = $("#contact-email");
        email.href = `mailto:${CONFIG.email}`;
        email.textContent = CONFIG.email;

        $("#footer-year").textContent = new Date().getFullYear();

        renderTimeline();
        renderSkills();
    }

    function renderTimeline() {
        const list = $("#timeline");
        const items = (CONFIG.timeline || []).filter((t) => t && t.title);
        if (!items.length) return;

        list.innerHTML = items
            .map(
                (t) => `
            <li>
                <p class="period">${esc(t.period)}</p>
                <p class="title">${esc(t.title)}</p>
                ${t.place ? `<p class="place">${esc(t.place)}</p>` : ""}
                ${t.note ? `<p class="note">${esc(t.note)}</p>` : ""}
            </li>`
            )
            .join("");
        $("#timeline-wrap").hidden = false;
    }

    function renderSkills() {
        $("#skills-grid").innerHTML = Object.entries(CONFIG.skills)
            .map(
                ([group, items]) => `
            <div class="skill-group reveal">
                <h3>${esc(group)}</h3>
                <ul>${items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            </div>`
            )
            .join("");
    }

    // ---------- Focus (hero text, CV, filter) ----------
    function applyFocus(area, { updateUrl = true } = {}) {
        currentArea = isValidArea(area) ? area : "";

        const profile = CONFIG.focusProfiles[currentArea] || CONFIG.focusProfiles.default;
        $("#hero-headline").textContent = profile.headline;
        $("#hero-intro").textContent = profile.intro;

        const cv = profile.cv || CONFIG.cv;
        const cvBtn = $("#cv-btn");
        cvBtn.hidden = !cv;
        if (cv) cvBtn.href = cv;

        $$(".area-item").forEach((el) => el.classList.toggle("active", el.dataset.area === currentArea));
        $$(".filter-btn").forEach((el) => {
            const active = el.dataset.area === currentArea;
            el.classList.toggle("active", active);
            el.setAttribute("aria-pressed", String(active));
        });

        renderProjects();

        if (updateUrl) {
            const url = new URL(window.location.href);
            if (currentArea) url.searchParams.set("focus", currentArea);
            else url.searchParams.delete("focus");
            history.replaceState(null, "", url);
        }
    }

    // ---------- Projects ----------
    async function loadProjects() {
        try {
            const res = await fetch("projects.json");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            projects = await res.json();
        } catch (err) {
            console.error("Could not load projects.json:", err);
            $("#projects-grid").innerHTML = `<p class="state-msg">Projects couldn't be loaded. See them on <a href="https://github.com/${esc(CONFIG.githubUsername)}">GitHub</a>.</p>`;
            return;
        }

        renderAreaList();
        renderFilters();

        const focus = new URLSearchParams(window.location.search).get("focus");
        applyFocus(focus, { updateUrl: false });

        loadGitHubRepos();
    }

    function countByArea(area) {
        return projects.filter((p) => p.areas.includes(area)).length;
    }

    function renderAreaList() {
        $("#area-list").innerHTML = Object.entries(CONFIG.areas)
            .filter(([key]) => countByArea(key) > 0)
            .map(
                ([key, label]) => `
            <li>
                <button class="area-item" data-area="${key}">
                    ${areaDot(key)}
                    <span class="area-name">${esc(label)}</span>
                    <span class="area-count">${countByArea(key)}</span>
                </button>
            </li>`
            )
            .join("");

        $("#area-list").addEventListener("click", (e) => {
            const btn = e.target.closest(".area-item");
            if (!btn) return;
            const area = btn.dataset.area === currentArea ? "" : btn.dataset.area;
            applyFocus(area);
            $("#projects").scrollIntoView();
        });

        const demos = projects.filter((p) => p.demo).length;
        $("#hero-summary").textContent = `${projects.length} projects · ${demos} live demos`;
    }

    function renderFilters() {
        const bar = $("#filter-bar");
        const buttons = [["", "All"], ...Object.entries(CONFIG.areas).filter(([key]) => countByArea(key) > 0)];

        bar.innerHTML = buttons
            .map(
                ([key, label]) => `
            <button class="filter-btn" data-area="${key}" aria-pressed="false">
                ${key ? areaDot(key) : ""}${esc(label)}
            </button>`
            )
            .join("");

        bar.addEventListener("click", (e) => {
            const btn = e.target.closest(".filter-btn");
            if (btn) applyFocus(btn.dataset.area);
        });
    }

    function sortProjects(list) {
        // Featured first, then the order in projects.json
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    function renderProjects() {
        const grid = $("#projects-grid");
        let html;

        // Featured and smaller cards go in separate blocks so rows stay even.
        const divider = (title) => `<h3 class="sub-title grid-divider">${title}</h3>`;
        const cards = (list, { wideFirst = false, compact = false } = {}) =>
            list.map((p, i) => projectCard(p, wideFirst && i === 0, compact)).join("");

        const inArea = currentArea ? projects.filter((p) => p.areas.includes(currentArea)) : projects;
        const featured = inArea.filter((p) => p.featured);
        const more = inArea.filter((p) => !p.featured);

        // A wide first card fills two of three columns; use it only when rows come out even.
        html = cards(featured, { wideFirst: (featured.length + 1) % 3 === 0 });
        if (more.length) html += (featured.length ? divider("More projects") : "") + cards(more);

        if (currentArea) {
            const others = sortProjects(projects.filter((p) => !p.areas.includes(currentArea)));
            if (others.length) html += divider("Other areas") + cards(others, { compact: true });
        }

        grid.innerHTML = html;
        observeReveal(grid.querySelectorAll(".reveal"));
        grid.querySelectorAll("video").forEach(setupVideo);
    }

    // Videos play only while on screen, and not at all with reduced motion.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const videoObserver =
        "IntersectionObserver" in window
            ? new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          const video = entry.target;
                          if (entry.isIntersecting && !reduceMotion.matches) {
                              video.play().catch(() => {});
                          } else {
                              video.pause();
                          }
                      });
                  },
                  { threshold: 0.4 }
              )
            : null;

    function setupVideo(video) {
        if (videoObserver) videoObserver.observe(video);
    }

    function projectCard(p, first, compact = false) {
        const repoUrl = `https://github.com/${CONFIG.githubUsername}/${p.repo}`;
        const big = p.featured && !compact;
        const wide = first && big ? " wide" : "";
        const mainArea = p.areas[0];

        // Featured cards always get a top visual: the screenshot, or a simple cover.
        // Any card outside the compact "Other areas" list shows its image when it has one.
        let visual = "";
        if (!compact && p.video) {
            visual = `
            <div class="project-image">
                <video src="${esc(p.video)}" muted loop playsinline preload="metadata" aria-label="${esc(p.title)} demo video"></video>
            </div>`;
        } else if (!compact && p.image) {
            visual = `<div class="project-image"><img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy"></div>`;
        } else if (big) {
            visual = `
            <div class="project-image project-cover" style="--cover:${AREA_COLORS[mainArea] || "var(--accent)"}" aria-hidden="true">
                <span class="cover-tech">${p.tech.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</span>
            </div>`;
        }

        const areas = p.areas
            .map((a) => `<span>${areaDot(a)}${esc(CONFIG.areas[a] || a)}</span>`)
            .join("");

        const highlights =
            big && p.highlights && p.highlights.length
                ? `<ul class="project-highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
                : "";

        return `
        <article class="project-card reveal${big ? " featured" : ""}${wide}">
            ${visual}
            <div class="project-main">
                <div class="project-body">
                    <div class="project-areas">${areas}</div>
                    <h3 class="project-title">${esc(p.title)}</h3>
                    <p class="project-summary">${esc(p.summary)}</p>
                    ${highlights}
                    <ul class="tech-list">${p.tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
                </div>
                <div class="project-links">
                    ${p.demo ? `<a class="demo" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ${ICON_EXTERNAL}</a>` : ""}
                    ${p.site ? `<a href="${esc(p.site)}" target="_blank" rel="noopener">Project page ${ICON_EXTERNAL}</a>` : ""}
                    <a href="${esc(repoUrl)}" target="_blank" rel="noopener">Code ${ICON_CODE}</a>
                </div>
            </div>
        </article>`;
    }

    // ---------- GitHub repos not in projects.json ----------
    async function loadGitHubRepos() {
        try {
            const res = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?per_page=100&sort=updated`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const repos = await res.json();

            const known = new Set(projects.map((p) => p.repo.toLowerCase()));
            const hidden = new Set(CONFIG.hiddenRepos.map((r) => r.toLowerCase()));
            const extra = repos.filter(
                (r) => !r.fork && !known.has(r.name.toLowerCase()) && !hidden.has(r.name.toLowerCase())
            );
            if (!extra.length) return;

            $("#repo-list").innerHTML = extra
                .map(
                    (r) => `
                <li>
                    <a href="${esc(r.html_url)}" target="_blank" rel="noopener">
                        <span class="repo-name">${esc(r.name)}</span>
                        <span class="repo-lang">${esc(r.language || "")}</span>
                        ${r.description ? `<span class="repo-desc">${esc(stripMarkdown(r.description))}</span>` : ""}
                    </a>
                </li>`
                )
                .join("");
            $("#more-repos").hidden = false;
        } catch (err) {
            // The curated list is enough; skip the extra list quietly.
            console.warn("GitHub repos not loaded:", err);
        }
    }

    // ---------- Reveal on scroll ----------
    const revealObserver =
        "IntersectionObserver" in window
            ? new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                              entry.target.classList.add("visible");
                              revealObserver.unobserve(entry.target);
                          }
                      });
                  },
                  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
              )
            : null;

    function observeReveal(elements) {
        elements.forEach((el) => (revealObserver ? revealObserver.observe(el) : el.classList.add("visible")));
    }

    // ---------- Navbar ----------
    function initNavbar() {
        const navbar = $("#navbar");
        const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // Highlight the link of the section in view
        const links = $$(".nav-link");
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        $$("main section[id]").forEach((s) => sectionObserver.observe(s));

        // Mobile menu
        const btn = $("#mobile-menu-btn");
        const menu = $("#nav-links");
        const setOpen = (open) => {
            btn.classList.toggle("active", open);
            menu.classList.toggle("open", open);
            btn.setAttribute("aria-expanded", String(open));
        };
        btn.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
        links.forEach((l) => l.addEventListener("click", () => setOpen(false)));
    }

    // ---------- Init ----------
    function init() {
        populateConfig();
        initNavbar();
        observeReveal($$(".reveal"));
        loadProjects();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
