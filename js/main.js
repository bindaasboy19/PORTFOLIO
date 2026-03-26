(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.getElementById("site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const year = document.getElementById("year");
  const contactTimeField = document.getElementById("contact-time");
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

  const getEmailJsConfig = () => ({
    serviceId: form?.dataset.emailjsServiceId?.trim() || "",
    templateId: form?.dataset.emailjsTemplateId?.trim() || "",
    publicKey: form?.dataset.emailjsPublicKey?.trim() || "",
  });

  const hasPlaceholderValue = (value) => !value || value.startsWith("YOUR_");

  const isEmailJsConfigured = ({ serviceId, templateId, publicKey }) =>
    !hasPlaceholderValue(serviceId) && !hasPlaceholderValue(templateId) && !hasPlaceholderValue(publicKey);

  const populateContactMetadata = () => {
    if (contactTimeField) {
      contactTimeField.value = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  };

  form?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      resetFeedback();
    });
  });

  form?.addEventListener("submit", async (event) => {
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
    const originalButtonMarkup = submitButton?.innerHTML || "";
    const emailJsConfig = getEmailJsConfig();

    if (!window.emailjs || typeof window.emailjs.sendForm !== "function") {
      feedback.textContent = "Email service failed to load. Please try again later.";
      feedback.classList.add("is-error", "is-visible");
      return;
    }

    if (!isEmailJsConfigured(emailJsConfig)) {
      feedback.textContent =
        "EmailJS is not configured yet. Add your service ID, template ID, and public key in the contact form.";
      feedback.classList.add("is-error", "is-visible");
      return;
    }

    populateContactMetadata();
    submitButton?.setAttribute("disabled", "true");

    if (submitButton) {
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    }

    try {
      await window.emailjs.sendForm(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        form,
        {
          publicKey: emailJsConfig.publicKey,
        }
      );

      form.reset();
      populateContactMetadata();
      feedback.textContent = "Message sent successfully. Check your inbox for EmailJS delivery.";
      feedback.classList.add("is-success", "is-visible");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      feedback.textContent = "Message could not be sent right now. Please try again in a moment.";
      feedback.classList.add("is-error", "is-visible");
    } finally {
      submitButton?.removeAttribute("disabled");
      if (submitButton) {
        submitButton.innerHTML = originalButtonMarkup;
      }
    }
  });
})();
