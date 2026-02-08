const ThemeManager = (() => {
    let themes = null;
    let active = "base";
    const listeners = new Set();

    async function init() {
        if (themes) return;
        const res = await fetch("/webJsonData/themes.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`themes.json failed (${res.status})`);
        themes = await res.json();

        const saved = sessionStorage.getItem("activeTheme");
        if (saved && themes[saved]) active = saved;
    }

    function get(path, fallback = null) {
        const t = themes?.[active];
        if (!t) return fallback;
        return path.split(".").reduce((o, k) => (o && k in o ? o[k] : undefined), t) ?? fallback;
    }

    function setTheme(name) {
        if (!themes?.[name]) return false;
        if (name === active) return true;
        active = name;
        sessionStorage.setItem("activeTheme", active);
        for (const fn of listeners) fn(active);
        return true;
    }

    function subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    function getThemeName() {
        return active;
    }

    return { init, get, setTheme, subscribe, getThemeName };
})();

export default ThemeManager;
