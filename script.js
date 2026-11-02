const themeToggle = document.querySelector("#themeToggle");
const mobileNavToggle = document.querySelector("#mobileNavToggle");
const mobileNav = document.querySelector("#mobileNav");

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  localStorage.setItem("yinyi-home-theme", theme);
}

const savedTheme = localStorage.getItem("yinyi-home-theme");
setTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => setTheme(document.body.classList.contains("dark") ? "light" : "dark"));

mobileNavToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  mobileNavToggle.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
});
mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => mobileNav.classList.remove("open")));

const sections = [...document.querySelectorAll(".section-block, .intro")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
}), { rootMargin: "-20% 0px -65% 0px" });
sections.forEach((section) => observer.observe(section));

document.querySelector("#year").textContent = new Date().getFullYear();
