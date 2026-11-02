const themeToggle = document.querySelector("#themeToggle");
const mobileNavToggle = document.querySelector("#mobileNavToggle");
const mobileNav = document.querySelector("#mobileNav");
const agentForm = document.querySelector("#agentForm");
const agentInput = document.querySelector("#agentInput");
const agentLog = document.querySelector("#agentLog");

const responses = [
  { match: ["30", "version", "who", "about", "yinyi"], trace: ["classify → profile", "retrieve → research map", "compose → short answer"], answer: "Yinyi is an AI/ML researcher and builder at Carnegie Mellon University. The short version: he works on multimodal models and agents — systems that can perceive the world, reason over it, use tools, and take a useful next step." },
  { match: ["building", "build", "project", "work"], trace: ["classify → project tour", "retrieve → selected builds", "compose → three doors in"], answer: "There are three good doors in: AgentArk explores planning, memory, tools, and feedback; TorchUMM is a PyTorch space for unified multimodal models; xLARD is a playground for turning model behavior into repeatable experiments. Start with AgentArk if you want the agent-shaped answer." },
  { match: ["experiment", "multimodal", "design", "research"], trace: ["parse → multimodal task", "plan → perceive / reason / act", "draft → evaluation loop"], answer: "A useful starting experiment: give an agent an image, a small tool belt, and a goal that cannot be solved by recognition alone. Log its visual evidence, plan, tool calls, and final action. Evaluate not only the answer, but whether each step reduced uncertainty." },
  { match: ["agent", "loop", "think", "how"], trace: ["classify → agent philosophy", "retrieve → perceive / reason / act", "compose → loop explanation"], answer: "The useful loop is simple to say and hard to make reliable: perceive context, make a plan, act through tools, observe feedback, then try again. The goal is not to make a model look clever — it is to make the next action better than the last one." },
];

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.innerHTML = theme === "dark" ? "Light mode <span>☼</span>" : "Dark mode <span>◐</span>";
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

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function selectResponse(prompt) {
  const text = prompt.toLowerCase();
  return responses.find((entry) => entry.match.some((word) => text.includes(word))) || { trace: ["classify → open question", "retrieve → research map", "compose → useful starting point"], answer: "I’m a small homepage agent, so I know the research map better than the whole internet. Try asking what Yinyi is building, how he thinks about agents, or ask for a multimodal experiment." };
}

function scrollLog() { agentLog.scrollTop = agentLog.scrollHeight; }
function addUser(prompt) { const node = document.createElement("div"); node.className = "agent-message user"; node.innerHTML = `<div><p>${escapeHtml(prompt)}</p></div>`; agentLog.append(node); scrollLog(); }
function addThinking() { const node = document.createElement("div"); node.className = "agent-message thinking"; node.innerHTML = '<div class="agent-avatar">A</div><div><div class="message-meta"><strong>research-agent</strong><span>working…</span></div><p>thinking <span>·</span><span>·</span><span>·</span></p></div>'; agentLog.append(node); scrollLog(); return node; }
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
document.querySelector("#year").textContent = new Date().getFullYear();
