// ============================================================
// CONFIGURATION
// Personal details, focus profiles and skills.
// Projects live in projects.json.
// ============================================================
const CONFIG = {
    githubUsername: "umut-hope",
    name: "Okan Umut Özen",
    email: "o.umut.ozenn@gmail.com",
    linkedin: "https://www.linkedin.com/in/okan-umut-%C3%B6zen-153a94305/",

    // Path to a CV PDF in this repo (e.g. "cv/okan-umut-ozen-cv.pdf").
    // Leave empty to hide the button. Per-focus CVs can be set in focusProfiles.
    cv: "cv/okan-umut-ozen-cv.pdf",

    // Project areas, in the order the filter tabs appear.
    areas: {
        web: "Web",
        ml: "ML & Data",
        game: "Games",
        hardware: "Hardware",
        core: "Java & OOP",
    },

    // Hero text for each ?focus= link. "default" is used without a focus.
    focusProfiles: {
        default: {
            headline: "Software engineer who builds things you can try.",
            intro: "Recent graduate working across web, machine learning, games and embedded systems. Some of the projects below run live in your browser.",
        },
        web: {
            headline: "Web developer building fast, useful browser tools.",
            intro: "I build typed, tested front ends with TypeScript and Svelte, and back ends with FastAPI and Docker. Two of my tools run live on this site.",
        },
        ml: {
            headline: "Software engineer focused on machine learning.",
            intro: "Data science intern at NTT DATA Business Solutions. My projects range from a reinforcement learning agent that drives in highway traffic to a computer vision classifier and a data collection pipeline.",
        },
        game: {
            headline: "Game developer and gaming tools builder.",
            intro: "Unity games in C#, mods in Lua, and browser tools that help players match and tune their aim across games.",
        },
        hardware: {
            headline: "Software engineer working close to the hardware.",
            intro: "Real-time telemetry and control for an RC car, from Arduino motor control and Raspberry Pi sensors to a PC dashboard.",
        },
        core: {
            headline: "Software engineer with solid Java and OOP foundations.",
            intro: "Projects that apply design patterns and data structures to real ordering systems, documented with UML.",
        },
    },

    location: "Tekirdağ, Turkey",

    about: [
        "I'm a software engineer who enjoys building software end to end, from the first idea to a working, tested product. I like to understand a problem properly before writing code, and I care about clear structure, readable code and software that is pleasant to use.",
        "I learn quickly and I'm comfortable moving between languages and areas, from web and backend to machine learning, games and embedded systems. I'm looking for a team where I can keep growing, take ownership of my work and contribute to real products.",
    ],

    // Experience and education, newest first.
    timeline: [
        {
            period: "2022 – 2026",
            title: "B.Sc. Software Engineering",
            place: "Bahçeşehir University",
            note: "Capstone: RC car telemetry and remote control system.",
        },
        {
            period: "Mar 2025 – May 2025",
            title: "Data Science Intern",
            place: "NTT DATA Business Solutions",
            note: "Supported data analysis, modeling and reporting. Built a fake news detector on Microsoft Azure.",
        },
        {
            period: "2023 – 2024",
            title: "Google Project Management certificates",
            place: "Google",
            note: "Foundations of Project Management · Project Initiation · Capstone: Applying Project Management in the Real World",
        },
    ],

    skills: {
        "Programming languages": ["Python", "TypeScript", "Java", "C#", "C++", "SQL", "Lua"],
        "Frameworks & libraries": ["Svelte", "FastAPI", "Playwright", "Unity", "Stable-Baselines3", "OpenCV", "scikit-learn", "Matplotlib"],
        Tools: ["Git", "Docker", "SQLite", "Microsoft Azure", "Vite", "Vitest", "Raspberry Pi", "Arduino"],
        "Spoken languages": ["English (C1)", "German (A1)", "Turkish (native)"],
    },

    // GitHub repos to leave out of the "More on GitHub" list.
    hiddenRepos: ["umut-hope.github.io"],
};
