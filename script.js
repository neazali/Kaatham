const SUPABASE_URL =
"https://vitjgnihandcyhupnrvd.supabase.co";
const SUPABASE_KEY = "sb_publishable_d8TT3ezUWAIWEyw2lERu7A_hBn7-eMa";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* ============================================================
   KAATHAM — SCRIPT.JS
   Cleaned & consolidated version
   ============================================================ */


/* ============================================================
   SITE CONFIG
   ============================================================ */

const KAATHAM_WHATSAPP_NUMBER = '917838708591';


/* ============================================================
   FEATURED TRIP DATA
   ============================================================ */

let featuredTripData = null;


/* ============================================================
   TRIP DETAILS MODAL
   ============================================================ */

function openTripModal(pkg) {

    const tripModal = document.getElementById('tripModal');

    if (!tripModal || !pkg) return;


    // ---------- TITLE ----------

    const modalTitle =
        document.getElementById('modal-trip-title');

    if (modalTitle) {
        modalTitle.textContent = pkg.title || '';
    }


    // ---------- DURATION + DESTINATION ----------

    const tripModalTitle =
        document.getElementById('tripModalTitle');

    if (tripModalTitle) {
        tripModalTitle.textContent =
            `${pkg.duration || ''} · ${pkg.destination || ''}`;
    }


    // ---------- DESCRIPTION ----------

    const modalDescription =
        document.getElementById('modal-description');

    if (modalDescription) {
        modalDescription.textContent =
            pkg.description || '';
    }


    // ---------- ROUTE ----------

    const modalRoute =
        document.getElementById('modal-route');

    if (modalRoute) {
        modalRoute.textContent =
            pkg.route || '';
    }


    // ---------- HIGHLIGHTS ----------

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

                    const li =
                        document.createElement('li');

                    li.textContent = item;

                    modalHighlights.appendChild(li);
                });
        }
    }


    // ---------- DEPARTURE + PRICE ----------

    const modalDeparture =
        document.getElementById('modal-departure');

    if (modalDeparture) {

        modalDeparture.textContent =
            `${pkg.departure || ''} · ${pkg.destination || ''} · ₹${Number(pkg.price || 0).toLocaleString('en-IN')} per head`;
    }


    // ---------- INCLUSIONS ----------

    const modalInclusions =
        document.getElementById('modal-inclusions');

    if (modalInclusions) {

        modalInclusions.innerHTML = '';

        if (pkg.inclusions) {

            pkg.inclusions
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => {

                    const li =
                        document.createElement('li');

                    li.textContent = item;

                    modalInclusions.appendChild(li);
                });
        }
    }


    // ---------- EXCLUSIONS ----------

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

                    const li =
                        document.createElement('li');

                    li.textContent = item;

                    modalExclusions.appendChild(li);
                });
        }
    }


    // ---------- ENQUIRE BUTTON ----------

    const modalEnquireButton =
        document.getElementById('modal-enquire-btn');

    if (modalEnquireButton) {

        modalEnquireButton.setAttribute(
            'data-trip',
            pkg.title || ''
        );
    }


    // ---------- OPEN MODAL ----------

    tripModal.hidden = false;

    document.body.style.overflow = 'hidden';
}


function closeModal() {

    const tripModal =
        document.getElementById('tripModal');

    if (!tripModal) return;

    tripModal.hidden = true;

    document.body.style.overflow = '';
}


/* ============================================================
   LOAD FEATURED TRIP
   ============================================================ */

async function loadFeaturedTrip() {

    const title =
        document.getElementById('featured-title');

    try {

        // ---------- LOADING STATE ----------

        if (title) {
            title.textContent = 'Loading...';
        }


        // ---------- SUPABASE REQUEST ----------

        const featuredRequest =
            supabaseClient
                .from('featured_trips')
                .select('*')
                .eq('is_active', true)
                .order('display_order', {
                    ascending: true
                })
                .limit(1)
                .maybeSingle();


        // ---------- TIMEOUT ----------

        const timeout =
            new Promise((_, reject) => {

                setTimeout(() => {
                    reject(
                        new Error(
                            'Featured trip request timed out'
                        )
                    );
                }, 8000);

            });


        const { data, error } =
            await Promise.race([
                featuredRequest,
                timeout
            ]);


        // ---------- ERROR ----------

        if (error) {

            console.error(
                'Error loading featured trip:',
                error
            );

            if (title) {
                title.textContent =
                    'Unable to load featured trip';
            }

            return;
        }


        // ---------- NO DATA ----------

        if (!data) {

            console.log(
                'No active featured trip found.'
            );

            if (title) {
                title.textContent =
                    'No featured trip available';
            }

            return;
        }


        // Store featured trip globally
        featuredTripData = data;


        // ---------- TITLE ----------

        if (title) {
            title.textContent =
                data.title || '';
        }


        // ---------- META ----------

        const meta =
            document.getElementById('featured-meta');

        if (meta) {

            meta.textContent =
                `${data.duration || ''} · ${data.destination || ''}`;
        }


        // ---------- DESCRIPTION ----------

        const description =
            document.getElementById(
                'featured-description'
            );

        if (description) {

            description.textContent =
                data.description || '';
        }


        // ---------- PRICE ----------

        const price =
            document.getElementById(
                'featured-price'
            );

        if (price) {

            price.textContent =
                data.price
                    ? `₹${Number(data.price).toLocaleString('en-IN')}`
                    : '';
        }


        // ---------- DEPARTURE ----------

        const departure =
            document.getElementById(
                'featured-departure'
            );

        if (departure) {

            departure.textContent =
                data.departure || '';
        }


        // ---------- ROUTE ----------

        const routeLine =
            document.getElementById(
                'featured-route-line'
            );

        if (routeLine) {

            routeLine.innerHTML = '';

            if (data.route) {

                data.route
                    .split('-')
                    .map(item => item.trim())
                    .filter(Boolean)
                    .forEach(item => {

                        const span =
                            document.createElement('span');

                        span.textContent = item;

                        routeLine.appendChild(span);
                    });
            }
        }


        // ---------- BOOK BUTTON ----------

        const bookButton =
            document.getElementById(
                'featured-book-btn'
            );

        if (bookButton) {

            bookButton.setAttribute(
                'data-trip',
                data.title || ''
            );
        }


        // ---------- MODAL DATA ----------

        const modalTitle =
            document.getElementById(
                'modal-trip-title'
            );

        if (modalTitle) {
            modalTitle.textContent =
                data.title || '';
        }


        const modalTripTitle =
            document.getElementById(
                'tripModalTitle'
            );

        if (modalTripTitle) {

            modalTripTitle.textContent =
                `${data.duration || ''} · ${data.destination || ''}`;
        }


        const modalDescription =
            document.getElementById(
                'modal-description'
            );

        if (modalDescription) {

            modalDescription.textContent =
                data.description || '';
        }


        const modalEnquireButton =
            document.getElementById(
                'modal-enquire-btn'
            );

        if (modalEnquireButton) {

            modalEnquireButton.setAttribute(
                'data-trip',
                data.title || ''
            );
        }


        // ---------- IMAGE ----------

        const media =
            document.querySelector(
                '.featured-media'
            );

        if (media && data.image_url) {

            media.style.setProperty(
                '--img',
                `url('${data.image_url}')`
            );
        }


        // ---------- MODAL ROUTE ----------

        const modalRoute =
            document.getElementById(
                'modal-route'
            );

        if (modalRoute) {

            modalRoute.textContent =
                data.route || '';
        }


        // ---------- MODAL DEPARTURE + PRICE ----------

        const modalDeparture =
            document.getElementById(
                'modal-departure'
            );

        if (modalDeparture) {

            modalDeparture.textContent =
                `${data.departure || ''} · ${data.destination || ''} · ₹${Number(data.price || 0).toLocaleString('en-IN')} per head`;
        }


        // ---------- MODAL HIGHLIGHTS ----------

        const modalHighlights =
            document.getElementById(
                'modal-highlights'
            );

        if (modalHighlights) {

            modalHighlights.innerHTML = '';

            if (data.highlights) {

                data.highlights
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                    .forEach(item => {

                        const li =
                            document.createElement('li');

                        li.textContent = item;

                        modalHighlights.appendChild(li);
                    });
            }
        }


        // ---------- MODAL INCLUSIONS ----------

        const modalInclusions =
            document.getElementById(
                'modal-inclusions'
            );

        if (modalInclusions) {

            modalInclusions.innerHTML = '';

            if (data.inclusions) {

                data.inclusions
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                    .forEach(item => {

                        const li =
                            document.createElement('li');

                        li.textContent = item;

                        modalInclusions.appendChild(li);
                    });
            }
        }


        // ---------- MODAL EXCLUSIONS ----------

        const modalExclusions =
            document.getElementById(
                'modal-exclusions'
            );

        if (modalExclusions) {

            modalExclusions.innerHTML = '';

            if (data.exclusions) {

                data.exclusions
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                    .forEach(item => {

                        const li =
                            document.createElement('li');

                        li.textContent = item;

                        modalExclusions.appendChild(li);
                    });
            }
        }


        console.log(
            'Featured trip loaded:',
            data
        );

        console.log(
            'ROUTE FROM DATABASE:',
            data.route
        );

    } catch (err) {

        console.error(
            'Unexpected featured trip error:',
            err
        );

        if (title) {

            title.textContent =
                'Unable to load featured trip';
        }
    }
}


/* ============================================================
   LOAD PACKAGES
   ============================================================ */

async function loadPackages() {

    console.time('Packages Load Time');

    const packagesGrid =
        document.getElementById('package-grid');

    if (!packagesGrid) return;


    // ---------- LOADING STATE ----------

    packagesGrid.innerHTML = `
        <p class="data-loading">
            Loading packages...
        </p>
    `;


    try {

        const { data, error } =
            await supabaseClient
                .from('packages')
                .select('*')
                .eq('is_active', true)
                .order('created_at', {
                    ascending: false
                });


        // ---------- ERROR ----------

        if (error) {

            console.error(
                'Packages Supabase error:',
                error
            );

            packagesGrid.innerHTML = `
                <p class="data-error">
                    Unable to load packages right now.
                    Please refresh the page.
                </p>
            `;

            return;
        }


        console.log(
            'Packages loaded:',
            data
        );

        console.timeEnd(
            'Packages Load Time'
        );


        // ---------- EMPTY ----------

        if (!data || data.length === 0) {

            packagesGrid.innerHTML = `
                <p class="data-empty">
                    No packages available at the moment.
                </p>
            `;

            return;
        }


        // ---------- CLEAR GRID ----------

        packagesGrid.innerHTML = '';


        // ---------- CREATE CARDS ----------

        data.forEach(pkg => {

            const card =
                document.createElement('article');

            card.className = 'pkg-card';


            card.innerHTML = `
                <div
                    class="pkg-img"
                    style="--img:url('${pkg.image_url || ''}')">
                </div>

                <div class="pkg-body">

                    <h3>
                        ${pkg.title || ''}
                    </h3>

                    <p class="pkg-desc">
                        ${pkg.description || ''}
                    </p>

                    <div class="pkg-meta">

                        <span>
                            ${pkg.duration || ''}
                        </span>

                        <strong>
                            From ₹${Number(pkg.price || 0).toLocaleString('en-IN')}
                        </strong>

                    </div>

                    <div class="pkg-actions">

                        <button
                            class="btn-link"
                            type="button"
                            data-view-details
                            data-package-id="${pkg.id}">
                            View Details
                        </button>

                        <a
                            href="#enquiry"
                            class="btn btn-small btn-dark"
                            data-trip="${pkg.title || ''}">
                            Enquire
                        </a>

                    </div>

                </div>
            `;


            packagesGrid.appendChild(card);


            // ---------- VIEW DETAILS ----------

            const detailsButton =
                card.querySelector(
                    '[data-view-details]'
                );

            if (detailsButton) {

                detailsButton.addEventListener(
                    'click',
                    function () {

                        openTripModal(pkg);

                    }
                );
            }

        });

    } catch (err) {

        console.error(
            'Unexpected packages error:',
            err
        );

        packagesGrid.innerHTML = `
            <p class="data-error">
                Something went wrong while loading packages.
                Please refresh the page.
            </p>
        `;
    }
}

/* ============================================================
   LOAD COLLEGE TRIPS
============================================================ */

async function loadCollegeTrips() {

    const grid =
        document.getElementById('college-trips-grid');

    if (!grid) return;


    grid.innerHTML = `
        <p class="data-loading">
            Loading college trips...
        </p>
    `;


    try {

        const { data, error } =
            await supabaseClient
                .from('college_trips')
                .select('*')
                .eq('is_active', true)
                .order('display_order', {
    ascending: true
});


        /* ---------- ERROR ---------- */

        if (error) {

            console.error(
                'College trips Supabase error:',
                error
            );

            grid.innerHTML = `
                <p class="data-error">
                    Unable to load college trips right now.
                </p>
            `;

            return;
        }


        /* ---------- EMPTY ---------- */

        if (!data || data.length === 0) {

            grid.innerHTML = `
                <p class="data-empty">
                    College trips coming soon.
                </p>
            `;

            return;
        }


        /* ---------- CLEAR GRID ---------- */

        grid.innerHTML = '';


        /* ---------- CREATE CARDS ---------- */

        data.forEach(trip => {

            const card =
                document.createElement('article');

            card.className =
                'college-trip-card';


            card.innerHTML = `

                <div
                    class="college-trip-image"
                    style="
                        background-image:
                        url('${trip.image_url || ''}');
                    "
                >

                    <div class="college-trip-overlay"></div>


                    <span class="college-trip-badge">
                        COLLEGE TRIP
                    </span>


                    <div class="college-trip-image-content">

                        <span>
                            ${trip.destination || ''}
                        </span>

                    </div>

                </div>


                <div class="college-trip-body">

                    <div class="college-trip-meta">

                        <span>
                            ${trip.duration || ''}
                        </span>

                        ${
                            trip.price
                                ? `<strong>
                                    From ₹${Number(
                                        trip.price
                                    ).toLocaleString('en-IN')}
                                   </strong>`
                                : ''
                        }

                    </div>


                    <h3>
                        ${trip.title || ''}
                    </h3>


                    <p>
                        ${trip.description || ''}
                    </p>


                    <a
                        href="#enquiry"
                        class="college-trip-link btn-trip-enquire"
                        data-trip="${trip.title || ''}">

                        Plan This Trip

                        <span>→</span>

                    </a>

                </div>

            `;


            grid.appendChild(card);

        });


        console.log(
            'College trips loaded:',
            data
        );


    } catch (err) {

        console.error(
            'Unexpected college trips error:',
            err
        );

        grid.innerHTML = `
            <p class="data-error">
                Something went wrong while loading college trips.
            </p>
        `;
    }
}

/* ============================================================
   LOAD BROCHURES
   ============================================================ */

async function loadBrochures() {

    const brochuresGrid =
        document.getElementById(
            'brochure-grid'
        );

    if (!brochuresGrid) return;


    // ---------- LOADING STATE ----------

    brochuresGrid.innerHTML = `
        <p class="data-loading">
            Loading brochures...
        </p>
    `;


    try {

        const { data, error } =
            await supabaseClient
                .from('brochures')
                .select('*')
                .eq('is_active', true)
                .order('created_at', {
                    ascending: false
                });


        // ---------- ERROR ----------

        if (error) {

            console.error(
                'Brochures Supabase error:',
                error
            );

            brochuresGrid.innerHTML = `
                <p class="data-error">
                    Unable to load brochures right now.
                    Please refresh the page.
                </p>
            `;

            return;
        }


        console.log(
            'Brochures loaded:',
            data
        );


        // ---------- EMPTY ----------

        if (!data || data.length === 0) {

            brochuresGrid.innerHTML = `
                <p class="data-empty">
                    No brochures available at the moment.
                </p>
            `;

            return;
        }


        brochuresGrid.innerHTML = '';


        // ---------- CREATE BROCHURE CARDS ----------

        data.forEach(brochure => {

            const card =
                document.createElement('article');

            card.className =
                'brochure-card';


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
                        ${brochure.title || ''}
                    </h3>

                    <a
                        href="${brochure.file_url || '#'}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="brochure-btn">

                        View Brochure

                        <span>
                            →
                        </span>

                    </a>

                </div>
            `;


            brochuresGrid.appendChild(card);

        });

    } catch (err) {

        console.error(
            'Unexpected brochures error:',
            err
        );

        brochuresGrid.innerHTML = `
            <p class="data-error">
                Something went wrong while loading brochures.
                Please refresh the page.
            </p>
        `;
    }
}


/* ============================================================
   LOAD MALAYALAM SECTION
   ============================================================ */

async function loadMalayalamSection() {

    console.log("Malayalam: function started");

    const section = document.getElementById('malayalam-section');
    const eyebrow = document.getElementById('malayalam-eyebrow');
    const mainText = document.getElementById('malayalam-main');
    const subText = document.getElementById('malayalam-sub');
    const button = document.getElementById('malayalam-button');

    if (!section) {
        console.error("Malayalam: section NOT found in HTML");
        return;
    }

    try {

        const { data, error } = await supabaseClient
            .from('malayalam_section')
            .select('*')
            .eq('is_active', true)
            .order('updated_at', {
                ascending: false
            })
            .limit(1)
            .maybeSingle();

        console.log("Malayalam: Supabase response", data, error);

        if (error) {

            console.error(
                "Malayalam Supabase error:",
                error
            );

            return;
        }

        if (!data) {

            console.warn(
                "Malayalam: No active row found"
            );

            section.style.display = 'none';

            return;
        }

        /* ---------- FILL CONTENT ---------- */

        if (eyebrow) {
            eyebrow.textContent = data.eyebrow || '';
        }

        if (mainText) {
            mainText.textContent = data.main_text || '';
        }

        if (subText) {
            subText.textContent = data.sub_text || '';
        }

        if (button) {

            button.textContent =
                data.button_text || '';

            button.href =
                data.button_link || '#enquiry';
        }

        /* ---------- SHOW SECTION ---------- */

        section.style.display = 'block';

        console.log(
            "Malayalam section successfully loaded:",
            data
        );
    }

    catch (err) {

        console.error(
            "Malayalam unexpected error:",
            err
        );
    }
}

/* ============================================================
   DOM CONTENT LOADED
   ============================================================ */

document.addEventListener(
    'DOMContentLoaded',
    function () {


        /* ====================================================
           WHATSAPP FLOATING BUTTON
           ==================================================== */

        const whatsappFab =
            document.querySelector(
                '.whatsapp-fab'
            );

        if (whatsappFab) {

            const fabMessage =
                'Hello Kaatham! I am interested in planning a trip. Please share more details.';

            whatsappFab.href =
                `https://wa.me/${KAATHAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(fabMessage)}`;
        }


        /* ====================================================
           LOADER
           ==================================================== */

        const loader =
            document.getElementById('loader');

        window.addEventListener(
            'load',
            function () {

                if (!loader) return;

                setTimeout(
                    function () {

                        loader.classList.add(
                            'loaded'
                        );

                    },
                    300
                );
            }
        );


        /* ====================================================
           NAVBAR
           ==================================================== */

        const navbar =
            document.getElementById('navbar');

        function updateNavbar() {

            if (!navbar) return;

            if (window.scrollY > 60) {

                navbar.classList.add(
                    'scrolled'
                );

            } else {

                navbar.classList.remove(
                    'scrolled'
                );
            }
        }

        updateNavbar();

        window.addEventListener(
            'scroll',
            updateNavbar
        );


        /* ====================================================
           MOBILE NAVIGATION
           ==================================================== */

        const hamburger =
            document.getElementById(
                'hamburger'
            );

        const navLinks =
            document.getElementById(
                'navLinks'
            );


        function closeMobileMenu() {

            if (!navLinks || !hamburger) return;

            navLinks.classList.remove(
                'open'
            );

            hamburger.classList.remove(
                'open'
            );

            hamburger.setAttribute(
                'aria-expanded',
                'false'
            );
        }


        if (hamburger && navLinks) {

            hamburger.addEventListener(
                'click',
                function () {

                    const isOpen =
                        navLinks.classList.toggle(
                            'open'
                        );

                    hamburger.classList.toggle(
                        'open',
                        isOpen
                    );

                    hamburger.setAttribute(
                        'aria-expanded',
                        String(isOpen)
                    );

                }
            );


            navLinks
                .querySelectorAll('a')
                .forEach(function (link) {

                    link.addEventListener(
                        'click',
                        closeMobileMenu
                    );

                });
        }


        /* ====================================================
           SCROLL REVEAL ANIMATIONS
           ==================================================== */

        const revealEls =
            document.querySelectorAll(
                '.reveal-el'
            );


        if (revealEls.length) {

            const revealObserver =
                new IntersectionObserver(
                    function (entries) {

                        entries.forEach(
                            function (entry) {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        'is-visible'
                                    );

                                    revealObserver.unobserve(
                                        entry.target
                                    );
                                }

                            }
                        );

                    },
                    {
                        threshold: 0.15
                    }
                );


            revealEls.forEach(
                function (el) {

                    revealObserver.observe(el);

                }
            );
        }


        /* ====================================================
           COUNTER ANIMATION
           ==================================================== */

        const counters =
            document.querySelectorAll(
                '.stat-num'
            );


        if (counters.length) {

            const counterObserver =
                new IntersectionObserver(
                    function (entries) {

                        entries.forEach(
                            function (entry) {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }


                                const el =
                                    entry.target;

                                const target =
                                    parseInt(
                                        el.dataset.count,
                                        10
                                    );

                                const duration =
                                    1400;

                                const start =
                                    performance.now();


                                function tick(now) {

                                    const progress =
                                        Math.min(
                                            (now - start) /
                                                duration,
                                            1
                                        );


                                    const eased =
                                        1 -
                                        Math.pow(
                                            1 - progress,
                                            3
                                        );


                                    el.textContent =
                                        Math.round(
                                            eased *
                                                target
                                        );


                                    if (
                                        progress < 1
                                    ) {

                                        requestAnimationFrame(
                                            tick
                                        );
                                    }
                                }


                                requestAnimationFrame(
                                    tick
                                );


                                counterObserver.unobserve(
                                    el
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.6
                    }
                );


            counters.forEach(
                function (el) {

                    counterObserver.observe(el);

                }
            );
        }


        /* ====================================================
           TESTIMONIAL SLIDER
           ==================================================== */

        const testiTrack =
            document.getElementById(
                'testiTrack'
            );

        const testiDotsWrap =
            document.getElementById(
                'testiDots'
            );


        if (
            testiTrack &&
            testiDotsWrap
        ) {

            const slides =
                testiTrack.children;

            let current = 0;
            let autoTimer;


            for (
                let i = 0;
                i < slides.length;
                i++
            ) {

                const dot =
                    document.createElement(
                        'button'
                    );

                dot.setAttribute(
                    'aria-label',
                    'Show testimonial ' +
                        (i + 1)
                );


                if (i === 0) {

                    dot.classList.add(
                        'active'
                    );
                }


                dot.addEventListener(
                    'click',
                    function () {

                        goTo(i);

                    }
                );


                testiDotsWrap.appendChild(
                    dot
                );
            }


            const dots =
                testiDotsWrap.children;


            function goTo(index) {

                current =
                    (index + slides.length) %
                    slides.length;


                testiTrack.style.transform =
                    'translateX(-' +
                    current * 100 +
                    '%)';


                for (
                    let i = 0;
                    i < dots.length;
                    i++
                ) {

                    dots[i].classList.toggle(
                        'active',
                        i === current
                    );
                }
            }


            function startAuto() {

                clearInterval(autoTimer);

                autoTimer =
                    setInterval(
                        function () {

                            goTo(
                                current + 1
                            );

                        },
                        5500
                    );
            }


            function stopAuto() {

                clearInterval(
                    autoTimer
                );
            }


            startAuto();


            testiTrack.addEventListener(
                'mouseenter',
                stopAuto
            );


            testiTrack.addEventListener(
                'mouseleave',
                startAuto
            );
        }


        /* ====================================================
           TRIP MODAL
           ==================================================== */

        const tripModal =
            document.getElementById(
                'tripModal'
            );

        const viewJourneyBtn =
            document.getElementById(
                'viewJourneyBtn'
            );


        // Featured Trip → View Journey

        if (viewJourneyBtn) {

            viewJourneyBtn.addEventListener(
                'click',
                function () {

                    if (
                        featuredTripData
                    ) {

                        openTripModal(
                            featuredTripData
                        );

                    } else if (
                        tripModal
                    ) {

                        tripModal.hidden =
                            false;

                        document.body.style.overflow =
                            'hidden';
                    }

                }
            );
        }


        // Close modal

        if (tripModal) {

            tripModal
                .querySelectorAll(
                    '[data-close-modal]'
                )
                .forEach(
                    function (el) {

                        el.addEventListener(
                            'click',
                            closeModal
                        );

                    }
                );
        }


        // Escape key

        document.addEventListener(
            'keydown',
            function (e) {

                if (
                    e.key === 'Escape' &&
                    tripModal &&
                    !tripModal.hidden
                ) {

                    closeModal();
                }

            }
        );


        /* ====================================================
           GALLERY LIGHTBOX
           ==================================================== */

        const galleryItems =
            Array.from(
                document.querySelectorAll(
                    '.gallery-item'
                )
            );

        const lightbox =
            document.getElementById(
                'lightbox'
            );


        if (
            galleryItems.length &&
            lightbox
        ) {

            const lightboxImg =
                document.getElementById(
                    'lightboxImg'
                );

            const lightboxLoc =
                document.getElementById(
                    'lightboxLoc'
                );

            const lightboxReview =
                document.getElementById(
                    'lightboxReview'
                );

            const lightboxName =
                document.getElementById(
                    'lightboxName'
                );

            const prevBtn =
                document.getElementById(
                    'lightboxPrev'
                );

            const nextBtn =
                document.getElementById(
                    'lightboxNext'
                );


            let activeIndex = 0;


            function renderSlide(index) {

                activeIndex =
                    (
                        index +
                        galleryItems.length
                    ) %
                    galleryItems.length;


                const item =
                    galleryItems[
                        activeIndex
                    ];


                const img =
                    item.querySelector(
                        'img'
                    );


                if (img && lightboxImg) {

                    lightboxImg.src =
                        img.src;

                    lightboxImg.alt =
                        img.alt;
                }


                if (lightboxLoc) {

                    lightboxLoc.textContent =
                        '📍 ' +
                        (
                            item.dataset.location ||
                            ''
                        );
                }


                if (lightboxReview) {

                    lightboxReview.textContent =
                        '"' +
                        (
                            item.dataset.review ||
                            ''
                        ) +
                        '"';
                }


                if (lightboxName) {

                    lightboxName.textContent =
                        '👤 ' +
                        (
                            item.dataset.name ||
                            ''
                        );
                }
            }


            function openLightbox(index) {

                renderSlide(index);

                lightbox.hidden = false;

                document.body.style.overflow =
                    'hidden';
            }


            function closeLightbox() {

                lightbox.hidden = true;

                document.body.style.overflow =
                    '';
            }


            galleryItems.forEach(
                function (item, index) {

                    item.addEventListener(
                        'click',
                        function () {

                            openLightbox(
                                index
                            );

                        }
                    );


                    item.setAttribute(
                        'tabindex',
                        '0'
                    );


                    item.setAttribute(
                        'role',
                        'button'
                    );


                    item.addEventListener(
                        'keydown',
                        function (e) {

                            if (
                                e.key ===
                                    'Enter' ||
                                e.key === ' '
                            ) {

                                e.preventDefault();

                                openLightbox(
                                    index
                                );
                            }
                        }
                    );
                }
            );


            lightbox
                .querySelectorAll(
                    '[data-close-lightbox]'
                )
                .forEach(
                    function (el) {

                        el.addEventListener(
                            'click',
                            closeLightbox
                        );

                    }
                );


            if (prevBtn) {

                prevBtn.addEventListener(
                    'click',
                    function () {

                        renderSlide(
                            activeIndex - 1
                        );

                    }
                );
            }


            if (nextBtn) {

                nextBtn.addEventListener(
                    'click',
                    function () {

                        renderSlide(
                            activeIndex + 1
                        );

                    }
                );
            }


            document.addEventListener(
                'keydown',
                function (e) {

                    if (lightbox.hidden) {
                        return;
                    }


                    if (
                        e.key === 'Escape'
                    ) {

                        closeLightbox();

                    } else if (
                        e.key === 'ArrowLeft'
                    ) {

                        renderSlide(
                            activeIndex - 1
                        );

                    } else if (
                        e.key === 'ArrowRight'
                    ) {

                        renderSlide(
                            activeIndex + 1
                        );
                    }

                }
            );


            // ---------- MOBILE SWIPE ----------

            let touchStartX = 0;


            lightbox.addEventListener(
                'touchstart',
                function (e) {

                    touchStartX =
                        e.changedTouches[0]
                            .clientX;

                }
            );


            lightbox.addEventListener(
                'touchend',
                function (e) {

                    const deltaX =
                        e.changedTouches[0]
                            .clientX -
                        touchStartX;


                    if (
                        Math.abs(deltaX) < 40
                    ) {
                        return;
                    }


                    if (deltaX > 0) {

                        renderSlide(
                            activeIndex - 1
                        );

                    } else {

                        renderSlide(
                            activeIndex + 1
                        );
                    }

                }
            );
        }


        /* ====================================================
           INDIA MAP TOOLTIPS
           ==================================================== */

        const mapPins =
            document.querySelectorAll(
                '.map-pin'
            );

        const tooltip =
            document.getElementById(
                'mapTooltip'
            );

        const tooltipTitle =
            document.getElementById(
                'mapTooltipTitle'
            );

        const tooltipText =
            document.getElementById(
                'mapTooltipText'
            );


        if (
            tooltip &&
            tooltipTitle &&
            tooltipText
        ) {

            mapPins.forEach(
                function (pin) {

                    function show() {

                        tooltipTitle.textContent =
                            pin.dataset.place ||
                            '';

                        tooltipText.textContent =
                            pin.dataset.info ||
                            '';

                        tooltip.style.left =
                            pin.style.left;

                        tooltip.style.top =
                            pin.style.top;

                        tooltip.hidden =
                            false;
                    }


                    function hide() {

                        tooltip.hidden =
                            true;
                    }


                    pin.addEventListener(
                        'mouseenter',
                        show
                    );

                    pin.addEventListener(
                        'mouseleave',
                        hide
                    );

                    pin.addEventListener(
                        'focus',
                        show
                    );

                    pin.addEventListener(
                        'blur',
                        hide
                    );

                }
            );
        }


        /* ====================================================
           ENQUIRY FORM
           ==================================================== */

        const form =
            document.getElementById(
                'enquiryForm'
            );

        const formSuccess =
            document.getElementById(
                'formSuccess'
            );


        function validateField(field) {

            const wrapper =
                field.closest(
                    '.field'
                );

            let valid =
                field.checkValidity();


            if (
                field.type === 'tel'
            ) {

                const digits =
                    field.value.replace(
                        /\D/g,
                        ''
                    );

                valid =
                    valid &&
                    digits.length >= 10;
            }


            if (wrapper) {

                wrapper.classList.toggle(
                    'invalid',
                    !valid
                );
            }


            return valid;
        }


        if (form) {

            const requiredFields =
                form.querySelectorAll(
                    '[required]'
                );


            requiredFields.forEach(
                function (field) {

                    field.addEventListener(
                        'blur',
                        function () {

                            validateField(
                                field
                            );

                        }
                    );
                }
            );


            form.addEventListener(
                'submit',
                function (e) {

                    e.preventDefault();


                    let allValid =
                        true;


                    requiredFields.forEach(
                        function (field) {

                            if (
                                !validateField(
                                    field
                                )
                            ) {

                                allValid =
                                    false;
                            }

                        }
                    );


                    if (!allValid) {

                        if (formSuccess) {
                            formSuccess.hidden =
                                true;
                        }

                        return;
                    }


                    // ---------- CUSTOMER DETAILS ----------

                    const name =
                        document.getElementById(
                            'name'
                        ).value;

                    const phone =
                        document.getElementById(
                            'phone'
                        ).value;

                    const email =
                        document.getElementById(
                            'email'
                        ).value;

                    const destination =
                        document.getElementById(
                            'destination'
                        ).value;

                    const travellers =
                        document.getElementById(
                            'travellers'
                        ).value;

                    const date =
                        document.getElementById(
                            'date'
                        ).value;

                    const message =
                        document.getElementById(
                            'message'
                        ).value;


                    // ---------- WHATSAPP MESSAGE ----------

                    const whatsappMessage =
`Hello Kaatham!

New Trip Enquiry

Name: ${name}
Phone: ${phone}
Email: ${email}
Destination: ${destination}
Travellers: ${travellers}
Travel Date: ${date}
Message: ${message}

Please contact me regarding this trip.`;


                    const whatsappURL =
                        `https://wa.me/${KAATHAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


                    // ---------- OPEN WHATSAPP ----------

                    window.open(
                        whatsappURL,
                        '_blank'
                    );


                    // ---------- SUCCESS ----------

                    if (formSuccess) {

                        formSuccess.hidden =
                            false;
                    }


                    form.reset();


                    if (formSuccess) {

                        formSuccess.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }

                }
            );
        }


        /* ====================================================
           DATA-TRIP BUTTONS
           ==================================================== */

        // Event delegation is used here because package cards
        // are created dynamically by loadPackages().

        document.addEventListener(
            'click',
            function (e) {

                const btn =
                    e.target.closest(
                        '[data-trip]'
                    );

                if (!btn) return;


                const destinationField =
                    document.getElementById(
                        'destination'
                    );

                if (!destinationField) {
                    return;
                }


                const tripName =
                    btn.dataset.trip;


                for (
                    let i = 0;
                    i <
                    destinationField.options.length;
                    i++
                ) {

                    if (
                        destinationField
                            .options[i]
                            .text === tripName
                    ) {

                        destinationField.selectedIndex =
                            i;

                        break;
                    }
                }

            }
        );


        /* ====================================================
           FOOTER YEAR
           ==================================================== */

        const yearEl =
            document.getElementById(
                'year'
            );

        if (yearEl) {

            yearEl.textContent =
                new Date().getFullYear();
        }

        

        /* ====================================================
           START SUPABASE DATA LOADS
           ==================================================== */

        loadFeaturedTrip();

        loadPackages();

        loadCollegeTrips();

        loadBrochures();

        loadMalayalamSection();


    }
);

/* =========================================================
   TREKS — CUSTOMER WEBSITE
========================================================= */

async function loadTreks() {

    const grid = document.getElementById("treksGrid");

    if (!grid) return;

    grid.innerHTML = "<p>Loading treks...</p>";

    try {

        const { data, error } = await supabaseClient
            .from("treks")
            .select("*")
            .eq("is_active", true)
            .order("display_order", {
                ascending: true
            })
            .order("created_at", {
                ascending: false
            });

        if (error) {

            console.error("Error loading treks:", error);

            grid.innerHTML =
                "<p>Could not load treks.</p>";

            return;
        }

        if (!data || data.length === 0) {

            grid.innerHTML =
                "<p>No treks available at the moment.</p>";

            return;
        }

        grid.innerHTML = "";

        data.forEach((trek, index) => {

            const card =
                document.createElement("a");

            card.className =
                index === 0
                    ? "dest-card dest-card--lg"
                    : "dest-card";

           card.href = "index.html";

card.addEventListener("click", function () {

    sessionStorage.setItem(
        "selectedTrek",
        trek.title
    );

});
            card.style.setProperty(
                "--img",
                `url('${trek.image_url}')`
            );

            card.innerHTML = `
                <span class="dest-name">
                    ${trek.title || ""}
                </span>

                <span class="dest-tag">
                    ${trek.destination || ""}
                </span>
            `;

            grid.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Unexpected trek loading error:",
            error
        );

        grid.innerHTML =
            "<p>Something went wrong while loading treks.</p>";
    }
}

loadTreks();


/* =========================================================
   TREK → ENQUIRY
========================================================= */

function selectTrekFromStorage() {

    const trekTitle =
        sessionStorage.getItem("selectedTrek");

    if (!trekTitle) return;

    const destinationSelect =
        document.getElementById("destination");

    if (!destinationSelect) return;

    destinationSelect.value = trekTitle;

    sessionStorage.removeItem("selectedTrek");

    const enquirySection =
        document.getElementById("enquiry");

    if (enquirySection) {

        setTimeout(() => {

            enquirySection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 300);
    }
}

/* =========================================================
   LOAD TREKS INTO ENQUIRY DROPDOWN
========================================================= */

async function loadTreksIntoEnquiry() {

    const destinationSelect =
        document.getElementById("destination");

    if (!destinationSelect) return;

    const { data, error } =
        await supabaseClient
            .from("treks")
            .select("title")
            .eq("is_active", true)
            .order("display_order", {
                ascending: true
            });

    if (error) {

        console.error(
            "Error loading trek enquiry options:",
            error
        );

        return;
    }

    data.forEach(trek => {

        const option =
            document.createElement("option");

        option.value = trek.title;
        option.textContent = trek.title;

        destinationSelect.insertBefore(
            option,
            destinationSelect.lastElementChild
        );
    });

    // Select trek from URL after options are loaded
    selectTrekFromStorage();
}

loadTreksIntoEnquiry();