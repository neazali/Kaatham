const SUPABASE_URL =
"https://vitjgnihandcyhupnrvd.supabase.co";
const SUPABASE_KEY = "sb_publishable_d8TT3ezUWAIWEyw2lERu7A_hBn7-eMa";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadFeaturedTrip() {
  const { data, error } = await supabaseClient
    .from("featured_trips")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error loading featured trip:", error);
    return;
  }

  if (!data) {
    console.log("No active featured trip found.");
    return;
  }

  // Title
  const title = document.getElementById("featured-title");
  if (title) {
    title.textContent = data.title;
  }

  // Duration + destination
  const meta = document.getElementById("featured-meta");
  if (meta) {
    meta.textContent = `${data.duration || ""} · ${data.destination || ""}`;
  }

  // Description
  const description = document.getElementById("featured-description");
  if (description) {
    description.textContent = data.description || "";
  }

  // Price
  const price = document.getElementById("featured-price");
  if (price) {
    price.textContent = data.price
      ? `₹${Number(data.price).toLocaleString("en-IN")}`
      : "";
  }

  // Departure
const featuredDeparture =
  document.getElementById("featured-departure");

if (featuredDeparture) {
  featuredDeparture.textContent =
    data.departure || "";
}

// Route line
const routeLine =
  document.getElementById("featured-route-line");

if (routeLine) {
  routeLine.innerHTML = "";

  if (data.route) {
    data.route
      .split("-")
      .map(item => item.trim())
      .filter(Boolean)
      .forEach(item => {
        const span = document.createElement("span");
        span.textContent = item;
        routeLine.appendChild(span);
      });
  }
}

  const bookButton = document.getElementById("featured-book-btn");
if (bookButton) {
  bookButton.setAttribute("data-trip", data.title);
}

const modalTitle = document.getElementById("modal-trip-title");
if (modalTitle) {
  modalTitle.textContent = data.title;
}

const modalEnquireButton = document.getElementById("modal-enquire-btn");
if (modalEnquireButton) {
  modalEnquireButton.setAttribute("data-trip", data.title);
}

  // Image
  const media = document.querySelector(".featured-media");
  if (media && data.image_url) {
    media.style.setProperty("--img", `url('${data.image_url}')`);
  }
const modalRoute = document.getElementById("modal-route");
if (modalRoute) {
  modalRoute.textContent = data.route || "";
}

const modalDeparture = document.getElementById("modal-departure");
if (modalDeparture) {
  modalDeparture.textContent =
    `${data.departure || ""} · ${data.destination || ""} · ₹${Number(data.price || 0).toLocaleString("en-IN")} per head`;
}

const modalHighlights = document.getElementById("modal-highlights");
if (modalHighlights) {
  modalHighlights.innerHTML = "";

  if (data.highlights) {
    data.highlights
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        modalHighlights.appendChild(li);
      });
  }
}

const modalInclusions = document.getElementById("modal-inclusions");
if (modalInclusions) {
  modalInclusions.innerHTML = "";

  if (data.inclusions) {
    data.inclusions
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        modalInclusions.appendChild(li);
      });
  }
}

const modalExclusions = document.getElementById("modal-exclusions");
if (modalExclusions) {
  modalExclusions.innerHTML = "";

  if (data.exclusions) {
    data.exclusions
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        modalExclusions.appendChild(li);
      });
  }
}
  console.log("Featured trip loaded:", data);
  console.log("ROUTE FROM DATABASE:", data.route);
}

loadFeaturedTrip();

/* ============================================================
   KAATHAM — SCRIPT.JS
   Each block below is independent — you can read them top to
   bottom, one feature at a time.
   ============================================================ */

// ---------- SITE CONFIG ----------
// ⚠️ ENTER YOUR REAL WHATSAPP NUMBER HERE — this one variable controls
// both the floating WhatsApp button and the enquiry form's WhatsApp
// message. Use the international format with country code, digits only
// (no +, no spaces, no dashes). Example for an Indian number: '91XXXXXXXXXX'.
const KAATHAM_WHATSAPP_NUMBER = '918943498591';

document.addEventListener('DOMContentLoaded', function () {

  // ---------- WHATSAPP FLOATING BUTTON ----------
  // Builds the floating button's link from KAATHAM_WHATSAPP_NUMBER above,
  // so the number only has to be entered in one place.
  const whatsappFab = document.querySelector('.whatsapp-fab');
  if (whatsappFab) {
    const fabMessage = "Hello Kaatham! I am interested in planning a trip. Please share more details.";
    whatsappFab.href = `https://wa.me/${KAATHAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(fabMessage)}`;
  }


  // ---------- LOADER ----------
  // Hides the loading screen once the page has finished loading.
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('loaded');
    }, 300);
  });


  // ---------- NAVBAR ----------
  // Adds a solid background to the navbar once you scroll past the hero.
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  updateNavbar();
  window.addEventListener('scroll', updateNavbar);


  // ---------- MOBILE NAVIGATION ----------
  // Toggles the slide-in mobile menu and closes it when a link is tapped.
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });


  // ---------- SCROLL ANIMATIONS ----------
  // Fades and slides elements into view as they enter the viewport.
  const revealEls = document.querySelectorAll('.reveal-el');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });


  // ---------- COUNTER ANIMATION ----------
  // Animates the "20+ Destinations / 1000+ Travellers" numbers when
  // they scroll into view.
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { counterObserver.observe(el); });


  // ---------- TESTIMONIAL SLIDER ----------
  // A simple auto-advancing carousel with clickable dots.
  const testiTrack = document.getElementById('testiTrack');
  const testiDotsWrap = document.getElementById('testiDots');
  if (testiTrack) {
    const slides = testiTrack.children;
    let current = 0;
    let autoTimer;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      testiDotsWrap.appendChild(dot);
    }
    const dots = testiDotsWrap.children;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      testiTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === current);
      }
    }

    function startAuto() {
      autoTimer = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    startAuto();
    testiTrack.addEventListener('mouseenter', stopAuto);
    testiTrack.addEventListener('mouseleave', startAuto);
  }


  // ---------- TRIP DETAILS MODAL ----------

const tripModal = document.getElementById('tripModal');
const viewJourneyBtn = document.getElementById('viewJourneyBtn');

function openTripModal(pkg) {

  if (!tripModal || !pkg) return;

  // Title
  const modalTitle = document.getElementById('modal-trip-title');
  if (modalTitle) {
    modalTitle.textContent = pkg.title || '';
  }

  // Duration
  const tripModalTitle = document.getElementById('tripModalTitle');
  if (tripModalTitle) {
    tripModalTitle.textContent =
      `${pkg.duration || ''} · ${pkg.destination || ''}`;
  }

  // Description
  const modalDescription =
    document.getElementById('modal-description');

  if (modalDescription) {
    modalDescription.textContent = pkg.description || '';
  }

  // Route
  const modalRoute = document.getElementById('modal-route');

  if (modalRoute) {
    modalRoute.textContent = pkg.route || '';
  }

  // Highlights
  const modalHighlights =
    document.getElementById('modal-highlights');

  if (modalHighlights) {
    modalHighlights.innerHTML = '';

    if (pkg.highlights) {
      pkg.highlights
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          modalHighlights.appendChild(li);
        });
    }
  }

  // Departure
  const modalDeparture =
    document.getElementById('modal-departure');

  if (modalDeparture) {
    modalDeparture.textContent =
      `${pkg.departure || ''} · ${pkg.destination || ''} · ₹${Number(pkg.price || 0).toLocaleString('en-IN')} per head`;
  }

  // Inclusions
  const modalInclusions =
    document.getElementById('model-inclusions');

  if (modalInclusions) {
    modalInclusions.innerHTML = '';

    if (pkg.inclusions) {
      pkg.inclusions
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          modalInclusions.appendChild(li);
        });
    }
  }

  // Exclusions
  const modalExclusions =
    document.getElementById('modal-exclusions');

  if (modalExclusions) {
    modalExclusions.innerHTML = '';

    if (pkg.exclusions) {
      pkg.exclusions
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          modalExclusions.appendChild(li);
        });
    }
  }

  // Enquire button
  const modalEnquireButton =
    document.getElementById('modal-enquire-btn');

  if (modalEnquireButton) {
    modalEnquireButton.setAttribute(
      'data-trip',
      pkg.title || ''
    );
  }

  // Open modal
  tripModal.hidden = false;
  document.body.style.overflow = 'hidden';
}


// Existing Featured Trip button
if (viewJourneyBtn) {
  viewJourneyBtn.addEventListener('click', function () {

    // Featured trip data is already loaded into the modal
    tripModal.hidden = false;
    document.body.style.overflow = 'hidden';

  });
}


// Close modal
function closeModal() {
  if (!tripModal) return;

  tripModal.hidden = true;
  document.body.style.overflow = '';
}

if (tripModal) {

  tripModal
    .querySelectorAll('[data-close-modal]')
    .forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

}


// Escape key
document.addEventListener('keydown', function (e) {

  if (
    e.key === 'Escape' &&
    tripModal &&
    !tripModal.hidden
  ) {
    closeModal();
  }

});


  // ---------- TRAVELLERS' EXPERIENCES — LIGHTBOX VIEWER ----------
  // Reads each gallery photo's data-* attributes (set in the HTML) and
  // shows them full-screen. Works with click, keyboard arrows/Escape,
  // and touch swipe on mobile. Adding a new photo to the gallery in
  // index.html automatically makes it part of this viewer — no JS edits
  // needed.
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxLoc = document.getElementById('lightboxLoc');
    const lightboxReview = document.getElementById('lightboxReview');
    const lightboxName = document.getElementById('lightboxName');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    let activeIndex = 0;

    function renderSlide(index) {
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[activeIndex];
      const img = item.querySelector('img');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxLoc.textContent = '📍 ' + item.dataset.location;
      lightboxReview.textContent = '"' + item.dataset.review + '"';
      lightboxName.textContent = '👤 ' + item.dataset.name;
    }

    function openLightbox(index) {
      renderSlide(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
      });
    });

    lightbox.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    prevBtn.addEventListener('click', function () { renderSlide(activeIndex - 1); });
    nextBtn.addEventListener('click', function () { renderSlide(activeIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') renderSlide(activeIndex - 1);
      if (e.key === 'ArrowRight') renderSlide(activeIndex + 1);
    });

    // Basic swipe support for mobile.
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    });
    lightbox.addEventListener('touchend', function (e) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) < 40) return; // ignore small taps
      if (deltaX > 0) renderSlide(activeIndex - 1); else renderSlide(activeIndex + 1);
    });
  }


  // ---------- INDIA MAP TOOLTIPS ----------
  // Shows a small info card when a map pin is hovered or focused.
  const mapPins = document.querySelectorAll('.map-pin');
  const tooltip = document.getElementById('mapTooltip');
  const tooltipTitle = document.getElementById('mapTooltipTitle');
  const tooltipText = document.getElementById('mapTooltipText');

  mapPins.forEach(function (pin) {
    function show() {
      tooltipTitle.textContent = pin.dataset.place;
      tooltipText.textContent = pin.dataset.info;
      tooltip.style.left = pin.style.left;
      tooltip.style.top = pin.style.top;
      tooltip.hidden = false;
    }
    function hide() { tooltip.hidden = true; }

    pin.addEventListener('mouseenter', show);
    pin.addEventListener('mouseleave', hide);
    pin.addEventListener('focus', show);
    pin.addEventListener('blur', hide);
  });


  // ---------- ENQUIRY FORM VALIDATION ----------
  // Simple client-side validation. Structured so a real backend or
  // form service (e.g. Formspree, EmailJS) can be dropped in later —
  // just replace the "TODO" section below with your API call.
  const form = document.getElementById('enquiryForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field) {
    const wrapper = field.closest('.field');
    let valid = field.checkValidity();

    if (field.type === 'tel') {
      const digits = field.value.replace(/\D/g, '');
      valid = valid && digits.length >= 10;
    }

    wrapper.classList.toggle('invalid', !valid);
    return valid;
  }

  if (form) {
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;

    requiredFields.forEach(function (field) {
        if (!validateField(field)) {
            allValid = false;
        }
    });

    // Stop if the form is not valid
    if (!allValid) {
        formSuccess.hidden = true;
        return;
    }

    // Get the customer's details
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const destination = document.getElementById('destination').value;
    const travellers = document.getElementById('travellers').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value;

    // Create WhatsApp message
    // Note: this is a WhatsApp-based enquiry system — nothing is stored
    // in a database. The message is simply handed to WhatsApp to send.
    const whatsappMessage = `Hello Kaatham!

New Trip Enquiry

Name: ${name}
Phone: ${phone}
Email: ${email}
Destination: ${destination}
Travellers: ${travellers}
Travel Date: ${date}
Message: ${message}

Please contact me regarding this trip.`;

    // Create WhatsApp link using the number set in KAATHAM_WHATSAPP_NUMBER
    // at the top of this file.
    const whatsappURL =
        `https://wa.me/${KAATHAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    formSuccess.hidden = false;

    form.reset();

    formSuccess.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
});
  }


  // ---------- WHATSAPP "BOOK THIS TRIP" LINKS ----------
  // Pre-fills the destination in the enquiry form when someone clicks
  // a "Book This Trip" / "Enquire" button from a specific package card.
  document.querySelectorAll('[data-trip]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const destinationField = document.getElementById('destination');
      if (!destinationField) return;
      const tripName = btn.dataset.trip;
      for (let i = 0; i < destinationField.options.length; i++) {
        if (destinationField.options[i].text === tripName) {
          destinationField.selectedIndex = i;
          break;
        }
      }
    });
  });


  // ---------- FOOTER YEAR ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});



// -------  SUPABASE CONNECTION--------//

async function loadPackages() {
    const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase error:", error);
        return;
    }

    console.log("Packages loaded:", data);

    const packagesGrid = document.getElementById('package-grid');

    if (!packagesGrid) return;

    packagesGrid.innerHTML = '';

    data.forEach(pkg => {
        const card = document.createElement('article');

        card.className = 'pkg-card';

        card.innerHTML = `
            <div class="pkg-img" style="--img:url('${pkg.image_url || ''}')">
            </div>

            <div class="pkg-body">
                <h3>${pkg.title}</h3>

                <p class="pkg-desc">
                    ${pkg.description || ''}
                </p>

                <div class="pkg-meta">
                    <span>${pkg.duration || ''}</span>
                    <strong>From ₹${Number(pkg.price || 0).toLocaleString('en-IN')}</strong>
                </div>

                <div class="pkg-actions">
                    <button
                        class="btn-link"
                        data-view-details
                        data-package-id="${pkg.id}">
                        View Details
                    </button>

                    <a href="#enquiry"
                       class="btn btn-small btn-dark"
                       data-trip="${pkg.title}">
                        Enquire
                    </a>
                </div>
            </div>
        `;

        packagesGrid.appendChild(card);

        // Connect this package to the existing trip modal
        const detailsButton = card.querySelector('[data-view-details]');

        if (detailsButton) {
            detailsButton.addEventListener('click', function () {
                openTripModal(pkg);
            });
        }
    });
}

// ---------- TRIP DETAILS MODAL ----------

const tripModal = document.getElementById('tripModal');
const viewJourneyBtn = document.getElementById('viewJourneyBtn');

function openTripModal(pkg) {

  if (!tripModal || !pkg) return;

  // Title
  const modalTitle = document.getElementById('modal-trip-title');

  if (modalTitle) {
    modalTitle.textContent = pkg.title || '';
  }

  // Duration + destination
  const tripModalTitle = document.getElementById('tripModalTitle');

  if (tripModalTitle) {
    tripModalTitle.textContent =
      `${pkg.duration || ''} · ${pkg.destination || ''}`;
  }

  // Description
  const modalDescription =
    document.getElementById('modal-description');

  if (modalDescription) {
    modalDescription.textContent =
      pkg.description || '';
  }

  // Route
  const modalRoute =
    document.getElementById('modal-route');

  if (modalRoute) {
    modalRoute.textContent =
      pkg.route || '';
  }

  // Highlights
  const modalHighlights =
    document.getElementById('modal-highlights');

  if (modalHighlights) {

    modalHighlights.innerHTML = '';

    if (pkg.highlights) {

      pkg.highlights
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {

          const li = document.createElement('li');

          li.textContent = item;

          modalHighlights.appendChild(li);

        });
    }
  }

  // Departure
  const modalDeparture =
    document.getElementById('modal-departure');

  if (modalDeparture) {

    modalDeparture.textContent =
      `${pkg.departure || ''} · ${pkg.destination || ''} · ₹${Number(pkg.price || 0).toLocaleString('en-IN')} per head`;

  }

  // Inclusions
  const modalInclusions =
    document.getElementById('model-inclusions');

  if (modalInclusions) {

    modalInclusions.innerHTML = '';

    if (pkg.inclusions) {

      pkg.inclusions
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {

          const li = document.createElement('li');

          li.textContent = item;

          modalInclusions.appendChild(li);

        });
    }
  }

  // Exclusions
  const modalExclusions =
    document.getElementById('modal-exclusions');

  if (modalExclusions) {

    modalExclusions.innerHTML = '';

    if (pkg.exclusions) {

      pkg.exclusions
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => {

          const li = document.createElement('li');

          li.textContent = item;

          modalExclusions.appendChild(li);

        });
    }
  }

  // Enquire button
  const modalEnquireButton =
    document.getElementById('modal-enquire-btn');

  if (modalEnquireButton) {

    modalEnquireButton.setAttribute(
      'data-trip',
      pkg.title || ''
    );

  }

  // Open modal
  tripModal.hidden = false;

  document.body.style.overflow = 'hidden';
}


// ---------- FEATURED TRIP VIEW JOURNEY ----------

if (viewJourneyBtn) {

  viewJourneyBtn.addEventListener('click', function () {

    tripModal.hidden = false;

    document.body.style.overflow = 'hidden';

  });

}


// ---------- CLOSE MODAL ----------

function closeModal() {

  if (!tripModal) return;

  tripModal.hidden = true;

  document.body.style.overflow = '';

}


if (tripModal) {

  tripModal
    .querySelectorAll('[data-close-modal]')
    .forEach(function (el) {

      el.addEventListener('click', closeModal);

    });

}


// ---------- ESCAPE KEY ----------

document.addEventListener('keydown', function (e) {

  if (
    e.key === 'Escape' &&
    tripModal &&
    !tripModal.hidden
  ) {

    closeModal();

  }

});

loadPackages();


// =============================
// LOAD BROCHURES
// =============================

async function loadBrochures() {

    const { data, error } = await supabaseClient
        .from('brochures')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Brochures error:", error);
        return;
    }

    const brochuresGrid =
        document.getElementById('brochure-grid');

    if (!brochuresGrid) return;

    brochuresGrid.innerHTML = '';

    if (!data || data.length === 0) {
        brochuresGrid.innerHTML =
            '<p>No brochures available at the moment.</p>';
        return;
    }

    data.forEach(brochure => {

    const card =
        document.createElement('article');

    card.className = 'brochure-card';

    card.style.backgroundImage = `
        linear-gradient(
            to top,
            rgba(0, 0, 0, 0.85),
            rgba(0, 0, 0, 0.15)
        ),
        url('${brochure.image_url || ''}')
    `;

    card.innerHTML = `
        <div class="brochure-content">

            <span class="brochure-label">
                TRAVEL BROCHURE
            </span>

            <h3>
                ${brochure.title}
            </h3>

            <a
                href="${brochure.file_url}"
                target="_blank"
                rel="noopener noreferrer"
                class="brochure-btn">
                View Brochure
                <span>→</span>
            </a>

        </div>
    `;

    brochuresGrid.appendChild(card);
});
}


// Load brochures
loadBrochures();