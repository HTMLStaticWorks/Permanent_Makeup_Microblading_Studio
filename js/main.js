/* ==========================================================================
   ANANYA PIGMENT ATELIER · ANDHRA - MAIN PUBLIC INTERACTIVITY & ANIMATIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeAndRtl();
  initIntroCurtain();
  initCustomCursor();
  initMagneticButtons();
  initScrollReveal();
  initAnimatedCounters();
  init3DMediaTilt();
  initNavbarScroll();
  initMobileMenu();
  initBeforeAfterSliders();
  initVideoReelsKeepPace();
  initPortfolioFilters();
  initFAQAccordion();
  initCandidacyQuiz();
  initConsultationModal();
  initSlotCounters();
});

/* ==========================================================================
   01. INTRO CURTAIN REVEAL ANIMATION
   ========================================================================== */
function initIntroCurtain() {
  const intro = document.querySelector(".aa-intro");
  if (!intro) return;

  // Auto dismiss after the golden arch animation draws
  setTimeout(() => {
    intro.classList.add("dismissed");
    setTimeout(() => {
      if (intro.parentNode) intro.remove();
    }, 1200);
  }, 2200);

  intro.addEventListener("click", () => {
    intro.classList.add("dismissed");
  });
}

/* ==========================================================================
   02. INTERACTIVE PEN & PRECISION RING CURSOR
   ========================================================================== */
function initCustomCursor() {
  // Custom cursor animation deactivated to keep native browser pointer
  const cursor = document.querySelector(".aa-cursor");
  if (cursor) cursor.remove();
}

/* ==========================================================================
   03. BUTTON HOVER STABILITY
   ========================================================================== */
function initMagneticButtons() {
  // Buttons remain steady and stable in place on hover per design specification
  const buttons = document.querySelectorAll("[data-magnetic], .btn-luxury");
  buttons.forEach(btn => {
    btn.style.transform = "none";
  });
}

/* ==========================================================================
   04. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   05. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count-to"));
        const decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
        const suffix = el.getAttribute("data-count-suffix") || "";
        let count = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease Out Quad
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = (target * easeProgress).toFixed(decimals);

          el.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toFixed(decimals) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   06. 3D TILT & KEEP-PACE PARALLAX ON MEDIA CARDS
   ========================================================================== */
function init3DMediaTilt() {
  const mediaCards = document.querySelectorAll(".media-keep-pace-wrap, .service-card, .portfolio-item");

  mediaCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* ==========================================================================
   07. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector(".atelier-navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ==========================================================================
   08. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (!toggleBtn || !navMenu) return;

  // Create backdrop if not existing
  let backdrop = document.querySelector(".aa-nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "aa-nav-backdrop";
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    navMenu.classList.add("open");
    backdrop.classList.add("active");
    document.body.classList.add("menu-open");
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    backdrop.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", closeMenu);

  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   09. INTERACTIVE BEFORE / AFTER SLIDERS
   ========================================================================== */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll(".before-after-container");
  if (!containers.length) return;

  function syncAllSliderImages() {
    containers.forEach(container => {
      const containerWidth = container.offsetWidth;
      const afterImg = container.querySelector(".ba-image-after img");
      if (afterImg && containerWidth > 0) {
        afterImg.style.width = `${containerWidth}px`;
        afterImg.style.maxWidth = `${containerWidth}px`;
        afterImg.style.minWidth = `${containerWidth}px`;
      }
    });
  }

  window.addEventListener("resize", syncAllSliderImages);
  setTimeout(syncAllSliderImages, 150);
  setTimeout(syncAllSliderImages, 600);

  containers.forEach(container => {
    const afterImgWrapper = container.querySelector(".ba-image-after");
    const handle = container.querySelector(".ba-slider-handle");
    if (!afterImgWrapper || !handle) return;

    let isDragging = false;

    function updateSliderPosition(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      afterImgWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      syncAllSliderImages();
      updateSliderPosition(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch Support
    container.addEventListener("touchstart", (e) => {
      isDragging = true;
      syncAllSliderImages();
      if (e.touches.length > 0) updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  });
}

/* ==========================================================================
   10. VIDEO REELS HOVER PLAYBACK
   ========================================================================== */
function initVideoReelsKeepPace() {
  const videoCards = document.querySelectorAll(".video-reel-card, .media-keep-pace-wrap");
  
  videoCards.forEach(card => {
    const video = card.querySelector("video");
    if (!video) return;

    card.addEventListener("mouseenter", () => {
      video.play().catch(() => {});
    });
  });
}

/* ==========================================================================
   11. FILTERABLE PORTFOLIO MATRIX
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterCategory = btn.getAttribute("data-filter");

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (filterCategory === "all" || itemCategory === filterCategory) {
          item.style.display = "block";
          item.style.animation = "fadeIn 0.4s ease";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   12. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   13. CANDIDACY QUIZ
   ========================================================================== */
function initCandidacyQuiz() {
  const quizSteps = document.querySelectorAll(".quiz-step");
  const nextBtns = document.querySelectorAll(".btn-quiz-next");
  const restartBtn = document.querySelector(".btn-quiz-restart");
  const resultTitle = document.getElementById("quizResultTitle");
  const resultDesc = document.getElementById("quizResultDesc");

  if (!quizSteps.length) return;

  let currentStep = 0;
  let quizAnswers = {
    skinType: "combination",
    desiredOutcome: "natural"
  };

  const optionBtns = document.querySelectorAll(".quiz-option-btn");
  optionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const stepContainer = btn.closest(".quiz-step");
      stepContainer.querySelectorAll(".quiz-option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      const key = btn.getAttribute("data-key");
      const val = btn.getAttribute("data-val");
      if (key && val) {
        quizAnswers[key] = val;
      }
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      quizSteps[currentStep].classList.remove("active");
      currentStep++;
      
      if (currentStep < quizSteps.length - 1) {
        quizSteps[currentStep].classList.add("active");
      } else {
        computeQuizResult();
        quizSteps[quizSteps.length - 1].classList.add("active");
      }
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      quizSteps.forEach(s => s.classList.remove("active"));
      currentStep = 0;
      quizSteps[0].classList.add("active");
    });
  }

  function computeQuizResult() {
    if (!resultTitle || !resultDesc) return;

    if (quizAnswers.skinType === "oily") {
      resultTitle.textContent = "Nanoblading or Ombré Powder Brows";
      resultDesc.textContent = "Oily skin naturally diffuses manual microblade cuts over time. Nano digital machine strokes or a powder gradient provide immaculate retention without bleeding.";
    } else if (quizAnswers.desiredOutcome === "bold") {
      resultTitle.textContent = "Signature Combo Brows & Velvet Lip Blush";
      resultDesc.textContent = "For high-definition structure with soft powdery tail density and perfectly tinted, defined lips that eliminate daily makeup.";
    } else {
      resultTitle.textContent = "Hyper-Realistic Microblading Feathering";
      resultDesc.textContent = "Ideal for normal/dry skin. Bespoke hand-carved hair strokes blended seamlessly with your natural brow pattern for an undetectable finish.";
    }
  }
}

/* ==========================================================================
   14. CONSULTATION MODAL
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById("consultationModal");
  const openBtns = document.querySelectorAll("[data-open-consultation]");
  const closeBtn = document.querySelector(".modal-close-btn");
  const form = document.getElementById("consultationForm");
  const successMsg = document.getElementById("consultationSuccess");

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      if (form) form.style.display = "block";
      if (successMsg) successMsg.style.display = "none";
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.style.display = "none";
      if (successMsg) successMsg.style.display = "block";
    });
  }
}

/* ==========================================================================
   15. SLOT COUNTER
   ========================================================================== */
function initSlotCounters() {
  const slotElements = document.querySelectorAll("[data-slots]");
  slotElements.forEach(el => {
    el.textContent = "3";
  });
}

/* ==========================================================================
   16. THEME & RTL TOGGLE CONTROLLER
   ========================================================================== */
function initThemeAndRtl() {
  // Theme Toggle
  const savedTheme = localStorage.getItem("ananya_theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  const themeBtns = document.querySelectorAll(".theme-toggle-btn");
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      if (newTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      localStorage.setItem("ananya_theme", newTheme);
    });
  });

  // RTL Toggle
  const savedDir = localStorage.getItem("ananya_dir") || "ltr";
  if (savedDir === "rtl") {
    document.documentElement.setAttribute("dir", "rtl");
    document.querySelectorAll(".rtl-label").forEach(l => l.textContent = "LTR");
  }

  const rtlBtns = document.querySelectorAll(".rtl-toggle-btn");
  rtlBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentDir = document.documentElement.getAttribute("dir") || "ltr";
      const newDir = currentDir === "rtl" ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", newDir);
      localStorage.setItem("ananya_dir", newDir);
      document.querySelectorAll(".rtl-label").forEach(l => {
        l.textContent = newDir === "rtl" ? "LTR" : "RTL";
      });
    });
  });
}

