(() => {
  const projectsGrid = document.getElementById("projects-grid");
  const projectsState = document.getElementById("projects-state");
  const filtersContainer = document.getElementById("project-filters");
  const statusText = document.getElementById("projects-status");
  const projectsUrl = "data/projects.json";

  let allProjects = [];
  let activeFilter = "All";

  if (!projectsGrid || !projectsState || !filtersContainer || !statusText) {
    return;
  }

  const normalizeProject = (project, index) => {
    const tech = Array.isArray(project.tech) ? project.tech : [];

    return {
      title: project.title || `Project ${index + 1}`,
      description: project.description || "Description coming soon.",
      tech: tech.length ? tech : ["Coming Soon"],
      github: typeof project.github === "string" ? project.github : "",
      live: typeof project.live === "string" ? project.live : "",
      status: project.status || project.Status || "In Progress",
    };
  };

  const setState = (type, message, showRetry = false) => {
    if (type === "ready") {
      projectsState.className = "projects-state is-hidden";
      projectsState.innerHTML = "";
      return;
    }

    const wrapper = document.createElement("div");
    const text = document.createElement("p");
    text.textContent = message;

    if (type === "loading") {
      const loader = document.createElement("div");
      loader.className = "loader";
      loader.setAttribute("aria-hidden", "true");
      wrapper.append(loader, text);
    } else {
      wrapper.append(text);

      if (showRetry) {
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "button button-secondary";
        retryButton.textContent = "Try Again";
        retryButton.addEventListener("click", loadProjects);
        wrapper.append(retryButton);
      }
    }

    projectsState.className = `projects-state is-${type}`;
    projectsState.innerHTML = "";
    projectsState.append(wrapper);
  };

  const updateStatus = (visibleCount) => {
    if (!allProjects.length) {
      statusText.textContent = "";
      return;
    }

    if (activeFilter === "All") {
      statusText.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
      return;
    }

    statusText.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"} filtered by ${activeFilter}`;
  };

  const createAction = (href, label, iconClass, isPrimary = false) => {
    const isAvailable = Boolean(href && href.trim());
    const element = document.createElement(isAvailable ? "a" : "span");
    const icon = document.createElement("i");
    const text = document.createElement("span");

    element.className = `project-link${isPrimary ? " project-link--primary" : ""}`;
    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");
    text.textContent = isAvailable ? label : `${label} Soon`;

    if (isAvailable) {
      element.href = href;
      element.target = "_blank";
      element.rel = "noreferrer";
    } else {
      element.setAttribute("aria-disabled", "true");
    }

    element.append(icon, text);
    return element;
  };

  const renderProjects = (projects) => {
    projectsGrid.innerHTML = "";

    if (!projects.length) {
      setState("empty", "No projects match the current filter.");
      updateStatus(0);
      return;
    }

    setState("ready");

    projects.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card glass-card";
      card.dataset.animate = "card";
      card.style.setProperty("--stagger-delay", `${index * 110}ms`);

      const top = document.createElement("div");
      top.className = "project-card__top";

      const title = document.createElement("h3");
      title.className = "project-card__title";
      title.textContent = project.title;

      const projectIndex = document.createElement("span");
      projectIndex.className = "project-index";
      projectIndex.textContent = String(index + 1).padStart(2, "0");

      const meta = document.createElement("div");
      meta.className = "project-card__meta";

      const status = document.createElement("span");
      status.className = "project-status";
      status.textContent = project.status;

      const description = document.createElement("p");
      description.className = "project-card__description";
      description.textContent = project.description;

      const techList = document.createElement("div");
      techList.className = "project-card__tech";

      project.tech.forEach((item) => {
        const chip = document.createElement("span");
        chip.className = "tech-chip";
        chip.textContent = item;
        techList.append(chip);
      });

      const actions = document.createElement("div");
      actions.className = "project-card__actions";
      actions.append(createAction(project.github, "GitHub", "fa-brands fa-github"));
      actions.append(
        createAction(project.live, "Live Demo", "fa-solid fa-arrow-up-right-from-square", true)
      );

      top.append(title, projectIndex);
      meta.append(status);
      card.append(top, meta, description, techList, actions);
      projectsGrid.append(card);
    });

    updateStatus(projects.length);
    window.requestAnimationFrame(() => {
      window.portfolioAnimations?.observeWithin(projectsGrid);
    });
  };

  const applyFilter = (filter) => {
    activeFilter = filter;

    filtersContainer.querySelectorAll(".filter-chip").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === filter);
    });

    const filteredProjects =
      filter === "All"
        ? allProjects
        : allProjects.filter((project) => project.tech.includes(filter));

    renderProjects(filteredProjects);
  };

  const renderFilters = (projects) => {
    const techFilters = new Set();

    projects.forEach((project) => {
      project.tech.forEach((tech) => techFilters.add(tech));
    });

    filtersContainer.innerHTML = "";

    ["All", ...Array.from(techFilters).sort()].forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-chip${filter === activeFilter ? " active" : ""}`;
      button.dataset.filter = filter;
      button.textContent = filter;
      button.addEventListener("click", () => applyFilter(filter));
      filtersContainer.append(button);
    });
  };

  const loadProjects = async () => {
    setState("loading", "Loading projects...");

    try {
      const response = await fetch(projectsUrl, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Projects JSON must be an array.");
      }

      allProjects = data.map(normalizeProject);
      activeFilter = "All";
      renderFilters(allProjects);
      renderProjects(allProjects);
    } catch (error) {
      console.error("Unable to load projects:", error);
      projectsGrid.innerHTML = "";
      statusText.textContent = "Unable to fetch project data.";
      setState(
        "error",
        "Projects could not be loaded. Start the site through a local server and try again.",
        true
      );
    }
  };

  loadProjects();
})();
