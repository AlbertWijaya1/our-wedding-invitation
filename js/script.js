  const app = document.getElementById("app");
  const supportedWeddingThemes = [
    "dark-luxury",
    "chinese-luxury",
    "ivory-gold"
  ];

  function applyWeddingTheme() {
    const requestedTheme = wedding?.theme || "dark-luxury";

    const activeTheme = supportedWeddingThemes.includes(requestedTheme)
      ? requestedTheme
      : "dark-luxury";

    document.documentElement.dataset.weddingTheme = activeTheme;
  }

  applyWeddingTheme();


  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
  }

  function getInvitedGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get("to");

    if (!guestName) return "";

    return escapeHtml(
      guestName
        .trim()
        .slice(0, 80)
    );
  }

  let currentScene = "arrival";
  let parallaxStarted = false;

  function renderScene(sceneName) {
    const scene = scenes[sceneName];

    app.classList.add("fade-out");

    setTimeout(() => {
  if (scene.type === "weddingHero") {
    renderWeddingHeroScene(scene);
  } else if (scene.type === "box") {
    renderMemoryBoxScene(scene);
  } else if (scene.type === "photo") {
    renderPhotoScene(scene);
  } else {
    renderTextScene(scene);
  }
      app.classList.remove("fade-out");
    }, 450);
  }

  function renderTextScene(scene) {
    app.innerHTML = `
      <section class="scene">
        <div class="scene-content">
          <p class="small-text">${scene.smallText}</p>
          <h1>${scene.title}</h1>
          <p class="intro-text">${scene.body}</p>

          ${
            scene.button
              ? `<button id="nextBtn">${scene.button}</button>`
              : ""
          }
        </div>
      </section>
    `;

    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn && scene.next) {
      nextBtn.addEventListener("click", () => {
        renderScene(scene.next);
      });
    }
  }

  function renderWeddingHeroScene(scene) {
    const invitedGuestName = getInvitedGuestName();
    app.innerHTML = `
      <section class="scene wedding-hero-scene">
        <div class="wedding-hero">
        ${
          invitedGuestName
            ? `
              <div class="wedding-guest-introduction">
                <span>Especially for</span>
                <strong>${invitedGuestName}</strong>
              </div>
            `
            : ""
        }
          <div class="wedding-names" aria-label="${scene.groomName} and ${scene.brideName}">
            <span class="wedding-name wedding-name-groom">
              ${scene.groomName}
            </span>

            <span class="wedding-ampersand" aria-hidden="true">
              &amp;
            </span>

            <span class="wedding-name wedding-name-bride">
              ${scene.brideName}
            </span>
          </div>

          <div class="wedding-hero-divider" aria-hidden="true"></div>

          <div class="wedding-invitation-copy">
            <p class="wedding-family-text">
              ${scene.familyText}
            </p>

            <p class="wedding-invitation-text">
              ${scene.invitationText}
            </p>

            <p class="wedding-future-text">
              ${scene.futureText}
            </p>
          </div>

          <button
            class="wedding-open-button"
            id="weddingOpenBtn"
            type="button"
          >
            ${scene.button}
          </button>

        </div>
      </section>
    `;

    const openButton = document.getElementById("weddingOpenBtn");

    if (!openButton || !scene.next) return;

    openButton.addEventListener("click", () => {
      openButton.disabled = true;
      openButton.classList.add("is-opening");

      /*
        Browsers normally require a direct user interaction
        before audio is allowed to play.
      */
      unlockExtraAudio();
      startBackgroundMusic();

      setTimeout(() => {
        renderScene(scene.next);
      }, 900);
    });
  }


  function renderMemoryBoxScene(scene) {
    app.innerHTML = `
      <section class="scene memory-box-scene">
        <div class="scene-content memory-box-scene-content">
          <p class="small-text">${scene.smallText}</p>
          <h1>${scene.title}</h1>
          <p class="intro-text">${scene.body}</p>

          <button
            class="memory-box"
            id="memoryBoxBtn"
            type="button"
            aria-label="Open invitation case"
          >
            <div class="box-lid"></div>
            <div class="box-body"></div>
            <div class="box-glow"></div>
          </button>
        </div>

        <div
          class="invitation-reveal"
          id="invitationReveal"
          aria-hidden="true"
        >
          <div class="invitation-reveal-glow"></div>

          <div class="invitation-paper">
            <div class="invitation-paper-mark">囍</div>

            <div class="invitation-paper-ornament">
              <span></span>
              <i>✦</i>
              <span></span>
            </div>
          </div>

          <div class="invitation-reveal-wash"></div>
        </div>
      </section>
    `;

    const memoryBoxBtn = document.getElementById("memoryBoxBtn");
    const invitationReveal = document.getElementById("invitationReveal");
    const sceneContent = document.querySelector(
      ".memory-box-scene-content"
    );

    if (!memoryBoxBtn || !invitationReveal) return;

    let isOpening = false;

    memoryBoxBtn.addEventListener("click", () => {
      if (isOpening) return;

      isOpening = true;

      memoryBoxBtn.disabled = true;
      memoryBoxBtn.classList.add("open");

      sceneContent?.classList.add("is-opening");
      invitationReveal.classList.add("is-active");

      document.body.classList.add(
        "invitation-transition-active"
      );

      unlockExtraAudio();
      startBackgroundMusic();

      setTimeout(() => {
        renderStory();

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });

        document.body.classList.remove(
          "invitation-transition-active"
        );
      }, 2750);
    });
  }
  function renderPhotoScene(scene) {
    app.innerHTML = `
      <section class="scene photo-scene">
        <div class="photo-card">
          <div class="photo-placeholder">
            ${scene.image ? `<img src="${scene.image}" alt="${scene.title}">` : "Photo coming soon"}
          </div>

          <div class="photo-text">
            <p class="small-text">${scene.smallText}</p>
            <h1>${scene.title}</h1>
            <p class="intro-text">${scene.body}</p>

            ${
              scene.button
                ? `<button id="nextBtn">${scene.button}</button>`
                : ""
            }
          </div>
        </div>
      </section>
    `;

    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn && scene.next) {
      nextBtn.addEventListener("click", () => {
        renderScene(scene.next);
      });
    }
  }

  function renderStory() {

    app.innerHTML = "";

  const storyOrder = [
    "chapterIntro",
    "weddingDetails",
    "ourJourney",
    "guestDetails",
    "futurePromise",
    "closingInvitation"
  ];
    storyOrder.forEach(sceneName => {

      const scene = scenes[sceneName];

      const section = document.createElement("section");

      section.className = "story-section reveal";
      section.dataset.scene = sceneName;
    if (scene.type === "formalInvitation") {

      section.innerHTML = `
        <div class="formal-invitation-card">

          <p class="formal-invitation-family reveal-child delay-1">
            ${scene.smallText}
          </p>

          <div class="formal-invitation-ornament reveal-child delay-2">
            <span></span>
            <span class="formal-invitation-symbol">✦</span>
            <span></span>
          </div>

          <div class="formal-invitation-names reveal-child delay-2">
            <span>${scene.groomName}</span>
            <em>&amp;</em>
            <span>${scene.brideName}</span>
          </div>

          <p class="formal-invitation-request reveal-child delay-3">
            ${scene.invitationLine}
          </p>

          <p class="formal-invitation-celebration reveal-child delay-3">
            ${scene.celebrationLine}
          </p>

        </div>
      `;

    } else if (scene.type === "weddingDetails") {

      const ceremony = scene.ceremony;
      const reception = scene.reception;
      const isConcept = wedding.projectStatus === "concept";

      function renderWeddingEvent(event) {
        if (isConcept) {
          return `
            <article class="wedding-event-card wedding-event-card-concept reveal">

              <p class="wedding-event-label">
                ${event.label}
              </p>

              <div class="wedding-event-concept-symbol" aria-hidden="true">
                ✦
              </div>

              <h2 class="wedding-event-concept-title">
                Details to Follow
              </h2>

              <p class="wedding-event-concept-copy">
                The date, time and venue will be announced
                when everything is ready.
              </p>

            </article>
          `;
        }

        return `
          <article class="wedding-event-card reveal">

            <p class="wedding-event-label">
              ${event.label}
            </p>

            <h2>${event.day}</h2>

            <p class="wedding-event-date">
              ${event.date}
            </p>

            <div class="wedding-event-divider"></div>

            <p class="wedding-event-time">
              ${event.time}
            </p>

            <p class="wedding-event-venue">
              ${event.venueName}
            </p>

            <p class="wedding-event-address">
              ${event.venueAddress}
            </p>

            ${
              event.mapsLink
                ? `
                  <a
                    class="wedding-maps-button"
                    href="${event.mapsLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                  </a>
                `
                : ""
            }

          </article>
        `;
      }

      section.innerHTML = `
        <div class="wedding-details-card">

          <p class="small-text reveal-child delay-1">
            ${scene.smallText}
          </p>

          <h1 class="reveal-child delay-2">
            ${scene.title}
          </h1>

          <p class="wedding-details-notice reveal-child delay-3">
            ${scene.notice}
          </p>

          <div class="wedding-event-grid">
            ${renderWeddingEvent(ceremony)}
            ${renderWeddingEvent(reception)}
          </div>

        </div>
      `;
        } else if (scene.type === "guestDetails") {

      const invitedGuestName = getInvitedGuestName();

      const hasRsvpLink =
        scene.rsvp.formLink ||
        scene.rsvp.acceptLink ||
        scene.rsvp.declineLink ||
        scene.rsvp.whatsappNumber;

      const whatsappHref = scene.rsvp.whatsappNumber
        ? `https://wa.me/${scene.rsvp.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
            scene.rsvp.whatsappMessage
          )}`
        : "";

      section.innerHTML = `
        <div class="guest-details-card">

          <p class="small-text reveal-child delay-1">
            ${scene.smallText}
          </p>

          <h1 class="reveal-child delay-2">
            ${scene.title}
          </h1>

          ${
            invitedGuestName
              ? `
                <p class="guest-details-personal reveal-child delay-3">
                  Dear ${invitedGuestName},
                </p>
              `
              : ""
          }

          <div class="guest-detail-grid">

            <article class="guest-detail-panel reveal">
              <div class="guest-detail-symbol" aria-hidden="true">
                ◇
              </div>

              <p class="guest-detail-label">
                ${scene.dressCode.title}
              </p>

              ${
                scene.isConcept
                  ? `
                    <h2>Details to Follow</h2>

                    <p>
                      ${scene.dressCode.note}
                    </p>
                  `
                  : `
                    <h2>${scene.dressCode.description}</h2>

                    ${
                      scene.dressCode.note
                        ? `<p>${scene.dressCode.note}</p>`
                        : ""
                    }
                  `
              }
            </article>

            <article class="guest-detail-panel reveal">
              <div class="guest-detail-symbol" aria-hidden="true">
                ✦
              </div>

              <p class="guest-detail-label">
                RSVP
              </p>

              ${
                scene.isConcept
                  ? `
                    <h2>Opening Later</h2>

                    <p>
                      RSVP will become available once our wedding date and venue have been confirmed.
                    </p>
                  `
                  : `
                    <h2>Will You Join Us?</h2>

                    ${
                      scene.rsvp.deadline
                        ? `
                          <p class="guest-rsvp-deadline">
                            Kindly respond by ${scene.rsvp.deadline}.
                          </p>
                        `
                        : ""
                    }

                    <div class="guest-rsvp-actions">

                      ${
                        scene.rsvp.formLink
                          ? `
                            <a
                              class="guest-action-button"
                              href="${scene.rsvp.formLink}"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              RSVP
                            </a>
                          `
                          : ""
                      }

                      ${
                        scene.rsvp.acceptLink
                          ? `
                            <a
                              class="guest-action-button"
                              href="${scene.rsvp.acceptLink}"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Joyfully Accept
                            </a>
                          `
                          : ""
                      }

                      ${
                        scene.rsvp.declineLink
                          ? `
                            <a
                              class="guest-action-button guest-action-secondary"
                              href="${scene.rsvp.declineLink}"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Unable to Attend
                            </a>
                          `
                          : ""
                      }

                      ${
                        whatsappHref
                          ? `
                            <a
                              class="guest-action-button"
                              href="${whatsappHref}"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              RSVP via WhatsApp
                            </a>
                          `
                          : ""
                      }

                      ${
                        !hasRsvpLink
                          ? `
                            <p class="guest-detail-unavailable">
                              RSVP information will be added soon.
                            </p>
                          `
                          : ""
                      }

                    </div>
                  `
              }
            </article>

          </div>

          ${
            !scene.isConcept && scene.gift.enabled
              ? `
                <article class="wedding-gift-panel reveal">

                  <p class="guest-detail-label">
                    Wedding Gift
                  </p>

                  <h2>Your Presence Is Our Gift</h2>

                  <p class="wedding-gift-introduction">
                    ${scene.gift.introduction}
                  </p>

                  ${
                    scene.gift.bankName &&
                    scene.gift.accountName &&
                    scene.gift.accountNumber
                      ? `
                        <div class="wedding-bank-details">
                          <span>${scene.gift.bankName}</span>

                          <strong>${scene.gift.accountNumber}</strong>

                          <p>${scene.gift.accountName}</p>

                          <button
                            class="guest-action-button"
                            type="button"
                            data-copy-account="${scene.gift.accountNumber}"
                          >
                            Copy Account Number
                          </button>
                        </div>
                      `
                      : ""
                  }

                  ${
                    scene.gift.qrisImage
                      ? `
                        <div class="wedding-qris">
                          <img
                            src="${scene.gift.qrisImage}"
                            alt="Wedding gift QRIS"
                          >
                        </div>
                      `
                      : ""
                  }

                </article>
              `
              : ""
          }

        </div>
      `;

    } else if (scene.type === "weddingClosing") {

      section.innerHTML = `
        <div class="wedding-closing-card">

          <p class="wedding-closing-small reveal-child delay-1">
            ${scene.smallText}
          </p>

          <div class="wedding-closing-symbol reveal-child delay-2">
            ✦
          </div>

          <h1 class="reveal-child delay-2">
            ${scene.title}
          </h1>

          <p class="wedding-closing-body reveal-child delay-3">
            ${scene.body}
          </p>

          <p class="wedding-closing-signature reveal-child delay-3">
            ${scene.signature}
          </p>

        </div>
      `;

    } else if (scene.type === "holdHand") {  
        section.innerHTML = `
          <div class="hold-hand-card">
            <p class="small-text reveal-child delay-1">${scene.smallText}</p>
            <h1 class="reveal-child delay-2">${scene.title}</h1>
            <p class="intro-text reveal-child delay-3">${scene.body}</p>

            <button class="hold-hand-button" id="holdHandBtn" aria-label="Hold my hand">
              <span class="hold-hand-icon">♡</span>
              <span class="hold-hand-progress"></span>
            </button>

            <p class="hold-hand-instruction" id="holdHandInstruction">
              Press and hold.
            </p>
          </div>
        `;

        } else if (scene.type === "letter") {

          section.innerHTML = `
            <div class="letter-card">
              <p class="small-text reveal-child delay-1">${scene.smallText}</p>
              <h1 class="reveal-child delay-2">${scene.title}</h1>
              <p class="intro-text reveal-child delay-3">
                I saved this part for last.
              </p>

              <button class="envelope" id="envelopeBtn" aria-label="Open letter">
                <div class="envelope-back"></div>
                <div class="letter-paper">
                  <p>${scene.body}</p>
                </div>
                <div class="envelope-front"></div>
                <div class="envelope-flap"></div>
              </button>

              <p class="letter-instruction" id="letterInstruction">
                Tap the envelope.
              </p>

              <button class="letter-next" id="letterNextBtn" style="display:none">
                Continue
              </button>
            </div>
          `;




        } else if (scene.type === "ending") {

          section.innerHTML = `
            <div class="ending-card">
              <p class="ending-line ending-delay-1">${scene.smallText}</p>
              <p class="ending-line ending-delay-2">But our story doesn't.</p>

              <h1 class="ending-title ending-delay-3">${scene.title}</h1>

              <p class="ending-body ending-delay-4">${scene.body}</p>

              <p class="ending-final ending-delay-5">${scene.finalText}</p>
            </div>
          `;
        

        } else if (scene.type === "breath") {

          section.innerHTML = `
            <div class="breath-card">
              ${scene.lines.map((line, index) => `
                <p class="breath-line breath-delay-${index + 1}">
                  ${line}
                </p>
              `).join("")}
            </div>
          `;
        } else if (scene.type === "adventureCarousel") {

          section.innerHTML = `
            <div class="adventure-carousel-card">

              <p class="small-text reveal-child delay-1">
                ${scene.smallText}
              </p>

              <h1 class="reveal-child delay-2">
                ${scene.title}
              </h1>

              <p class="intro-text reveal-child delay-3">
                ${scene.intro}
              </p>

              <div class="adventure-carousel-shell">

                <div
                  class="adventure-carousel"
                  aria-label="Our adventure memories"
                >
                  ${scene.images.map((image, index) => `
                    <div
                      class="adventure-slide"
                      data-adventure-index="${index}"
                    >
                      <img
                        src="${image}"
                        alt="Adventure memory ${index + 1}"
                        draggable="false"
                      >
                    </div>
                  `).join("")}
                </div>

                <div class="adventure-edge adventure-edge-left"></div>
                <div class="adventure-edge adventure-edge-right"></div>

              </div>

              <p class="adventure-swipe-hint">
                Swipe to explore.
              </p>

              <p class="intro-text adventure-reflection reveal">
                ${scene.reflection}
              </p>

              <p class="adventure-final-text reveal">
                ${scene.finalText}
              </p>
            </div>
          `;
        } else if (scene.type === "mahjong") {

        section.innerHTML = `
          <div class="mahjong-card">
            <p class="small-text reveal-child delay-1">${scene.smallText}</p>
            <h1 class="reveal-child delay-2">${scene.title}</h1>
            <p class="intro-text reveal-child delay-3">${scene.body}</p>

            <div class="table-tile" id="tableTile"></div>

            <div class="mahjong-hand" id="mahjongHand"></div>

            <button class="mahjong-action" id="dealBtn">
                Deal.
            </button>

            <div class="mahjong-choice-row" id="mahjongChoiceRow" style="display:none">
              <button
                class="mahjong-action"
                id="pongBtn"
                type="button">
                PONG!
              </button>

              <button
                class="mahjong-action mahjong-pass"
                id="passBtn"
                type="button">
                PASS
              </button>
            </div>
            <p class="mahjong-instruction" id="mahjongInstruction">
              Tap Deal to begin.
            </p>
          </div>
        `;

      } else if (scene.type === "chapter") {

        section.innerHTML = `
          <div class="chapter-card">
            <p class="small-text reveal-child delay-1">${scene.smallText}</p>
            <h1 class="reveal-child delay-2">${scene.title}</h1>
      
        ${scene.moments.map(moment => `
          <div class="chapter-moment reveal">
            <div class="memory-frame reveal-child delay-1">
              <div class="memory-light"></div>

              ${
                moment.images
                  ? `
                    <div class="memory-pair">
                      ${moment.images.map((image, index) => `
                        <div class="memory-pair-photo">
                          <img
                            src="${image}"
                            alt="${scene.title} — paired memory ${index + 1}"
                          >
                        </div>
                      `).join("")}
                    </div>
                  `
                  : `
                    <div class="photo-placeholder">
                      <img
                        src="${moment.image}"
                        alt="${scene.title}"
                      >
                    </div>
                  `
              }
            </div>

            <p class="intro-text reveal-child delay-2">
              ${moment.text}
            </p>
          </div>
        `).join("")}
            </div>
        `;
      
      } else if(scene.type === "photo") {
      
        section.innerHTML = `
          <div class="photo-card">
      
            <div class="photo-placeholder">
              <img src="${scene.image}" alt="${scene.title}">
            </div>
      
            <div class="photo-text">
              <p class="small-text">${scene.smallText}</p>
              <h1>${scene.title}</h1>
              <p class="intro-text">${scene.body}</p>
            </div>
      
          </div>
        `;
      
      } else {
      
        section.innerHTML = `
          <div class="scene-content">
            <p class="small-text">${scene.smallText}</p>
            <h1>${scene.title}</h1>
            <p class="intro-text">${scene.body}</p>
          </div>
        `;
      
      }

app.appendChild(section);
  const copyAccountButton = section.querySelector("[data-copy-account]");

  if (copyAccountButton) {
    copyAccountButton.addEventListener("click", async () => {
      const accountNumber =
        copyAccountButton.dataset.copyAccount;

      try {
        await navigator.clipboard.writeText(accountNumber);

        const originalText = copyAccountButton.textContent;
        copyAccountButton.textContent = "Copied";

        setTimeout(() => {
          copyAccountButton.textContent = originalText;
        }, 1800);
      } catch (error) {
        console.warn("Unable to copy account number:", error);
      }
    });
  }
    if (scene.type === "mahjong") {
      setupMahjongGame(section);
    }

    if (scene.type === "adventureCarousel") {
      setupAdventureCarousel(section);
    }

    if (scene.type === "holdHand") {
      setupHoldHand(section);
    }

    if (scene.type === "letter") {
      setupLetter(section);
    }
    });

    setupRevealAnimation();
    setupParallax();
    setupAtmosphereEngine();
    setupMusicSceneObserver();
    }



  function setupParallax() {
    if (parallaxStarted) return;
    parallaxStarted = true;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      return;
    }

    let ticking = false;

    function updateParallax() {
      const photos = document.querySelectorAll(".photo-placeholder img");

      photos.forEach(photo => {
        const rect = photo.getBoundingClientRect();
        const offset = rect.top * -0.035;
        const limitedOffset = Math.max(-34, Math.min(34, offset));

        photo.style.transform =
          `translateY(${limitedOffset}px) scale(1.1)`;
      });

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  }
    
  function setupHoldHand(section) {
    const button = section.querySelector("#holdHandBtn");
    const instruction = section.querySelector("#holdHandInstruction");

    if (!button || !instruction) return;

    let holdTimer = null;
    let completed = false;

    function startHolding() {
      if (completed) return;

      button.classList.add("holding");
      instruction.textContent = "Stay with me...";

      if (navigator.vibrate) {
        navigator.vibrate(35);
      }

      holdTimer = setTimeout(() => {
        completed = true;

        button.classList.remove("holding");
        button.classList.add("completed");

        instruction.innerHTML = `
          Thank you.<br>
          For never letting go.
        `;

        if (navigator.vibrate) {
          navigator.vibrate([40, 40, 60]);
        }
      }, 2200);
    }

    function stopHolding() {
      if (completed) return;

      clearTimeout(holdTimer);
      button.classList.remove("holding");
      instruction.textContent = "Press and hold.";
    }

    button.addEventListener("mousedown", startHolding);
    button.addEventListener("mouseup", stopHolding);
    button.addEventListener("mouseleave", stopHolding);

    button.addEventListener("touchstart", (event) => {
      event.preventDefault();
      startHolding();
    });

    button.addEventListener("touchend", stopHolding);
    button.addEventListener("touchcancel", stopHolding);
  }

  const storySounds = {
    opening_note: new Audio("audio/opening_note_2.mp3"),
    paper_wave: new Audio("audio/paper_wave_2.mp3")
  };

  function playStorySound(type) {
    const sound = storySounds[type];
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume = 0.45;

    sound.play().catch(error => {
      console.warn(`Story sound failed: ${type}`, error);
    });
  }


  function setupLetter(section) {
    const envelope = section.querySelector("#envelopeBtn");
    const instruction = section.querySelector("#letterInstruction");
    const nextBtn = section.querySelector("#letterNextBtn");

    if (!envelope || !instruction || !nextBtn) return;

    let opened = false;
    let unfolded = false;

    envelope.addEventListener("click", () => {
      if (!opened) {
        opened = true;
        playStorySound("opening_note");
        envelope.classList.add("opened");
        instruction.textContent = "Tap the letter.";

        return;
      }

      if (!unfolded) {
        unfolded = true;
        playStorySound("paper_wave");
        envelope.classList.add("unfolded");
        instruction.textContent = "";

        setTimeout(() => {
          nextBtn.style.display = "inline-block";
        }, 700);
      }
    });

    nextBtn.addEventListener("click", () => {
      const endingSection = [...document.querySelectorAll(".story-section")]
        .find(section => section.textContent.includes("See you in Chapter Four"));

      if (endingSection) {
        endingSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }

  function setupAtmosphereEngine() {
    const isChineseLuxury =
      document.documentElement.dataset.weddingTheme === "chinese-luxury";

    const atmospheres = isChineseLuxury
      ? [
          {
            scene: "chapterIntro",
            base: [246, 235, 218],
            glow: [221, 164, 82, 0.16],
            glowPos: [50, 34],
            vignette: 0.045
          },
          {
            scene: "weddingDetails",
            base: [248, 238, 223],
            glow: [186, 53, 49, 0.075],
            glowPos: [50, 32],
            vignette: 0.04
          },
          {
            scene: "ourJourney",
            base: [244, 232, 213],
            glow: [218, 159, 72, 0.13],
            glowPos: [52, 35],
            vignette: 0.05
          },
          {
            scene: "guestDetails",
            base: [247, 236, 220],
            glow: [181, 45, 43, 0.065],
            glowPos: [50, 37],
            vignette: 0.04
          },
          {
            scene: "futurePromise",
            base: [242, 227, 207],
            glow: [218, 157, 69, 0.12],
            glowPos: [50, 43],
            vignette: 0.055
          },
          {
            scene: "closingInvitation",
            base: [239, 220, 197],
            glow: [174, 39, 38, 0.07],
            glowPos: [50, 42],
            vignette: 0.06
          }
        ]
      : [
          {
            scene: "chapterIntro",
            base: [7, 6, 5],
            glow: [212, 175, 55, 0.055],
            glowPos: [50, 40],
            vignette: 0.8
          },
          {
            scene: "weddingDetails",
            base: [11, 9, 7],
            glow: [212, 175, 55, 0.065],
            glowPos: [50, 36],
            vignette: 0.72
          },
          {
            scene: "ourJourney",
            base: [10, 11, 14],
            glow: [135, 150, 190, 0.05],
            glowPos: [52, 34],
            vignette: 0.74
          },
          {
            scene: "guestDetails",
            base: [10, 8, 7],
            glow: [212, 175, 55, 0.055],
            glowPos: [50, 38],
            vignette: 0.76
          },
          {
            scene: "futurePromise",
            base: [4, 4, 4],
            glow: [212, 175, 55, 0.035],
            glowPos: [50, 48],
            vignette: 0.86
          },
          {
            scene: "closingInvitation",
            base: [2, 2, 2],
            glow: [212, 175, 55, 0.04],
            glowPos: [50, 45],
            vignette: 0.9
          }
        ];
  function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function mixColor(a, b, t) {
      return [
        Math.round(lerp(a[0], b[0], t)),
        Math.round(lerp(a[1], b[1], t)),
        Math.round(lerp(a[2], b[2], t))
      ];
    }

    function mixPosition(a, b, t) {
      return [
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t)
      ];
    }

    function mixGlow(a, b, t) {
      return [
        Math.round(lerp(a[0], b[0], t)),
        Math.round(lerp(a[1], b[1], t)),
        Math.round(lerp(a[2], b[2], t)),
        lerp(a[3], b[3], t)
      ];
    }

    function updateAtmosphere() {
      const sections = [...document.querySelectorAll(".story-section")];

      if (!sections.length) return;

      const viewportCenter = window.innerHeight / 2;

      let currentIndex = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= viewportCenter) {
          currentIndex = index;
        }
      });

      const currentSection = sections[currentIndex];
      const nextSection = sections[currentIndex + 1];

      const currentScene = currentSection?.dataset.scene;
      const nextScene = nextSection?.dataset.scene;

      const currentAtmosphere = atmospheres.find(a => a.scene === currentScene);
      const nextAtmosphere = atmospheres.find(a => a.scene === nextScene) || currentAtmosphere;

      if (!currentAtmosphere || !nextAtmosphere) return;

      const currentRect = currentSection.getBoundingClientRect();
      const progress = Math.min(
        Math.max((viewportCenter - currentRect.top) / currentRect.height, 0),
        1
      );

      const smoothProgress = progress * progress * (3 - 2 * progress);

      const base = mixColor(currentAtmosphere.base, nextAtmosphere.base, smoothProgress);
      const glow = mixGlow(currentAtmosphere.glow, nextAtmosphere.glow, smoothProgress);
      const vignette = lerp(currentAtmosphere.vignette, nextAtmosphere.vignette, smoothProgress);
      const glowPos = mixPosition(currentAtmosphere.glowPos, nextAtmosphere.glowPos, smoothProgress);

      document.body.style.setProperty(
        "--atmosphere-base",
        `rgb(${base[0]}, ${base[1]}, ${base[2]})`
      );

      document.body.style.setProperty(
        "--atmosphere-glow",
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, ${glow[3]})`
      );

      document.body.style.setProperty(
        "--atmosphere-glow-x",
        `${glowPos[0]}%`
      );

      document.body.style.setProperty(
        "--atmosphere-glow-y",
        `${glowPos[1]}%`
      );

      document.body.style.setProperty(
        "--atmosphere-vignette",
        `rgba(0,0,0,${vignette})`
      );
    }

    window.addEventListener("scroll", updateAtmosphere, { passive: true });
    updateAtmosphere();
  }

  let lastMusicAct = null;

  function updateMusicForScene(sceneName) {
    if (!sceneName) return;

    let nextAct = "act1";

    if (sceneName === "mahjongMemory") {
      SoundDirector.duck(0.1);
      return;
    }

    if (
      sceneName === "funnyUs" ||
      sceneName === "littleThings" ||
      sceneName === "reflection" ||
      sceneName === "holdHand" ||
      sceneName === "beforeLetterBreath"
    ) {
      nextAct = "act2";
    }

    if (
      sceneName === "finalLetter" ||
      sceneName === "ending"
    ) {
      nextAct = "act3";
    }

    SoundDirector.restore();

    if (lastMusicAct === nextAct) return;

    lastMusicAct = nextAct;

    console.log("Changing music to:", nextAct);

    SoundDirector.play(nextAct);
  }

  function setupMusicSceneObserver() {
    const sections = [
      ...document.querySelectorAll(".story-section[data-scene]")
    ];

    if (!sections.length) return;

    let ticking = false;
    let activeScene = null;

    function updateActiveMusicScene() {
      // Music changes when a section reaches about
      // 35% down from the top of the screen.
      const triggerPoint = window.innerHeight * 0.35;

      let selectedSection = sections[0];

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        /*
          Select the latest section whose top has passed
          the trigger line.

          This works even when a section is very tall.
        */
        if (rect.top <= triggerPoint) {
          selectedSection = section;
        }
      });

      const nextScene = selectedSection.dataset.scene;

      if (nextScene !== activeScene) {
        activeScene = nextScene;

        console.log("Current music scene:", activeScene);

        updateMusicForScene(activeScene);
      }

      ticking = false;
    }

    function requestMusicUpdate() {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(updateActiveMusicScene);
    }

    window.addEventListener(
      "scroll",
      requestMusicUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      requestMusicUpdate
    );

    updateActiveMusicScene();
  }

  function setupDustEngine() {
    const dustLayer = document.getElementById("dustLayer");
    if (!dustLayer) return;

    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");
      particle.className = "dust-particle";

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 16}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;

      const size = 1 + Math.random() * 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      dustLayer.appendChild(particle);
    }
  }



  function setupRevealAnimation() {

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("active");

            }else{

                entry.target.classList.remove("active");

            }

        });

    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px"
    });
    
    reveals.forEach(el=>observer.observe(el));

  }

  const musicToggle = document.getElementById("musicToggle");

  const SoundDirector = {
    tracks: {
      act1: new Audio("audio/music-act-1.mp3"),
      act2: new Audio("audio/music-act-2.mp3"),
      act3: new Audio("audio/music-act-3.mp3")
    },

    currentTrack: null,
    targetVolume: 0.35,
    isMuted: false,
    fadeTimer: null,
    volumeFadeTimer: null,

    init() {
      Object.values(this.tracks).forEach(track => {
        track.loop = true;
        track.volume = 0;
      });
    },
    async play(trackName) {
      if (this.isMuted) return;

      const nextTrack = this.tracks[trackName];
      if (!nextTrack) return;

      if (this.currentTrack === nextTrack) return;

      try {
        nextTrack.currentTime = 0;
        await nextTrack.play();
      } catch (error) {
        console.warn(`Music track failed: ${trackName}`, error);
        return;
      }

      const previousTrack = this.currentTrack;
      this.currentTrack = nextTrack;

      this.crossfade(previousTrack, nextTrack);
      musicToggle.classList.add("playing");
    },
  crossfade(fromTrack, toTrack) {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }

    let progress = 0;
    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;

    const fromStartVolume = fromTrack ? fromTrack.volume : 0;
    const toStartVolume = toTrack.volume;

    this.fadeTimer = setInterval(() => {
      progress++;

      const amount = Math.min(progress / steps, 1);

      if (fromTrack) {
        fromTrack.volume = Math.max(
          fromStartVolume * (1 - amount),
          0
        );
      }

      toTrack.volume = Math.min(
        toStartVolume + (this.targetVolume - toStartVolume) * amount,
        this.targetVolume
      );

      if (amount >= 1) {
        clearInterval(this.fadeTimer);
        this.fadeTimer = null;

        if (fromTrack && fromTrack !== toTrack) {
          fromTrack.pause();
          fromTrack.currentTime = 0;
          fromTrack.volume = 0;
        }

        toTrack.volume = this.targetVolume;
      }
    }, interval);
  },

    duck(volume = 0.1) {
      this.fadeCurrentVolume(volume, 900);
    },

    restore() {
      this.fadeCurrentVolume(this.targetVolume, 1100);
    },

    toggleMute() {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
        Object.values(this.tracks).forEach(track => track.pause());
        musicToggle.classList.remove("playing");
      } else {
        if (this.currentTrack) {
          this.currentTrack.play().catch(() => {});
          this.currentTrack.volume = this.targetVolume;
          musicToggle.classList.add("playing");
        } else {
          this.play("act1");
        }
      }
    },


    fadeCurrentVolume(targetVolume, duration = 1000) {
      if (!this.currentTrack || this.isMuted) return;

      if (this.volumeFadeTimer) {
        clearInterval(this.volumeFadeTimer);
        this.volumeFadeTimer = null;
      }

      const track = this.currentTrack;
      const startVolume = track.volume;

      let progress = 0;
      const interval = 50;
      const steps = duration / interval;

      this.volumeFadeTimer = setInterval(() => {
        progress++;

        const amount = Math.min(progress / steps, 1);

        track.volume =
          startVolume + (targetVolume - startVolume) * amount;

        if (amount >= 1) {
          clearInterval(this.volumeFadeTimer);
          this.volumeFadeTimer = null;
          track.volume = targetVolume;
        }
      }, interval);
    },
  };

  SoundDirector.init();

  function startBackgroundMusic() {
    SoundDirector.play("act1");
  }

  musicToggle.addEventListener("click", () => {
    SoundDirector.toggleMute();
  });


  /* ========= Mahjong Audio ========= */

  const mahjongSounds = {
    draw: new Audio("audio/mahjong_tile_draw_2.mp3"),
    pong: new Audio("audio/pong_mahjong_2.mp3"),
    hu: new Audio("audio/hu_mahjong_2.mp3"),
    yidong: new Audio("audio/yidong_mahjong_2.mp3"),
    fachai_receive: new Audio("audio/fachai_mahjong_receive.mp3"),
    fachai_give: new Audio("audio/fachai_mahjong_give.mp3"),
    hongzhong_receive: new Audio("audio/hongzhong_mahjong_receive.mp3"),
    hongzhong_give: new Audio("audio/hongzhong_mahjong_give.mp3")
  };

  function unlockExtraAudio() {
    const audioToUnlock = [
      SoundDirector.tracks.act2,
      SoundDirector.tracks.act3,

      storySounds.opening_note,
      storySounds.paper_wave,

      ...Object.values(mahjongSounds)
    ];

    audioToUnlock.forEach(audio => {
      const originalVolume = audio.volume;

      audio.volume = 0;
      audio.preload = "auto";
      audio.load();

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = originalVolume;
          })
          .catch(error => {
            audio.volume = originalVolume;
            console.warn("Could not unlock audio:", audio.src, error);
          });
      }
    });
  }

  function playMahjongSound(type) {
    const sound = mahjongSounds[type];
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume = 0.55;

    sound.play().catch(() => {});
  }

  function setupAdventureCarousel(section) {
    const carousel = section.querySelector(".adventure-carousel");
    const card = section.querySelector(".adventure-carousel-card");

    if (!carousel || !card) return;

    const originalSlides = [
      ...carousel.querySelectorAll(".adventure-slide")
    ];

    if (originalSlides.length < 2) return;

    /*
      Build three identical sets:

      clone set | original set | clone set

      We stay around the middle set and silently jump
      by exactly one set when entering either outer set.
    */

    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();

    originalSlides.forEach(slide => {
      beforeFragment.appendChild(slide.cloneNode(true));
      afterFragment.appendChild(slide.cloneNode(true));
    });

    carousel.prepend(beforeFragment);
    carousel.append(afterFragment);

    const originalCount = originalSlides.length;

    let animationFrame = null;
    let lastTime = null;
    let lastActiveUpdate = 0;
    let resumeTimer = null;

    let isPaused = false;
    let isDragging = false;
    let isCarouselVisible = true;

    let dragStartX = 0;
    let dragStartScrollLeft = 0;

    let cycleWidth = 0;
    let firstSetPosition = 0;
    let middleSetPosition = 0;
    let thirdSetPosition = 0;

    /*
      Keep our own floating-point position so slow automatic
      movement remains smooth on desktop.
    */
    let autoScrollPosition = 0;

    const speed = 24;

    const carouselObserver = new IntersectionObserver(
      entries => {
        isCarouselVisible = entries[0].isIntersecting;

        /*
          Prevent a large time jump when returning
          to the carousel after it was off-screen.
        */
        if (isCarouselVisible) {
          lastTime = null;
        }
      },
      {
        threshold: 0.05
      }
    );

    carouselObserver.observe(card);

    function getCenteredPosition(slide) {
      return (
        slide.offsetLeft -
        (carousel.clientWidth - slide.offsetWidth) / 2
      );
    }

    function measureCarousel(preserveCurrentPosition = false) {
      const allSlides = [
        ...carousel.querySelectorAll(".adventure-slide")
      ];

      const firstSetFirstSlide = allSlides[0];
      const middleSetFirstSlide = allSlides[originalCount];
      const thirdSetFirstSlide = allSlides[originalCount * 2];

      if (
        !firstSetFirstSlide ||
        !middleSetFirstSlide ||
        !thirdSetFirstSlide
      ) {
        return;
      }

      firstSetPosition = getCenteredPosition(firstSetFirstSlide);
      middleSetPosition = getCenteredPosition(middleSetFirstSlide);
      thirdSetPosition = getCenteredPosition(thirdSetFirstSlide);

      /*
        Exact distance between identical sets.

        This automatically includes slide width and gap,
        while avoiding errors from carousel side padding.
      */
      cycleWidth = middleSetPosition - firstSetPosition;

      if (!preserveCurrentPosition) {
        autoScrollPosition = middleSetPosition;
        carousel.scrollLeft = autoScrollPosition;
      } else {
        autoScrollPosition = carousel.scrollLeft;
        keepInsideInfiniteLoop();
      }
    }

    function keepInsideInfiniteLoop() {
      if (!cycleWidth) return;

      /*
        Entered the third copy:
        move backward by exactly one identical cycle.
      */
      if (autoScrollPosition >= thirdSetPosition) {
        autoScrollPosition -= cycleWidth;
        carousel.scrollLeft = autoScrollPosition;
        return;
      }

      /*
        Entered the first copy:
        move forward by exactly one identical cycle.
      */
      if (autoScrollPosition <= firstSetPosition) {
        autoScrollPosition += cycleWidth;
        carousel.scrollLeft = autoScrollPosition;
      }
    }

    function updateActiveSlide() {
      const allSlides = [
        ...carousel.querySelectorAll(".adventure-slide")
      ];

      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter =
        carouselRect.left + carouselRect.width / 2;

      let closestSlide = null;
      let closestDistance = Infinity;

      allSlides.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(
          carouselCenter - slideCenter
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlide = slide;
        }
      });

      allSlides.forEach(slide => {
        slide.classList.toggle(
          "is-active",
          slide === closestSlide
        );
      });
    }

    function animate(currentTime) {
      if (lastTime === null) {
        lastTime = currentTime;
      }

      const elapsedSeconds = Math.min(
        (currentTime - lastTime) / 1000,
        0.05
      );

      lastTime = currentTime;

      if (
        isCarouselVisible &&
        !isPaused &&
        !isDragging
      ) {
        autoScrollPosition += speed * elapsedSeconds;
        carousel.scrollLeft = autoScrollPosition;

        keepInsideInfiniteLoop();
      }

      if (
        isCarouselVisible &&
        currentTime - lastActiveUpdate >= 120
      ) {
        updateActiveSlide();
        lastActiveUpdate = currentTime;
      }

      animationFrame = requestAnimationFrame(animate);
    }

    function pauseCarousel() {
      isPaused = true;

      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function resumeCarouselLater() {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }

      resumeTimer = setTimeout(() => {
        autoScrollPosition = carousel.scrollLeft;
        keepInsideInfiniteLoop();

        lastTime = null;
        isPaused = false;
      }, 3000);
    }

    /*
      Desktop mouse dragging.

      Phone swiping remains native because this only responds
      to an actual mouse pointer.
    */

    carousel.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse") return;

      isDragging = true;
      pauseCarousel();

      dragStartX = event.clientX;
      dragStartScrollLeft = carousel.scrollLeft;

      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener("pointermove", event => {
      if (
        event.pointerType !== "mouse" ||
        !isDragging
      ) {
        return;
      }

      const movement = event.clientX - dragStartX;

      autoScrollPosition =
        dragStartScrollLeft - movement;

      carousel.scrollLeft = autoScrollPosition;
      keepInsideInfiniteLoop();
    });

    function finishDragging(event) {
      if (
        event.pointerType !== "mouse" ||
        !isDragging
      ) {
        return;
      }

      isDragging = false;
      carousel.classList.remove("is-dragging");

      if (carousel.hasPointerCapture(event.pointerId)) {
        carousel.releasePointerCapture(event.pointerId);
      }

      autoScrollPosition = carousel.scrollLeft;
      keepInsideInfiniteLoop();
      updateActiveSlide();

      resumeCarouselLater();
    }

    carousel.addEventListener("pointerup", finishDragging);
    carousel.addEventListener("pointercancel", finishDragging);

    /*
      Native phone swiping
    */

    carousel.addEventListener(
      "touchstart",
      () => {
        pauseCarousel();
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      () => {
        autoScrollPosition = carousel.scrollLeft;
        keepInsideInfiniteLoop();
        updateActiveSlide();

        resumeCarouselLater();
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchcancel",
      () => {
        autoScrollPosition = carousel.scrollLeft;
        keepInsideInfiniteLoop();

        resumeCarouselLater();
      },
      { passive: true }
    );

    /*
      Keep the floating-point position synchronized while the
      user performs native scrolling.
    */

    carousel.addEventListener(
      "scroll",
      () => {
        if (isPaused || isDragging) {
          autoScrollPosition = carousel.scrollLeft;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      measureCarousel(true);
      updateActiveSlide();
    });

    /*
      Wait for layout and images before measuring.
    */

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureCarousel(false);
        updateActiveSlide();

        animationFrame =
          requestAnimationFrame(animate);
      });
    });
  }

  /* ============================== */

  function setupMahjongGame(section) {
    const hand = section.querySelector("#mahjongHand");
    const tableTile = section.querySelector("#tableTile");

    const pongBtn = section.querySelector("#pongBtn");
    const passBtn = section.querySelector("#passBtn");
    const choiceRow = section.querySelector("#mahjongChoiceRow");

    const dealBtn = section.querySelector("#dealBtn");
    const instruction = section.querySelector("#mahjongInstruction");

    if (
      !hand ||
      !tableTile ||
      !pongBtn ||
      !passBtn ||
      !choiceRow ||
      !dealBtn ||
      !instruction
    ) {
      console.error("Mahjong game elements are missing.");
      return;
    }

    let handTiles = [];
    let phase = "deal";
    const mahjongTileImages = {
      "🀇": {
        src: "images/mahjong/1wan.png",
        alt: "One Character"
      },

      "🀈": {
        src: "images/mahjong/2wan.png",
        alt: "Two Character"
      },

      "🀉": {
        src: "images/mahjong/3wan.png",
        alt: "Three Character"
      },

      "🀊": {
        src: "images/mahjong/4wan.png",
        alt: "Four Character"
      },

      "🀋": {
        src: "images/mahjong/5wan.png",
        alt: "Five Character"
      },

      "🀌": {
        src: "images/mahjong/6wan.png",
        alt: "Six Character"
      },

      "🀍": {
        src: "images/mahjong/7wan.png",
        alt: "Seven Character"
      },

      "🀎": {
        src: "images/mahjong/8wan.png",
        alt: "Eight Character"
      },

      "🀏": {
        src: "images/mahjong/9wan.png",
        alt: "Nine Character"
      },

      "🀙": {
        src: "images/mahjong/1dong.png",
        alt: "One Circle"
      },

      "🀅": {
        src: "images/mahjong/fachai.png",
        alt: "Green Dragon"
      },

      "🀄": {
        src: "images/mahjong/hongzhong.png",
        alt: "Red Dragon"
      }
    };

    function createMahjongTileImage(tile) {
      const tileData = mahjongTileImages[tile];

      if (!tileData) {
        console.warn("Missing Mahjong tile image:", tile);
        return "";
      }

      return `
        <img
          class="mahjong-tile-image"
          src="${tileData.src}"
          alt="${tileData.alt}"
          draggable="false"
        >
      `;
    }

    const tileOrder = ["🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏","🀙","🀅","🀄"];

    function sortHand() {
      handTiles.sort((a, b) => tileOrder.indexOf(a) - tileOrder.indexOf(b));
    }
    
    function dealStartingHand() {
    phase = "dealing";

    dealBtn.style.display = "none";
    instruction.textContent = "";
    playMahjongSound("draw");
    handTiles = [];

    const startingTiles = ["🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏","🀙","🀙","🀅","🀄"];

    startingTiles.forEach((tile, index) => {
      setTimeout(() => {
        handTiles.push(tile);
        renderHand();

        const latestTile = hand.querySelector(".mahjong-tile:last-child");
        latestTile.classList.add("dealt");

        if (index === startingTiles.length - 1) {
            const drawSound = mahjongSounds.draw;

            drawSound.pause();
            drawSound.currentTime = 0;
        }

      }, index * 115);
    });

    setTimeout(() => {
      tableTile.innerHTML = createMahjongTileImage("🀙");
      tableTile.classList.add("reveal-winning", "glow");

      instruction.textContent = "Yi Dong.";
      playMahjongSound("yidong");
      
      setTimeout(() => {
          instruction.textContent = "Yi Dong.";
      }, 120);
      
    setTimeout(() => {
      tableTile.classList.remove("reveal-winning");
      instruction.textContent = "What will you do?";

      phase = "pong";

      passBtn.classList.remove("pass-shake");
      passBtn.blur();
      pongBtn.blur();

      choiceRow.style.display = "flex";
    }, 900);

    }, startingTiles.length * 115 + 1050);
  }

    function renderHand() {
      sortHand();

      hand.innerHTML = handTiles.map(tile => `
        <button
          class="mahjong-tile ${
            phase === "discard"
              ? "discard-choice"
              : ""
          }"
          data-tile="${tile}"
          type="button"
          aria-label="${mahjongTileImages[tile]?.alt || "Mahjong tile"}"
        >
          ${createMahjongTileImage(tile)}
        </button>
      `).join("");

      if (phase === "discard") {
        hand.querySelectorAll(".mahjong-tile").forEach(btn => {
          btn.addEventListener("click", () => {
            const selectedTile = btn.dataset.tile;

            if (
              selectedTile === "🀅" ||
              selectedTile === "🀄"
            ) {
              discardTile(selectedTile);
            } else {
              rejectDiscard(btn);
            }
          });
        });
      }
    }

    function rejectDiscard(tileButton) {
      if (phase !== "discard") return;

      tileButton.classList.remove("wrong-discard");

      // Forces the animation to restart on repeated taps.
      void tileButton.offsetWidth;

      tileButton.classList.add("wrong-discard");

      instruction.textContent = "Now discard one tile:";

      if (navigator.vibrate) {
        navigator.vibrate([35, 30, 35]);
      }

      setTimeout(() => {
        tileButton.classList.remove("wrong-discard");
      }, 520);
    }

    function discardTile(tile) {
      if (phase !== "discard") return;

      phase = "revealing";

      if (tile === "🀅") {
        playMahjongSound("fachai_give");
      } else if (tile === "🀄") {
        playMahjongSound("hongzhong_give");
      }
      const indexToRemove = handTiles.indexOf(tile);
      if (indexToRemove !== -1) {
        handTiles.splice(indexToRemove, 1);
      }

      renderHand();

      const discardArea = document.createElement("div");
      discardArea.className = "mahjong-discard-area";
      discardArea.innerHTML = `
        <div
          class="mahjong-discarded-tile"
          aria-label="${mahjongTileImages[tile]?.alt || "Discarded Mahjong tile"}"
        >
          ${createMahjongTileImage(tile)}
        </div>
      `;

      hand.after(discardArea);

      instruction.textContent = "";

      setTimeout(() => {
        const winningTile = tile === "🀄" ? "🀅" : "🀄";

        tableTile.innerHTML = createMahjongTileImage(winningTile);
        tableTile.classList.add("glow", "reveal-winning");
        tableTile.dataset.winningTile = winningTile;


        if (winningTile === "🀅") {
            playMahjongSound("fachai_receive");
        } else {
            playMahjongSound("hongzhong_receive");
        }      

      setTimeout(() => {
        phase = "hu";

      pongBtn.textContent = "HU!";
      passBtn.style.display = "none";
      choiceRow.style.display = "flex";

      instruction.textContent = "The winning tile is here. Tap HU.";
        tableTile.classList.remove("reveal-winning");
      }, 850);
      }, 900);
    }

  function resetMahjongGame() {
    handTiles = [];
    phase = "deal";

    hand.classList.remove("winning-hand");

    const oldDiscardArea = section.querySelector(".mahjong-discard-area");
    if (oldDiscardArea) oldDiscardArea.remove();

    tableTile.textContent = "";
    tableTile.className = "table-tile";

    pongBtn.textContent = "PONG!";
    passBtn.style.display = "";
    choiceRow.style.display = "none";

    dealBtn.style.display = "inline-block";
    instruction.textContent = "Tap Deal to begin.";

    renderHand();
  }

  dealBtn.addEventListener("click", () => {
    if (phase !== "deal") return;
    dealStartingHand();
  });

  pongBtn.addEventListener("click", () => {
    if (phase === "pong") {
      playMahjongSound("pong");

      choiceRow.style.display = "none";
      instruction.textContent = "";

      tableTile.classList.add("fly-away");

      setTimeout(() => {
        handTiles.push("🀙");
        phase = "discard";

        tableTile.textContent = "";
        tableTile.classList.remove("fly-away");

        renderHand();

        const newTile = [...hand.querySelectorAll(".mahjong-tile")]
          .find(tile => tile.dataset.tile === "🀙");
        if (newTile) {
          newTile.classList.add("dealt");
        }

        instruction.innerHTML = `Now discard one tile`;
      }, 650);
    }

    else if (phase === "hu") {
      playMahjongSound("hu");

      const winningTile = tableTile.dataset.winningTile;

      tableTile.classList.add("fly-away");

      setTimeout(() => {
        handTiles.push(winningTile);
        phase = "won";

        tableTile.textContent = "";
        tableTile.classList.remove("glow", "reveal-winning", "fly-away");

        renderHand();

        hand.classList.add("winning-hand");

        choiceRow.style.display = "none";

        instruction.innerHTML = `
          <strong>HU!</strong><br><br>
          Just like all those little games we played together...
          somehow, we always found our way to win.
          <br><br>
          <button class="mahjong-replay" id="mahjongReplayBtn">Play again?</button>
        `;

        const replayBtn = section.querySelector("#mahjongReplayBtn");

        replayBtn.addEventListener("click", () => {
          resetMahjongGame();
        });
      }, 650);

    }
  });

  passBtn.addEventListener("click", () => {
    if (phase !== "pong") return;

    instruction.innerHTML = `
      Bek, itu ada yang bisa <strong>PONG</strong>, kok malah milih PASS. 😗
    `;

    passBtn.classList.remove("pass-shake");

    // Restart the animation even after repeated taps.
    void passBtn.offsetWidth;

    passBtn.classList.add("pass-shake");

    if (navigator.vibrate) {
      navigator.vibrate([30, 35, 30]);
    }
  });
    renderHand();
  }

  setupDustEngine();
  renderScene(currentScene);