(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.getElementById("site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const year = document.getElementById("year");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setNavigationState = (isOpen) => {
    if (!navToggle || !navPanel) {
      return;
    }

    navToggle.classList.toggle("is-open", isOpen);
    navPanel.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavigationState(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!navPanel || !navToggle) {
      return;
    }

    const clickedInsideNavigation = navPanel.contains(event.target) || navToggle.contains(event.target);

    if (!clickedInsideNavigation) {
      setNavigationState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavigationState(false);
    }
  });

  const scrollToSection = (hash) => {
    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      event.preventDefault();
      scrollToSection(hash);
      history.replaceState(null, "", hash);
      setNavigationState(false);
    });
  });

  const setActiveLink = (activeId) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0.12,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const clearFieldError = (field) => {
    const fieldWrapper = field.closest(".form-field");
    const errorElement = fieldWrapper?.querySelector(".form-error");

    fieldWrapper?.classList.remove("has-error");

    if (errorElement) {
      errorElement.textContent = "";
    }
  };

  const setFieldError = (field, message) => {
    const fieldWrapper = field.closest(".form-field");
    const errorElement = fieldWrapper?.querySelector(".form-error");

    fieldWrapper?.classList.add("has-error");

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const resetFeedback = () => {
    if (!feedback) {
      return;
    }

    feedback.textContent = "";
    feedback.className = "form-feedback";
  };

  form?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      resetFeedback();
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!feedback) {
      return;
    }

    const nameField = form.querySelector("#name");
    const emailField = form.querySelector("#email");
    const messageField = form.querySelector("#message");
    const fields = [nameField, emailField, messageField];
    let isValid = true;

    resetFeedback();
    fields.forEach((field) => clearFieldError(field));

    if (!nameField.value.trim()) {
      setFieldError(nameField, "Please enter your name.");
      isValid = false;
    }

    if (!emailField.value.trim()) {
      setFieldError(emailField, "Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(emailField.value.trim())) {
      setFieldError(emailField, "Please enter a valid email address.");
      isValid = false;
    }

    if (!messageField.value.trim()) {
      setFieldError(messageField, "Please add a short message.");
      isValid = false;
    }

    if (!isValid) {
      feedback.textContent = "Please fix the highlighted fields and try again.";
      feedback.classList.add("is-error", "is-visible");
      return;
    }

    const submitButton = form.querySelector(".form-submit");
    submitButton?.setAttribute("disabled", "true");

    window.setTimeout(() => {
      form.reset();
      submitButton?.removeAttribute("disabled");
      feedback.textContent = "Message sent successfully. Thanks for reaching out.";
      feedback.classList.add("is-success", "is-visible");
    }, prefersReducedMotion ? 120 : 520);
  });
})();
