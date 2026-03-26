(() => {
  const heroSection = document.getElementById("home");
  const lineTargets = Array.from(document.querySelectorAll("[data-typed-line]"));
  const caretTargets = Array.from(document.querySelectorAll("[data-typed-caret]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!heroSection || lineTargets.length === 0 || caretTargets.length === 0) {
    return;
  }

  const lines = [
    {
      text: "Hi, I'm Sanjeev.",
      baseSpeed: 70,
      variance: 30,
      pauseAfter: 240,
    },
    {
      text: "Web Developer & Graphic Designer.",
      baseSpeed: 60,
      variance: 25,
      pauseAfter: 200,
    },
    {
      text: "B.Tech CSE student at KIPM College, exploring Generative AI, Blockchain, and real-world problem solving through projects and communities.",
      baseSpeed: 26,
      variance: 18,
      pauseAfter: 0,
    },
  ];

  const setActiveCaret = (index, resting = false) => {
    caretTargets.forEach((caret, caretIndex) => {
      caret.classList.toggle("is-active", caretIndex === index && !resting);
      caret.classList.toggle("is-resting", caretIndex === index && resting);
    });
  };

  const completeHeroSequence = () => {
    heroSection.classList.add("hero-typed-complete");
    setActiveCaret(lines.length - 1, true);
    document.dispatchEvent(new CustomEvent("portfolio:hero-typed"));
  };

  if (prefersReducedMotion) {
    lines.forEach((line, index) => {
      const target = lineTargets[index];

      if (target) {
        target.textContent = line.text;
      }
    });

    window.setTimeout(completeHeroSequence, 80);
    return;
  }

  const typeLine = (lineIndex) => {
    const currentLine = lines[lineIndex];
    const currentTarget = lineTargets[lineIndex];

    if (!currentLine || !currentTarget) {
      completeHeroSequence();
      return;
    }

    let characterIndex = 0;
    setActiveCaret(lineIndex);

    const tick = () => {
      currentTarget.textContent = currentLine.text.slice(0, characterIndex);

      if (characterIndex < currentLine.text.length) {
        characterIndex += 1;

        const currentCharacter = currentLine.text[characterIndex - 1];
        const punctuationPause = /[.,]/.test(currentCharacter) ? 75 : 0;
        const nextDelay =
          currentLine.baseSpeed + Math.floor(Math.random() * currentLine.variance) + punctuationPause;

        window.setTimeout(tick, nextDelay);
        return;
      }

      if (lineIndex === lines.length - 1) {
        window.setTimeout(completeHeroSequence, 260);
        return;
      }

      window.setTimeout(() => typeLine(lineIndex + 1), currentLine.pauseAfter);
    };

    tick();
  };

  window.setTimeout(() => typeLine(0), 260);
})();
