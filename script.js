const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const projectCards = [...document.querySelectorAll(".project-card")];
const filterEmpty = document.querySelector("#filterEmpty");

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeIcon.textContent = theme === "light" ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  localStorage.setItem("yinyi-home-theme", theme);
}

const savedTheme = localStorage.getItem("yinyi-home-theme");
setTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    let visible = 0;
    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    filterEmpty.hidden = visible > 0;
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
