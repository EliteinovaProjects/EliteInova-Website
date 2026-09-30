const themeButton = document.querySelector("#theme-toggle");
const menuButton = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
const themeStorageKey = "eliteinova-theme";
const themeRoot = document.documentElement;

const getSavedTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const setTheme = (theme) => {
  const isDark = theme === "dark";
  themeRoot.dataset.theme = isDark ? "dark" : "light";
  if (!themeButton) return;
  themeButton.setAttribute("aria-pressed", String(isDark));
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  themeButton.setAttribute("aria-label", label);
  themeButton.setAttribute("title", label);
};

setTheme(getSavedTheme());

themeButton?.addEventListener("click", () => {
  const nextTheme = themeRoot.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch {
    // The in-memory theme still works when storage is unavailable.
  }
});

const closeMenu = () => {
  mainNav?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
};

menuButton?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

mainNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
