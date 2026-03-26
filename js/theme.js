(() => {
  const storageKey = "portfolio-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };

  const writeStoredTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {}
  };

  const getPreferredTheme = () => {
    const storedTheme = readStoredTheme();

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return themeMedia.matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    const icon = toggle?.querySelector("i");
    const nextIcon = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    root.dataset.theme = theme;

    if (!toggle || !icon) {
      return;
    }

    icon.className = nextIcon;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("title", label);
    toggle.setAttribute("aria-label", label);
  };

  applyTheme(getPreferredTheme());

  toggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    writeStoredTheme(nextTheme);
    applyTheme(nextTheme);
  });

  const handleSystemThemeChange = (event) => {
    const storedTheme = readStoredTheme();

    if (storedTheme === "light" || storedTheme === "dark") {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof themeMedia.addEventListener === "function") {
    themeMedia.addEventListener("change", handleSystemThemeChange);
  } else if (typeof themeMedia.addListener === "function") {
    themeMedia.addListener(handleSystemThemeChange);
  }
})();
