/**
 * Simple front-end logic for Trabaho PH
 * No external libraries, pure JavaScript.
 */

// Sample jobs (static data)
const jobs = [
  {
    title: "Junior Web Developer",
    company: "Mabuhay Tech Solutions",
    location: "Metro Manila",
    type: "Full-time",
    salary: "PHP 25,000 - 35,000 / month",
    posted: "3 days ago",
    remote: false,
    skills: ["HTML", "CSS", "JavaScript", "Git"],
    description:
      "Tulong sa paggawa at pag-maintain ng company websites. Open sa fresh graduates na may basic web dev skills.",
    applyLink: "mailto:hr@mabuhaytech.ph?subject=Application%20-%20Junior%20Web%20Developer"
  },
  {
    title: "Online ESL Teacher",
    company: "Bayan Learning Center",
    location: "Remote",
    type: "Part-time",
    salary: "PHP 180 - 230 / hour",
    posted: "1 week ago",
    remote: true,
    skills: ["English Communication", "Teaching", "Zoom"],
    description:
      "Mag-turo ng English sa mga bata at adults online. May training at provided na lesson materials.",
    applyLink: "mailto:jobs@bayanlearning.ph?subject=Application%20-%20Online%20ESL%20Teacher"
  },
  {
    title: "Registered Nurse",
    company: "Pag-asa Medical Center",
    location: "Cebu",
    type: "Full-time",
    salary: "PHP 30,000 - 45,000 / month",
    posted: "2 days ago",
    remote: false,
    skills: ["Nursing", "Patient Care", "BLS/ACLS"],
    description:
      "Magbibigay ng nursing care sa mga pasyente sa medical-surgical ward. Open sa may valid PRC license.",
    applyLink: "mailto:careers@pagasamedical.ph?subject=Application%20-%20Registered%20Nurse"
  },
  {
    title: "Customer Support Representative",
    company: "IslaConnect BPO",
    location: "Davao",
    type: "Contract",
    salary: "PHP 28,000 - 32,000 / month",
    posted: "5 days ago",
    remote: false,
    skills: ["Communication", "Customer Service", "Call Center"],
    description:
      "Sasagot sa tawag at chat ng customers. Night shift; may night differential at allowances.",
    applyLink: "mailto:apply@islaconnect.ph?subject=Application%20-%20Customer%20Support%20Representative"
  },
  {
    title: "Graphic Design Intern",
    company: "Likhain Studio",
    location: "Metro Manila",
    type: "Internship",
    salary: "Allowance + portfolio experience",
    posted: "Today",
    remote: true,
    skills: ["Canva", "Photoshop", "Creativity"],
    description:
      "Tutulong sa paggawa ng social media posts at marketing materials. Open sa students.",
    applyLink: "mailto:hello@likhainstudio.ph?subject=Application%20-%20Graphic%20Design%20Intern"
  }
];

const jobsContainer = document.getElementById("jobsContainer");
const keywordInput = document.getElementById("keywordInput");
const locationSelect = document.getElementById("locationSelect");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
const filterChips = document.querySelectorAll(".filter-chip");

let activeType = "all";

// Change active type when clicking filter chips
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeType = chip.dataset.type;
    renderJobs();
  });
});

// Search button
searchBtn.addEventListener("click", () => {
  renderJobs();
});

// Allow pressing Enter inside keyword input to search
keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    renderJobs();
  }
});

/**
 * Check if job matches filters
 */
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
      (job.title + job.company + job.description).toLowerCase();
    if (!haystack.includes(keyword)) {
      return false;
    }
  }

  return true;
}

/**
 * Render job cards based on current filters
 */
function renderJobs() {
  jobsContainer.innerHTML = "";

  const filteredJobs = jobs.filter(matchesFilters);

  if (filteredJobs.length === 0) {
    noResults.classList.remove("hidden");
    return;
  } else {
    noResults.classList.add("hidden");
  }

  filteredJobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";

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
        ${job.skills
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
      window.location.href = job.applyLink;
    });

    jobsContainer.appendChild(card);
  });
}

// Initial render
renderJobs();
