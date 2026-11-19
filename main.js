// ======================================================
// AAKAR FILMS - CORE SCRIPT & PARALLAX SCROLL ANIMATIONS
// ======================================================

// 1. Initialize Lucide Icons
if (window.lucide) {
  lucide.createIcons();
}

// 2. Register GSAP Plugins
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// 3. Hero Intro Reveal
gsap.from(".hero-item", {
  opacity: 0,
  y: 30,
  duration: 1.0,
  stagger: 0.12,
  ease: "power2.out",
  delay: 0.1
});

// 4. Fade-up Sections
gsap.utils.toArray('.gsap-up').forEach((elem) => {
  gsap.from(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 88%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 35,
    duration: 0.8,
    ease: "power2.out"
  });
});

// 5. ==========================================================
//    3-COLUMN OPPOSITE-DIRECTION CONTINUOUS PARALLAX SCROLL
//    Reference: column-image-scroll-animation.webflow.io (Jonas Arleth / Obys)
//    ==========================================================
const colLeft = document.getElementById('scrollColLeft');
const colCenter = document.getElementById('scrollColCenter');
const colRight = document.getElementById('scrollColRight');
const gallerySection = document.getElementById('slantedGallery');

if (gallerySection && colCenter) {
  // 1. Center Column moves UPWARD when scrolling down (-Y)
  gsap.fromTo(colCenter, 
    { yPercent: 12 }, 
    {
      yPercent: -45,
      ease: "none",
      scrollTrigger: {
        trigger: gallerySection,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
      }
    }
  );

  // 2. Left Column moves DOWNWARD when scrolling down (+Y) - Opposite to Center!
  if (colLeft) {
    gsap.fromTo(colLeft, 
      { yPercent: -35 }, 
      {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: gallerySection,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
          invalidateOnRefresh: true,
        }
      }
    );
  }

  // 3. Right Column moves DOWNWARD with subtle offset parallax speed
  if (colRight) {
    gsap.fromTo(colRight, 
      { yPercent: -38 }, 
      {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: gallerySection,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
          invalidateOnRefresh: true,
        }
      }
    );
  }
}

// 5B. ==========================================================
//     THE ART OF WEDDING STORIES — FULL SCREEN IMAGE REVEAL ANIMATION
//     Clip-Path Masking + Cinematic Zoom-in Transitions
//     ==========================================================
const storySection = document.getElementById('weddingStoriesReveal');
if (storySection && window.gsap && window.ScrollTrigger) {
  const slide1Img = storySection.querySelector('.story-slide-1 .story-img');
  const slide2 = storySection.querySelector('.story-slide-2');
  const slide2Img = storySection.querySelector('.story-slide-2 .story-img');
  const slide2Panel = storySection.querySelector('.story-slide-2 .story-content-panel');
  const slide3 = storySection.querySelector('.story-slide-3');
  const slide3Img = storySection.querySelector('.story-slide-3 .story-img');
  const slide3Panel = storySection.querySelector('.story-slide-3 .story-content-panel');
  const dots = storySection.querySelectorAll('.story-dot');

  // Master ScrollTrigger Timeline for Full Screen Story Reveal
  const storyTl = gsap.timeline({
    scrollTrigger: {
      trigger: storySection,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0,
      onUpdate: (self) => {
        const progress = self.progress;
        if (dots.length === 3) {
          dots.forEach(d => d.classList.remove('active'));
          if (progress < 0.4) {
            dots[0].classList.add('active');
          } else if (progress < 0.75) {
            dots[1].classList.add('active');
          } else {
            dots[2].classList.add('active');
          }
        }
      }
    }
  });

  // 1. Initial State: Slide 1 zooms in gracefully as scroll starts
  storyTl.to(slide1Img, {
    scale: 1.0,
    ease: "none",
    duration: 1.5
  });

  // 2. Slide 2 reveals upward using polygon clip-path mask + zoom-in
  storyTl.fromTo(slide2, 
    { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
    { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut",
      duration: 2.0
    },
    "-=0.5"
  );
  storyTl.fromTo(slide2Img, 
    { scale: 1.25 },
    { scale: 1.0, ease: "none", duration: 2.2 },
    "<"
  );
  if (slide2Panel) {
    storyTl.fromTo(slide2Panel, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
      "<0.6"
    );
  }

  // 3. Slide 3 reveals radially expanding from center (circle mask) + zoom-in
  storyTl.fromTo(slide3,
    { clipPath: "circle(0% at 50% 50%)" },
    {
      clipPath: "circle(100% at 50% 50%)",
      ease: "power2.inOut",
      duration: 2.0
    },
    "+=0.2"
  );
  storyTl.fromTo(slide3Img,
    { scale: 1.28 },
    { scale: 1.0, ease: "none", duration: 2.2 },
    "<"
  );
  if (slide3Panel) {
    storyTl.fromTo(slide3Panel, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
      "<0.6"
    );
  }
}

// 6. Lightbox Preview with Next/Prev Navigation & Keyboard Arrows
const allGalleryCards = Array.from(document.querySelectorAll('.gallery-card, .archive-item'));
let currentLightboxIndex = 0;

function openLightboxByIndex(index) {
  if (index < 0) index = allGalleryCards.length - 1;
  if (index >= allGalleryCards.length) index = 0;
  currentLightboxIndex = index;

  const card = allGalleryCards[currentLightboxIndex];
  const img = card.querySelector('img');
  const title = card.getAttribute('data-title') || card.querySelector('h4')?.textContent || 'Aakar Photo-Shoot';
  const sub = card.getAttribute('data-sub') || card.querySelector('p')?.textContent || '';

  const modal = document.getElementById('lightbox');
  const modalImg = document.getElementById('lightboxImage');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalSub = document.getElementById('lightboxSub');
  const modalCounter = document.getElementById('lightboxCounter');

  modalImg.src = img.src;
  modalTitle.textContent = title;
  modalSub.textContent = sub;
  if (modalCounter) {
    modalCounter.textContent = `${currentLightboxIndex + 1} / ${allGalleryCards.length}`;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

allGalleryCards.forEach((card, idx) => {
  card.addEventListener('click', () => {
    openLightboxByIndex(idx);
  });
});

function navigateLightbox(direction) {
  openLightboxByIndex(currentLightboxIndex + direction);
}

function closeLightboxModal() {
  const modal = document.getElementById('lightbox');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Keyboard support: Left/Right arrows and ESC to close
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox');
  if (modal && !modal.classList.contains('hidden')) {
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'Escape') closeLightboxModal();
  }
});

// 7. Curated Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const archiveItems = document.querySelectorAll('.archive-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active', 'bg-brand-gold', 'text-black', 'border-brand-gold');
      b.classList.add('border-white/10', 'text-zinc-300');
    });
    btn.classList.add('active', 'bg-brand-gold', 'text-black', 'border-brand-gold');
    btn.classList.remove('border-white/10', 'text-zinc-300');

    const cat = btn.getAttribute('data-filter');
    archiveItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (cat === 'all' || itemCat === cat) {
        gsap.to(item, { display: 'block', opacity: 1, scale: 1, duration: 0.4 });
      } else {
        gsap.to(item, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          onComplete: () => { item.style.display = 'none'; }
        });
      }
    });
  });
});

// 8. Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  document.querySelectorAll('.mobile-nav-item').forEach(l => {
    l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// 9. Form Handler
function handleInquirySubmit(e) {
  e.preventDefault();
  const alertBox = document.getElementById('formSuccessAlert');
  if (alertBox) {
    alertBox.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => alertBox.classList.add('hidden'), 5000);
  }
}
