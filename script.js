/**
 * TrabaHanapPH front-end logic
 * - Loads jobs from jobs.json (acts like a simple backend data source)
 * - Provides keyword, location, and type filters
 * - Handles mobile navigation menu
 */

const jobsContainer = document.getElementById("jobsContainer");
const keywordInput = document.getElementById("keywordInput");
const locationSelect = document.getElementById("locationSelect");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
const loadingJobs = document.getElementById("loadingJobs");
const jobError = document.getElementById("jobError");
const filterChips = document.querySelectorAll(".filter-chip");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let activeType = "all";
let allJobs = [];

/* MOBILE NAVIGATION */

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a nav link (on mobile)
  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A" && window.innerWidth <= 720) {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* FILTER CHIP HANDLERS */

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => {
      c.classList.remove("active");
      c.setAttribute("aria-checked", "false");
    });
    chip.classList.add("active");
    chip.setAttribute("aria-checked", "true");
    activeType = chip.dataset.type;
    renderJobs();
  });
});

/* SEARCH BUTTON + ENTER KEY */

searchBtn.addEventListener("click", () => {
  renderJobs();
});

keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    renderJobs();
  }
});

/* FILTER LOGIC */

function matchesFilters(job) {
  const keyword = keywordInput.value.trim().toLowerCase();
  const location = locationSelect.value;

  // Type filter
  if (activeType !== "all" && job.type !== activeType) {
    return false;
  }

  // Location filter
  if (location && job.location !== location) {
    return false;
  }

  // Keyword filter (title, company, description)
  if (keyword) {
    const haystack =
      (job.title + job.company + job.description + (job.skills || []).join(" ")).toLowerCase();
    if (!haystack.includes(keyword)) {
      return false;
    }
  }

  return true;
}

/* RENDER JOB CARDS */

function renderJobs() {
  jobsContainer.innerHTML = "";

  if (!allJobs || allJobs.length === 0) {
    noResults.classList.add("hidden");
    return;
  }

  const filteredJobs = allJobs.filter(matchesFilters);

  if (filteredJobs.length === 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }

  filteredJobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <div class="job-header">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <p class="job-company">${job.company}</p>
        </div>
        <span class="job-badge">${job.type}</span>
      </div>

      <div class="job-meta">
        <span class="meta-pill">📍 ${job.location}</span>
        <span class="meta-pill">${job.remote ? "🏠 Remote-friendly" : "🏢 On-site"}</span>
        <span class="meta-pill">💰 ${job.salary}</span>
      </div>

      <p class="job-description">${job.description}</p>

      <div class="skills-row">
        ${(job.skills || [])
          .map((skill) => `<span class="skill-pill">${skill}</span>`)
          .join("")}
      </div>

      <div class="job-footer">
        <button class="apply-btn">Apply Now</button>
        <span class="posted-date">Posted: ${job.posted}</span>
      </div>
    `;

    const applyBtn = card.querySelector(".apply-btn");
    applyBtn.addEventListener("click", () => {
      if (job.applyLink) {
        window.open(job.applyLink, "_blank");
      } else {
        alert("Walang nakalagay na application link para sa trabahong ito.");
      }
    });

    jobsContainer.appendChild(card);
  });
}

/* LOAD JOBS FROM jobs.json */

async function loadJobs() {
  try {
    loadingJobs.classList.remove("hidden");
    jobError.classList.add("hidden");
    noResults.classList.add("hidden");

    const response = await fetch("jobs.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("jobs.json is not an array");
    }

    allJobs = data;
    loadingJobs.classList.add("hidden");

    if (allJobs.length === 0) {
      noResults.textContent =
        "Wala pang nakalagay na trabaho sa jobs.json. Puwede kang magdagdag ng jobs sa file na iyon.";
      noResults.classList.remove("hidden");
    } else {
      renderJobs();
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
    loadingJobs.classList.add("hidden");
    jobError.classList.remove("hidden");
  }
}

loadJobs();
