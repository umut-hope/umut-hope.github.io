// ============================================================
// PORTFOLIO APP - Main Application Logic
// Fetches GitHub data and populates the site dynamically
// ============================================================

(function () {
    "use strict";

    // ---------- Language Colors ----------
    const LANGUAGE_COLORS = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        Python: "#3572A5",
        Java: "#b07219",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#178600",
        Go: "#00ADD8",
        Rust: "#dea584",
        Ruby: "#701516",
        PHP: "#4F5D95",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Dart: "#00B4AB",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Shell: "#89e051",
        Lua: "#000080",
        R: "#198CE7",
        MATLAB: "#e16737",
        Jupyter: "#F37626",
        "Jupyter Notebook": "#DA5B0B",
        Vue: "#41b883",
        SCSS: "#c6538c",
        Dockerfile: "#384d54",
        Makefile: "#427819",
    };

    // ---------- DOM Elements ----------
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    // ---------- Populate Static Content from Config ----------
    function populateConfig() {
        // Hero
        const heroNameEl = $("#hero-name");
        if (heroNameEl) heroNameEl.textContent = CONFIG.name;

        const heroTitleEl = $("#hero-title");
        if (heroTitleEl) heroTitleEl.textContent = CONFIG.title;

        const heroBioEl = $("#hero-bio");
        if (heroBioEl) heroBioEl.textContent = CONFIG.bio;

        // Code window
        const codeNameEl = $("#code-name");
        if (codeNameEl) codeNameEl.textContent = `"${CONFIG.name}"`;

        const codeRoleEl = $("#code-role");
        if (codeRoleEl) codeRoleEl.textContent = `"${CONFIG.title}"`;

        // About
        const aboutDescEl = $("#about-description");
        if (aboutDescEl) aboutDescEl.textContent = CONFIG.aboutDescription;

        const aboutLocationEl = $("#about-location");
        if (aboutLocationEl) aboutLocationEl.textContent = CONFIG.location;

        const aboutGithubLinkEl = $("#about-github-link");
        if (aboutGithubLinkEl) {
            aboutGithubLinkEl.href = `https://github.com/${CONFIG.githubUsername}`;
            aboutGithubLinkEl.textContent = `github.com/${CONFIG.githubUsername}`;
        }

        // Contact
        const contactEmailEl = $("#contact-email");
        if (contactEmailEl) contactEmailEl.textContent = CONFIG.email;

        const contactEmailLinkEl = $("#contact-email-link");
        if (contactEmailLinkEl) contactEmailLinkEl.href = `mailto:${CONFIG.email}`;

        const contactGithubEl = $("#contact-github");
        if (contactGithubEl) contactGithubEl.textContent = `github.com/${CONFIG.githubUsername}`;

        const contactGithubCardEl = $("#contact-github-card");
        if (contactGithubCardEl) contactGithubCardEl.href = `https://github.com/${CONFIG.githubUsername}`;

        // LinkedIn
        if (CONFIG.linkedin) {
            const contactLinkedinCardEl = $("#contact-linkedin-card");
            if (contactLinkedinCardEl) contactLinkedinCardEl.href = CONFIG.linkedin;
        } else {
            const contactLinkedinCardEl = $("#contact-linkedin-card");
            if (contactLinkedinCardEl) contactLinkedinCardEl.style.display = "none";
        }

        // Footer
        const footerYearEl = $("#footer-year");
        if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();

        const footerNameEl = $("#footer-name");
        if (footerNameEl) footerNameEl.textContent = CONFIG.name;

        // Page title
        document.title = `${CONFIG.name} | ${CONFIG.title}`;

        // Skills
        populateSkills();
    }

    // ---------- Skills ----------
    function populateSkills() {
        const grid = $("#skills-grid");
        if (!grid || !CONFIG.skills.length) return;

        grid.innerHTML = CONFIG.skills
            .map(
                (skill) => `
            <div class="skill-card reveal">
                <span class="skill-icon">${skill.icon}</span>
                <span class="skill-name">${skill.name}</span>
            </div>
        `
            )
            .join("");
    }

    // ---------- Fetch GitHub Data ----------
    async function fetchGitHubData() {
        const username = CONFIG.githubUsername;
        if (!username || username === "YOUR_GITHUB_USERNAME") {
            showRepoError("Please set your GitHub username in config.js");
            return;
        }

        try {
            // Fetch user profile and repos in parallel
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
            ]);

            if (!userRes.ok || !reposRes.ok) {
                throw new Error("GitHub API request failed");
            }

            const user = await userRes.json();
            const repos = await reposRes.json();

            populateUserData(user);
            populateRepos(repos);
        } catch (err) {
            console.error("Error fetching GitHub data:", err);
            showRepoError("Failed to load repositories. Check your GitHub username in config.js");
        }
    }

    // ---------- Populate User Data ----------
    function populateUserData(user) {
        // Avatar
        const avatarContainer = $("#about-avatar");
        if (avatarContainer && user.avatar_url) {
            avatarContainer.innerHTML = `<img src="${user.avatar_url}" alt="${user.name || CONFIG.name}" loading="lazy">`;
        }

        // Location fallback
        if (user.location && CONFIG.location === "Your City, Country") {
            const locationEl = $("#about-location");
            if (locationEl) locationEl.textContent = user.location;
        }

        // Company
        if (user.company) {
            const companyEl = $("#about-company");
            if (companyEl) companyEl.textContent = user.company;
        }

        // Bio fallback
        if (user.bio && CONFIG.bio === "Passionate developer building impactful software. Explore my repositories and projects below.") {
            const heroBioEl = $("#hero-bio");
            if (heroBioEl) heroBioEl.textContent = user.bio;
        }
    }

    // ---------- Populate Repos ----------
    let allRepos = [];

    function populateRepos(repos) {
        // Filter hidden repos and forks
        allRepos = repos
            .filter((r) => !r.fork && !CONFIG.hiddenRepos.includes(r.name))
            .slice(0, CONFIG.maxRepos);

        // Sort: pinned first, then by stars, then by updated
        allRepos.sort((a, b) => {
            const aPinned = CONFIG.pinnedRepos.includes(a.name) ? 1 : 0;
            const bPinned = CONFIG.pinnedRepos.includes(b.name) ? 1 : 0;
            if (aPinned !== bPinned) return bPinned - aPinned;
            if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        // Update stats
        const totalStars = allRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const totalForks = allRepos.reduce((sum, r) => sum + r.forks_count, 0);

        animateNumber($("#stat-repos"), allRepos.length);
        animateNumber($("#stat-stars"), totalStars);
        animateNumber($("#stat-forks"), totalForks);

        // Build language filters
        buildFilters(allRepos);

        // Render repos
        renderRepos(allRepos);

        // Show View All CTA
        const cta = $("#repos-cta");
        if (cta) {
            cta.style.display = "block";
            const viewAllLink = $("#view-all-repos");
            if (viewAllLink) viewAllLink.href = `https://github.com/${CONFIG.githubUsername}?tab=repositories`;
        }
    }

    function renderRepos(repos) {
        const grid = $("#repos-grid");
        if (!grid) return;

        if (repos.length === 0) {
            grid.innerHTML = `
                <div class="loading-state">
                    <p>No repositories found for this filter.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = repos
            .map(
                (repo) => `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card reveal" data-language="${repo.language || "Other"}">
                <div class="repo-header">
                    <svg class="repo-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span class="repo-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </span>
                </div>
                <h3 class="repo-name">${repo.name}</h3>
                <p class="repo-description">${repo.description || "No description provided."}</p>
                ${
                    repo.topics && repo.topics.length
                        ? `<div class="repo-topics">${repo.topics
                              .slice(0, 4)
                              .map((t) => `<span class="repo-topic">${t}</span>`)
                              .join("")}</div>`
                        : ""
                }
                <div class="repo-meta">
                    ${
                        repo.language
                            ? `<span class="repo-language">
                            <span class="language-dot" style="background:${LANGUAGE_COLORS[repo.language] || "#8b8b9e"}"></span>
                            ${repo.language}
                        </span>`
                            : ""
                    }
                    <span class="repo-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        ${repo.stargazers_count}
                    </span>
                    <span class="repo-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
                        ${repo.forks_count}
                    </span>
                </div>
            </a>
        `
            )
            .join("");

        // Trigger reveal animation
        requestAnimationFrame(() => initScrollReveal());
    }

    function showRepoError(message) {
        const grid = $("#repos-grid");
        if (!grid) return;
        grid.innerHTML = `
            <div class="error-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <p>${message}</p>
            </div>
        `;
    }

    // ---------- Filters ----------
    function buildFilters(repos) {
        const bar = $("#filter-bar");
        if (!bar) return;

        const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
        languages.sort();

        bar.innerHTML =
            `<button class="filter-btn active" data-filter="all">All</button>` +
            languages
                .map(
                    (lang) =>
                        `<button class="filter-btn" data-filter="${lang}">${lang}</button>`
                )
                .join("");

        bar.addEventListener("click", (e) => {
            const btn = e.target.closest(".filter-btn");
            if (!btn) return;

            $$(".filter-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            const filtered =
                filter === "all"
                    ? allRepos
                    : allRepos.filter((r) => r.language === filter);

            renderRepos(filtered);
        });
    }

    // ---------- Animate Number ----------
    function animateNumber(el, target) {
        if (!el) return;
        const duration = 1500;
        const start = performance.now();
        const initial = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(initial + (target - initial) * eased);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ---------- Scroll Reveal ----------
    function initScrollReveal() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        $$(".reveal").forEach((el) => observer.observe(el));
    }

    // ---------- Navbar Scroll ----------
    function initNavbar() {
        const navbar = $("#navbar");
        let lastScroll = 0;

        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
            lastScroll = scrollY;
        });

        // Active link tracking
        const sections = $$("section[id]");
        const navLinks = $$(".nav-link");

        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${current}`) {
                    link.classList.add("active");
                }
            });
        });
    }

    // ---------- Mobile Menu ----------
    function initMobileMenu() {
        const btn = $("#mobile-menu-btn");
        const links = $(".nav-links");

        if (!btn || !links) return;

        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            links.classList.toggle("open");
        });

        // Close menu on link click
        $$(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                btn.classList.remove("active");
                links.classList.remove("open");
            });
        });
    }

    // ---------- Smooth Scroll ----------
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const target = document.querySelector(link.getAttribute("href"));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    // ---------- Init ----------
    function init() {
        populateConfig();
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveal();
        fetchGitHubData();
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
