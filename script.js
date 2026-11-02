const themeToggle = document.querySelector("#themeToggle");
const mobileNavToggle = document.querySelector("#mobileNavToggle");
const mobileNav = document.querySelector("#mobileNav");
const agentForm = document.querySelector("#agentForm");
const agentInput = document.querySelector("#agentInput");
const agentLog = document.querySelector("#agentLog");

const responses = [
  { match: ["30", "version", "who", "about", "yinyi"], trace: ["classify → profile", "retrieve → research map", "compose → short answer"], answer: "Yinyi is a Ph.D. student at Carnegie Mellon University. His research focuses on agentic AI systems, unified multimodal models, and multimodal reasoning." },
  { match: ["building", "build", "project", "work"], trace: ["classify → project tour", "retrieve → selected projects", "compose → three entry points"], answer: "AgentArk explores planning, memory, tools, and feedback. TorchUMM is a PyTorch space for unified multimodal models. xLARD is a playground for inspecting and evaluating model behavior." },
  { match: ["experiment", "multimodal", "design", "research"], trace: ["parse → multimodal task", "plan → perceive / reason / act", "draft → evaluation loop"], answer: "A useful starting point: give an agent an image, a small tool belt, and a goal that cannot be solved by recognition alone. Log its visual evidence, plan, tool calls, and final action; evaluate whether each step reduced uncertainty." },
  { match: ["agent", "loop", "framework", "how"], trace: ["classify → agentic systems", "retrieve → context and tools", "compose → framework summary"], answer: "The central loop is to gather context, make a plan, act through tools, observe feedback, and update the next step. The research challenge is making this loop reliable, measurable, and useful across modalities." },
];

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

function escapeHtml(value) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function selectResponse(prompt) { const text = prompt.toLowerCase(); return responses.find((entry) => entry.match.some((word) => text.includes(word))) || { trace: ["classify → open question", "retrieve → research map", "compose → starting point"], answer: "I’m a small homepage demo, so I know the research map better than the whole internet. Try asking about Yinyi’s projects, agentic frameworks, or a multimodal experiment." }; }
function scrollLog() { agentLog.scrollTop = agentLog.scrollHeight; }
function addUser(prompt) { const node = document.createElement("div"); node.className = "agent-message user"; node.innerHTML = `<div><p>${escapeHtml(prompt)}</p></div>`; agentLog.append(node); scrollLog(); }
function addThinking() { const node = document.createElement("div"); node.className = "agent-message thinking"; node.innerHTML = '<div class="agent-avatar">A</div><div><div class="message-meta"><strong>research-agent</strong><span>working…</span></div><p>thinking · · ·</p></div>'; agentLog.append(node); scrollLog(); return node; }
function addBot(response) { const node = document.createElement("div"); node.className = "agent-message bot"; node.innerHTML = `<div class="agent-avatar">A</div><div><div class="message-meta"><strong>research-agent</strong><span>now</span></div><div class="trace">${response.trace.map((line, index) => `<div class="trace-line ${index === response.trace.length - 1 ? "active" : "done"}"><span>${index === response.trace.length - 1 ? "›" : "✓"}</span>${line}</div>`).join("")}</div><p>${response.answer}</p></div>`; agentLog.append(node); scrollLog(); }
const delay = (time) => new Promise((resolve) => window.setTimeout(resolve, time));

async function runAgent(prompt) {
  const clean = prompt.trim();
  if (!clean || agentForm.dataset.busy === "true") return;
  agentForm.dataset.busy = "true";
  agentInput.value = "";
  agentInput.disabled = true;
  agentForm.querySelector("button").disabled = true;
  addUser(clean);
  const thinking = addThinking();
  await delay(420);
  thinking.remove();
  addBot(selectResponse(clean));
  agentInput.disabled = false;
  agentForm.querySelector("button").disabled = false;
  agentForm.dataset.busy = "false";
  agentInput.focus();
}

agentForm.addEventListener("submit", (event) => { event.preventDefault(); runAgent(agentInput.value); });
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => runAgent(button.dataset.prompt)));
agentInput.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") runAgent(agentInput.value); });

const sections = [...document.querySelectorAll(".section-block, .intro")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)); }), { rootMargin: "-20% 0px -65% 0px" });
sections.forEach((section) => observer.observe(section));
document.querySelector("#year").textContent = new Date().getFullYear();
