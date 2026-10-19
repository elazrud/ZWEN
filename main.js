/**
 * ==============================================================================
 * ZWEN POTERIE — MODERN VANILLA JAVASCRIPT ENGINE (ES6+)
 * Agadir, Morocco • Traditional Moroccan Pottery & Futuristic Luxury Experience
 * ==============================================================================
 * 
 * TUTORIAL FOR BEGINNERS:
 * This script powers all the futuristic animations on the website:
 * 1. Custom Smooth Dot/Ring Cursor
 * 2. Sticky Glassmorphism Header on scroll
 * 3. Mobile Hamburger Menu Drawer
 * 4. Magnetic Button Micro-interactions
 * 5. Intersection Observer Scroll Reveals
 * 6. Touch-Swipe & Drag Showcase Carousel with Dynamic Progress Bar
 * 7. Subtle Parallax Effects
 * 
 * You don't need any external libraries (no jQuery, no React). Everything runs natively!
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================================
  // 1. CUSTOM CURSOR MECHANICS (DESKTOP ONLY)
  // ============================================================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  // Check if device supports fine pointer (mouse/trackpad, not touch)
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer && cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Listen to mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Position inner dot immediately
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth animation loop for the outer ring (LERP - Linear Interpolation)
    const animateCursor = () => {
      // 0.18 provides a futuristic silky trailing effect
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Expand cursor when hovering over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, [role="button"], .showcase-card, .magnetic-wrap';
    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll(interactiveSelectors);
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
      });
    };
    attachHoverListeners();
  }

  // ============================================================================
  // 2. STICKY GLASSMORPHIC HEADER SCROLL STATE
  // ============================================================================
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScrollHeader = () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScrollHeader, { passive: true });
    handleScrollHeader(); // Initialize on page load
  }

  // ============================================================================
  // 3. MOBILE HAMBURGER MENU & SLIDING DRAWER
  // ============================================================================
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileNav) {
    const toggleMenu = () => {
      const isOpen = hamburgerBtn.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when a link inside is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (hamburgerBtn.classList.contains('is-active')) {
          toggleMenu();
        }
      });
    });

    // Close menu when pressing the Escape key for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburgerBtn.classList.contains('is-active')) {
        toggleMenu();
      }
    });
  }

  // ============================================================================
  // 4. MAGNETIC BUTTON EFFECT (FUTURISTIC MICRO-INTERACTION)
  // Calculates cursor proximity and pulls the button smoothly towards it
  // ============================================================================
  if (isFinePointer) {
    const magneticElements = document.querySelectorAll('.btn-magnetic, .magnetic-wrap');

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Calculate mouse position relative to center of button
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Strength of magnetic pull (tweak 0.3 for stronger/softer pull)
        const pullStrength = 0.28;
        el.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        // Return smoothly back to original position
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ============================================================================
  // 5. INTERSECTION OBSERVER (SMOOTH SCROLL REVEALS)
  // Reveals elements smoothly as they scroll into view
  // ============================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // ============================================================================
  // 6. SHOWCASE CAROUSEL ENGINE (SWIPE, DRAG & PROGRESS BAR)
  // ============================================================================
  const carouselContainer = document.querySelector('.carousel-container');
  const carouselTrack = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  const progressBarFill = document.querySelector('.carousel-progress-fill');
  const counterCurrent = document.querySelector('.carousel-counter-current');
  const counterTotal = document.querySelector('.carousel-counter-total');

  if (carouselContainer && carouselTrack) {
    const slides = Array.from(carouselTrack.children);
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Calculate how many slides are visible at once based on viewport width
    const getVisibleSlides = () => {
      const width = window.innerWidth;
      if (width < 768) return 1;
      if (width < 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const visible = getVisibleSlides();
      return Math.max(0, slides.length - visible);
    };

    if (counterTotal) {
      counterTotal.textContent = String(slides.length).padStart(2, '0');
    }

    const updateCarouselUI = () => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

      // Slide width calculation
      const slide = slides[0];
      if (!slide) return;
      const slideWidth = slide.getBoundingClientRect().width;
      const gap = 32; // 2rem gap from CSS

      currentTranslate = -currentIndex * (slideWidth + gap);
      prevTranslate = currentTranslate;
      carouselTrack.style.transform = `translateX(${currentTranslate}px)`;

      // Update Nav Buttons State
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

      // Update Progress Bar Fill Width
      if (progressBarFill) {
        const percentage = ((currentIndex + 1) / (maxIndex + 1)) * 100;
        progressBarFill.style.width = `${percentage}%`;
      }

      // Update Numerical Counter
      if (counterCurrent) {
        counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    };

    // Nav Button Click Handlers
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
          currentIndex++;
          updateCarouselUI();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarouselUI();
        }
      });
    }

    // Touch and Drag Gestures
    const getPositionX = (event) => {
      return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    };

    const touchStart = (index) => {
      return (event) => {
        isDragging = true;
        startPos = getPositionX(event);
        carouselTrack.style.transition = 'none'; // Instant response while dragging
        animationID = requestAnimationFrame(animation);
      };
    };

    const touchMove = (event) => {
      if (!isDragging) return;
      const currentPosition = getPositionX(event);
      const diff = currentPosition - startPos;
      currentTranslate = prevTranslate + diff;
    };

    const touchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);

      const movedBy = currentTranslate - prevTranslate;
      carouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';

      // Drag threshold to trigger slide change
      if (movedBy < -50 && currentIndex < getMaxIndex()) {
        currentIndex++;
      }
      if (movedBy > 50 && currentIndex > 0) {
        currentIndex--;
      }

      updateCarouselUI();
    };

    const animation = () => {
      if (isDragging) {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        requestAnimationFrame(animation);
      }
    };

    // Attach Touch and Mouse Drag Events
    carouselContainer.addEventListener('touchstart', touchStart(), { passive: true });
    carouselContainer.addEventListener('touchend', touchEnd);
    carouselContainer.addEventListener('touchmove', touchMove, { passive: true });

    carouselContainer.addEventListener('mousedown', touchStart());
    carouselContainer.addEventListener('mouseup', touchEnd);
    carouselContainer.addEventListener('mouseleave', touchEnd);
    carouselContainer.addEventListener('mousemove', touchMove);

    // Recompute on window resize
    window.addEventListener('resize', () => {
      updateCarouselUI();
    });

    // Initial setup
    updateCarouselUI();
  }

  // ============================================================================
  // 7. SUBTLE HERO PARALLAX (MOUSE MOVE & SCROLL)
  // ============================================================================
  const heroBg = document.querySelector('.hero-bg-image');
  if (heroBg && isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * -0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * -0.015;
      heroBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    });
  }

  console.log('✨ ZWEN POTERIE — Futuristic Luxury Frontend Initialized Successfully.');
});
