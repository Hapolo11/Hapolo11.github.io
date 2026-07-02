const GITHUB_USERNAME = "Hapolo11";
const DISPLAY_NAME = "Hapolo Luiz";
// Repos to hide from the auto-loaded grid (profile README repo, anything already featured by hand).
const EXCLUDE_REPOS = [GITHUB_USERNAME.toLowerCase()];

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Shell: "#89e051",
};

document.getElementById("year").textContent = new Date().getFullYear();

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${url}`);
  return res.json();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "hoje";
  if (days < 30) return `${days}d atrás`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "mês" : "meses"} atrás`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "ano" : "anos"} atrás`;
}

function renderProfile(user) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || DISPLAY_NAME;
  if (user.bio) document.getElementById("tagline").textContent = user.bio;

  const stats = [
    { label: "Repositórios", value: user.public_repos },
    { label: "Seguidores", value: user.followers },
    { label: "Seguindo", value: user.following },
  ];
  document.getElementById("stats").innerHTML = stats
    .map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
    .join("");
}

function renderRepos(repos) {
  const grid = document.getElementById("repo-grid");

  const visible = repos
    .filter((r) => !r.fork && !EXCLUDE_REPOS.includes(r.name.toLowerCase()))
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at));

  if (!visible.length) {
    grid.innerHTML = '<p class="empty">Nenhum repositório encontrado.</p>';
    return;
  }

  grid.innerHTML = visible
    .map((repo) => {
      const lang = repo.language;
      const dotColor = lang && LANG_COLORS[lang] ? LANG_COLORS[lang] : "var(--accent)";
      return `
        <article class="repo-card">
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
          <p>${repo.description ? escapeHTML(repo.description) : "Sem descrição."}</p>
          <div class="repo-meta">
            ${lang ? `<span><span class="lang-dot" style="background:${dotColor}"></span>${lang}</span>` : ""}
            <span>★ ${repo.stargazers_count}</span>
            <span>${timeAgo(repo.pushed_at)}</span>
          </div>
        </article>`;
    })
    .join("");

  renderSkills(visible);
}

function renderSkills(repos) {
  const counts = {};
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });

  const manualExtras = ["FastAPI", "SQLAlchemy", "PostgreSQL", "LLM / Groq"];
  const languages = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const skills = [...new Set([...languages, ...manualExtras])];

  const skillsGrid = document.getElementById("skills-grid");
  if (!skills.length) {
    skillsGrid.innerHTML = '<p class="empty">Nenhuma tecnologia detectada.</p>';
    return;
  }
  skillsGrid.innerHTML = skills.map((s) => `<span class="skill-chip">${s}</span>`).join("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function init() {
  try {
    const [user, repos] = await Promise.all([
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
    ]);
    renderProfile(user);
    renderRepos(repos);
  } catch (err) {
    console.error(err);
    document.getElementById("repo-grid").innerHTML =
      '<p class="error">Não foi possível carregar os repositórios agora. Tente novamente mais tarde.</p>';
    document.getElementById("skills-grid").innerHTML = "";
  }
}

init();
