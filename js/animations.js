(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bootIndicator = document.querySelector("[data-boot-indicator]");
  const bootText = bootIndicator?.querySelector(".boot-indicator__text");
  const stages = Array.from(document.querySelectorAll(".write-stage"));
  let heroReady = false;
  let hideQueued = false;

  const updateBoot = (message) => {
    if (bootText) {
      bootText.textContent = message;
    }
  };

  const hideBoot = () => {
    if (bootIndicator) {
      bootIndicator.classList.add("is-hidden");
    }
  };

  let animationObserver = null;

  const observeWithin = (scope = document) => {
    const animatedElements = scope.querySelectorAll("[data-animate]:not([data-animate-bound])");

    animatedElements.forEach((element) => {
      element.dataset.animateBound = "true";

      if (prefersReducedMotion || !animationObserver) {
        element.classList.add("is-visible");
        return;
      }

      animationObserver.observe(element);
    });
  };

  const maybeHideBoot = () => {
    const allStagesWritten = stages.every((stage) => stage.classList.contains("is-written"));

    if (!allStagesWritten || !heroReady || hideQueued) {
      return;
    }

    hideQueued = true;
    updateBoot("All sections live");
    window.setTimeout(hideBoot, 700);
  };

  const activateStage = (stage) => {
    if (!stage || stage.classList.contains("is-written")) {
      return;
    }

    stage.classList.add("is-written");
    observeWithin(stage);
    maybeHideBoot();
  };

  window.portfolioAnimations = {
    observeWithin,
    activateStage,
    updateBoot,
  };

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            animationObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );
  }

  observeWithin(document);

  if (prefersReducedMotion) {
    stages.forEach((stage) => stage.classList.add("is-written"));
    heroReady = true;
    updateBoot("Motion reduced");
    window.setTimeout(hideBoot, 250);
    return;
  }

  updateBoot("Preparing hero sequence...");

  let stageObserver = null;

  if ("IntersectionObserver" in window) {
    stageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateStage(entry.target);
            stageObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -16% 0px",
      }
    );
  }

  stages
    .filter((stage) => !stage.classList.contains("is-written"))
    .forEach((stage, index) => {
      window.setTimeout(() => activateStage(stage), 900 + index * 320);
      stageObserver?.observe(stage);
    });

  document.addEventListener(
    "portfolio:hero-typed",
    () => {
      heroReady = true;
      updateBoot("Hero sequence complete");
      maybeHideBoot();
    },
    { once: true }
  );

  window.setTimeout(() => {
    if (!heroReady) {
      updateBoot("Writing interface live...");
    }
  }, 700);

  window.setTimeout(() => {
    if (!hideQueued) {
      hideBoot();
    }
  }, 6500);
})();
