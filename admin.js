/* =========================================================
   KAATHAM ADMIN PANEL
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL = "https://vitjgnihandcyhupnrvd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_d8TT3ezUWAIWEyw2lERu7A_hBn7-eMa";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   COMMON ELEMENTS
   ========================================================= */

const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const logoutBtn = document.getElementById("logout-btn");


/* =========================================================
   PACKAGE ELEMENTS
   ========================================================= */

const addPackageBtn =
    document.getElementById("add-package-btn");

const packageFormContainer =
    document.getElementById("package-form-container");

const packageForm =
    document.getElementById("package-form");

const cancelPackageBtn =
    document.getElementById("cancel-package-btn");

const packageFormMessage =
    document.getElementById("package-form-message");


/* =========================================================
   FEATURED TRIP ELEMENTS
   ========================================================= */

const addFeaturedTripBtn =
    document.getElementById("add-featured-trip-btn");

const featuredTripFormContainer =
    document.getElementById("featured-trip-form-container");

const featuredTripForm =
    document.getElementById("featured-trip-form");

const cancelFeaturedBtn =
    document.getElementById("cancel-featured-btn");

const featuredFormMessage =
    document.getElementById("featured-form-message");


/* =========================================================
   BROCHURE ELEMENTS
   ========================================================= */

const addBrochureBtn =
    document.getElementById("add-brochure-btn");

const brochureFormContainer =
    document.getElementById("brochure-form-container");

const brochureForm =
    document.getElementById("brochure-form");

const cancelBrochureBtn =
    document.getElementById("cancel-brochure-btn");

const brochureFormMessage =
    document.getElementById("brochure-form-message");

let editingBrochureId = null;
let editingBrochureFileUrl = null;


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    loginError.textContent = "";

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        console.error("Login error:", error);

        loginError.textContent =
            "Invalid email or password.";

        return;
    }

    console.log("Admin logged in:", data.user);

    showDashboard();
});


/* =========================================================
   SHOW DASHBOARD
   ========================================================= */

async function showDashboard() {

    loginScreen.style.display = "none";
    dashboard.style.display = "block";

    await loadPackages();
    await loadFeaturedTripsAdmin();
    await loadBrochures();
    await loadMalayalamSection();
    await loadTreks();
}


/* =========================================================
   CHECK EXISTING LOGIN
   ========================================================= */

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (session) {

        showDashboard();

    } else {

        loginScreen.style.display = "flex";
        dashboard.style.display = "none";
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutBtn.addEventListener("click", async function () {

    await supabaseClient.auth.signOut();

    dashboard.style.display = "none";
    loginScreen.style.display = "flex";
});


/* =========================================================
   PACKAGES
   ========================================================= */

/* -------------------------
   LOAD PACKAGES
------------------------- */

async function loadPackages() {

    const container =
        document.getElementById("admin-packages");

    if (!container) return;

    container.innerHTML =
        "<p>Loading packages...</p>";

    const { data, error } =
        await supabaseClient
            .from("packages")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error(
            "Error loading packages:",
            error
        );

        container.innerHTML =
            "<p>Could not load packages.</p>";

        return;
    }

    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No packages found.</p>";

        return;
    }

    container.innerHTML = "";

    data.forEach(pkg => {

        const element =
            document.createElement("div");

        element.className = "package";

        element.innerHTML = `

            <h3>${pkg.title || ""}</h3>

            <p>${pkg.destination || ""}</p>

            <p>${pkg.description || ""}</p>

            <p>${pkg.duration || ""}</p>

            <p class="price">
                ₹${Number(pkg.price || 0).toLocaleString("en-IN")}
            </p>

            <div class="package-status">

                <button
                    type="button"
                    class="toggle-package-btn ${
                        pkg.is_active
                            ? "active"
                            : "inactive"
                    }"
                    data-id="${pkg.id}"
                    data-active="${pkg.is_active}"
                >
                    ${
                        pkg.is_active
                            ? "🟢 Active"
                            : "⚪ Inactive"
                    }
                </button>

            </div>

            <div class="package-admin-actions">

                <button
                    type="button"
                    class="edit-package-btn"
                    data-id="${pkg.id}"
                >
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="delete-package-btn"
                    data-id="${pkg.id}"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        container.appendChild(element);
    });
}


/* -------------------------
   ADD PACKAGE FORM
------------------------- */

addPackageBtn.addEventListener("click", function () {

    packageFormContainer.style.display = "block";

    packageForm.reset();

    document.getElementById(
        "package-active"
    ).checked = true;

    document.getElementById(
        "package-form-title"
    ).textContent = "Add New Package";

    packageForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Save Package";

    delete packageForm.dataset.editingId;

    packageFormMessage.textContent = "";

    packageFormContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


/* -------------------------
   CANCEL PACKAGE
------------------------- */

cancelPackageBtn.addEventListener("click", function () {

    packageFormContainer.style.display = "none";

    delete packageForm.dataset.editingId;
});


/* -------------------------
   EDIT PACKAGE
------------------------- */

async function editPackage(id) {

    const { data, error } =
        await supabaseClient
            .from("packages")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        console.error(
            "Error loading package:",
            error
        );

        alert("Could not load package.");

        return;
    }

    packageFormContainer.style.display = "block";

    document.getElementById("package-title").value =
        data.title || "";

    document.getElementById("package-destination").value =
        data.destination || "";

    document.getElementById("package-description").value =
        data.description || "";

    document.getElementById("package-price").value =
        data.price || "";

    document.getElementById("package-duration").value =
        data.duration || "";

    document.getElementById("package-image").value =
        data.image_url || "";

    document.getElementById("package-route").value =
        data.route || "";

    document.getElementById("package-highlights").value =
        data.highlights || "";

    document.getElementById("package-departure").value =
        data.departure || "";

    document.getElementById("package-inclusions").value =
        data.inclusions || "";

    document.getElementById("package-exclusions").value =
        data.exclusions || "";

    document.getElementById("package-active").checked =
        data.is_active;

    packageForm.dataset.editingId = id;

    document.getElementById(
        "package-form-title"
    ).textContent = "Edit Package";

    packageForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Save Changes";

    packageFormMessage.textContent =
        "Editing package...";

    packageFormContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* -------------------------
   ADD / EDIT PACKAGE
------------------------- */

packageForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    packageFormMessage.textContent =
        "Saving package...";

    const title =
        document.getElementById("package-title").value.trim();

    const destination =
        document.getElementById("package-destination").value.trim();

    const description =
        document.getElementById("package-description").value.trim();

    const price =
        Number(document.getElementById("package-price").value);

    const duration =
        document.getElementById("package-duration").value.trim();

    const image_url =
        document.getElementById("package-image").value.trim();

    const route =
        document.getElementById("package-route").value.trim();

    const highlights =
        document.getElementById("package-highlights").value.trim();

    const departure =
        document.getElementById("package-departure").value.trim();

    const inclusions =
        document.getElementById("package-inclusions").value.trim();

    const exclusions =
        document.getElementById("package-exclusions").value.trim();

    const is_active =
        document.getElementById("package-active").checked;

    const editingId =
        packageForm.dataset.editingId || null;


    /* Get session */

    const {
        data: { session },
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {

        console.error(
            "Session error:",
            sessionError
        );

        packageFormMessage.textContent =
            "You must be logged in.";

        return;
    }


    const functionName =
        editingId
            ? "update-package"
            : "add-package";


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/${functionName}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        id: editingId,

                        title,
                        destination,
                        description,
                        price,
                        duration,
                        image_url,
                        route,
                        highlights,
                        departure,
                        inclusions,
                        exclusions,
                        is_active

                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Package save error:",
                result
            );

            packageFormMessage.textContent =
                result.error ||
                "Could not save package.";

            return;
        }


        packageFormMessage.textContent =
            editingId
                ? "Package updated successfully!"
                : "Package added successfully!";


        delete packageForm.dataset.editingId;

        packageForm.reset();

        document.getElementById(
            "package-active"
        ).checked = true;

        document.getElementById(
            "package-form-title"
        ).textContent = "Add New Package";

        packageForm.querySelector(
            'button[type="submit"]'
        ).textContent = "Save Package";


        await loadPackages();


        setTimeout(function () {

            packageFormContainer.style.display =
                "none";

            packageFormMessage.textContent = "";

        }, 1000);


    } catch (error) {

        console.error(
            "Package request failed:",
            error
        );

        packageFormMessage.textContent =
            "Something went wrong.";

    }
});


/* =========================================================
   FEATURED TRIPS
   ========================================================= */

/* -------------------------
   OPEN FEATURED FORM
------------------------- */

addFeaturedTripBtn.addEventListener(
    "click",
    function () {

        featuredTripFormContainer.style.display =
            "block";

        featuredTripForm.reset();

        delete featuredTripForm.dataset.editingId;

        document.getElementById(
            "featured-active"
        ).checked = true;

        document.getElementById(
            "featured-order"
        ).value = 0;

        featuredFormMessage.textContent = "";

        featuredTripFormContainer
            .querySelector("h3")
            .textContent = "Add Featured Trip";

        featuredTripForm.querySelector(
            'button[type="submit"]'
        ).textContent = "Save Featured Trip";

        featuredTripFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);


/* -------------------------
   CANCEL FEATURED FORM
------------------------- */

cancelFeaturedBtn.addEventListener(
    "click",
    function () {

        featuredTripFormContainer.style.display =
            "none";

        delete featuredTripForm.dataset.editingId;
    }
);


/* -------------------------
   LOAD FEATURED TRIPS
------------------------- */

async function loadFeaturedTripsAdmin() {

    const list =
        document.getElementById(
            "featured-trips-list"
        );

    if (!list) return;

    list.innerHTML =
        "Loading featured trips...";


    const { data, error } =
        await supabaseClient
            .from("featured_trips")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Error loading featured trips:",
            error
        );

        list.innerHTML =
            "Could not load featured trips.";

        return;
    }


    if (!data || data.length === 0) {

        list.innerHTML =
            "No featured trips found.";

        return;
    }


    list.innerHTML = "";


    data.forEach(trip => {

        const card =
            document.createElement("div");

        card.className =
            "package-card";


        card.innerHTML = `

            <h3>${trip.title || ""}</h3>

            <p>${trip.destination || ""}</p>

            <p>${trip.duration || ""}</p>

            <strong>
                ₹${Number(
                    trip.price || 0
                ).toLocaleString("en-IN")}
            </strong>

            <p>
                ${
                    trip.is_active
                        ? "🟢 Currently Featured"
                        : "⚪ Previous / Inactive"
                }
            </p>

            <div class="featured-admin-actions">

                ${
                    trip.is_active
                        ? `<span>🟢 Currently Featured</span>`
                        : `
                            <button
                                type="button"
                                class="make-featured-btn"
                                data-id="${trip.id}">
                                ⭐ Make Featured
                            </button>
                        `
                }

                <button
                    type="button"
                    class="edit-featured-btn"
                    data-id="${trip.id}">
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="delete-featured-btn"
                    data-id="${trip.id}">
                    🗑️ Delete
                </button>

            </div>
        `;

        list.appendChild(card);
    });
}


/* -------------------------
   EDIT FEATURED TRIP
------------------------- */

async function editFeaturedTrip(id) {

    const { data, error } =
        await supabaseClient
            .from("featured_trips")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(
            "Error loading featured trip:",
            error
        );

        alert(
            "Could not load featured trip."
        );

        return;
    }


    featuredTripFormContainer.style.display =
        "block";


    document.getElementById("featured-title").value =
        data.title || "";

    document.getElementById("featured-destination").value =
        data.destination || "";

    document.getElementById("featured-description").value =
        data.description || "";

    document.getElementById("featured-price").value =
        data.price || "";

    document.getElementById("featured-duration").value =
        data.duration || "";

    document.getElementById("featured-image").value =
        data.image_url || "";

    document.getElementById("featured-route").value =
        data.route || "";

    document.getElementById("featured-highlights").value =
        data.highlights || "";

    document.getElementById("featured-departure").value =
        data.departure || "";

    document.getElementById("featured-inclusions").value =
        data.inclusions || "";

    document.getElementById("featured-exclusions").value =
        data.exclusions || "";

    document.getElementById("featured-order").value =
        data.display_order || 0;

    document.getElementById("featured-active").checked =
        data.is_active;


    featuredTripForm.dataset.editingId =
        id;


    featuredTripFormContainer
        .querySelector("h3")
        .textContent = "Edit Featured Trip";


    featuredTripForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Save Changes";


    featuredFormMessage.textContent =
        "Editing featured trip...";


    featuredTripFormContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* -------------------------
   ADD / EDIT FEATURED TRIP
------------------------- */

featuredTripForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        featuredFormMessage.textContent =
            "Saving featured trip...";


        const title =
            document.getElementById(
                "featured-title"
            ).value.trim();

        const destination =
            document.getElementById(
                "featured-destination"
            ).value.trim();

        const description =
            document.getElementById(
                "featured-description"
            ).value.trim();

        const price =
            Number(
                document.getElementById(
                    "featured-price"
                ).value
            );

        const duration =
            document.getElementById(
                "featured-duration"
            ).value.trim();

        const image_url =
            document.getElementById(
                "featured-image"
            ).value.trim();

        const route =
            document.getElementById(
                "featured-route"
            ).value.trim();

        const highlights =
            document.getElementById(
                "featured-highlights"
            ).value.trim();

        const departure =
            document.getElementById(
                "featured-departure"
            ).value.trim();

        const inclusions =
            document.getElementById(
                "featured-inclusions"
            ).value.trim();

        const exclusions =
            document.getElementById(
                "featured-exclusions"
            ).value.trim();

        const display_order =
            Number(
                document.getElementById(
                    "featured-order"
                ).value
            ) || 0;

        const is_active =
            document.getElementById(
                "featured-active"
            ).checked;


        const editingId =
            featuredTripForm.dataset.editingId ||
            null;


        const {
            data: { session },
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError || !session) {

            featuredFormMessage.textContent =
                "You must be logged in.";

            return;
        }


        const functionName =
            editingId
                ? "update-featured-trip"
                : "add-featured-trip";


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/functions/v1/${functionName}`,
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${session.access_token}`,

                            "apikey":
                                SUPABASE_KEY,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            id: editingId,

                            title,
                            destination,
                            description,
                            price,
                            duration,
                            image_url,
                            route,
                            highlights,
                            departure,
                            inclusions,
                            exclusions,
                            is_active,
                            display_order

                        })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Featured trip save error:",
                    result
                );

                featuredFormMessage.textContent =
                    result.error ||
                    "Could not save featured trip.";

                return;
            }


            featuredFormMessage.textContent =
                editingId
                    ? "Featured trip updated successfully!"
                    : "Featured trip added successfully!";


            delete featuredTripForm.dataset.editingId;

            featuredTripForm.reset();

            document.getElementById(
                "featured-active"
            ).checked = true;

            document.getElementById(
                "featured-order"
            ).value = 0;


            featuredTripFormContainer
                .querySelector("h3")
                .textContent = "Add Featured Trip";


            featuredTripForm.querySelector(
                'button[type="submit"]'
            ).textContent = "Save Featured Trip";


            await loadFeaturedTripsAdmin();


            setTimeout(function () {

                featuredTripFormContainer.style.display =
                    "none";

                featuredFormMessage.textContent =
                    "";

            }, 1000);


        } catch (error) {

            console.error(
                "Featured trip request failed:",
                error
            );

            featuredFormMessage.textContent =
                "Something went wrong.";

        }
    }
);


/* =========================================================
   BROCHURES
   ========================================================= */

/* -------------------------
   OPEN BROCHURE FORM
------------------------- */

addBrochureBtn.addEventListener(
    "click",
    function () {

        editingBrochureId = null;
        editingBrochureFileUrl = null;

        brochureFormContainer.style.display =
            "block";

        brochureForm.reset();

        document.getElementById(
            "brochure-active"
        ).checked = true;

        brochureFormContainer
            .querySelector("h3")
            .textContent = "Add Brochure";

        brochureForm.querySelector(
            'button[type="submit"]'
        ).textContent = "Upload Brochure";

        brochureFormMessage.textContent = "";

        brochureFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);


/* -------------------------
   CANCEL BROCHURE FORM
------------------------- */

cancelBrochureBtn.addEventListener(
    "click",
    function () {

        brochureFormContainer.style.display =
            "none";

        editingBrochureId = null;
        editingBrochureFileUrl = null;
    }
);


/* -------------------------
   LOAD BROCHURES
------------------------- */

async function loadBrochures() {

    const list =
        document.getElementById(
            "brochures-list"
        );

    if (!list) return;

    list.innerHTML =
        "Loading brochures...";


    const { data, error } =
        await supabaseClient
            .from("brochures")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Error loading brochures:",
            error
        );

        list.innerHTML =
            "Could not load brochures.";

        return;
    }


    if (!data || data.length === 0) {

        list.innerHTML =
            "No brochures found.";

        return;
    }


    list.innerHTML = "";


    data.forEach(brochure => {

        const card =
            document.createElement("div");

        card.className =
            "package-card";


        card.innerHTML = `

            <h3>
                ${brochure.title || ""}
            </h3>

            <p>
                ${
                    brochure.is_active
                        ? "🟢 Active"
                        : "⚪ Inactive"
                }
            </p>

            <div class="brochure-admin-actions">

                <a
                    href="${brochure.file_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="brochure-btn">
                    📄 View Brochure
                </a>

                <button
                    type="button"
                    class="edit-brochure-btn"
                    data-id="${brochure.id}">
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="delete-brochure-btn"
                    data-id="${brochure.id}"
                    data-file-url="${brochure.file_url}">
                    🗑️ Delete
                </button>

            </div>
        `;

        list.appendChild(card);
    });
}


/* -------------------------
   EDIT BROCHURE
------------------------- */

async function editBrochure(id) {

    const { data, error } =
        await supabaseClient
            .from("brochures")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(
            "Error loading brochure:",
            error
        );

        alert(
            "Could not load brochure."
        );

        return;
    }


    editingBrochureId =
        data.id;

    editingBrochureFileUrl =
        data.file_url;


    brochureFormContainer.style.display =
        "block";


    brochureFormContainer
        .querySelector("h3")
        .textContent = "Edit Brochure";


    document.getElementById(
        "brochure-title"
    ).value =
        data.title || "";


    document.getElementById(
        "brochure-image"
    ).value =
        data.image_url || "";


    document.getElementById(
        "brochure-active"
    ).checked =
        data.is_active;


    document.getElementById(
        "brochure-file"
    ).value = "";


    brochureFormMessage.textContent =
        "Editing brochure. Select a new PDF only if you want to replace it.";


    brochureForm.querySelector(
        'button[type="submit"]'
    ).textContent =
        "Update Brochure";


    brochureFormContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* -------------------------
   ADD / EDIT BROCHURE
------------------------- */

brochureForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "brochure-title"
            ).value.trim();


        const image_url =
            document.getElementById(
                "brochure-image"
            ).value.trim();


        const file =
            document.getElementById(
                "brochure-file"
            ).files[0];


        const is_active =
            document.getElementById(
                "brochure-active"
            ).checked;


        const {
            data: { session },
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError || !session) {

            brochureFormMessage.textContent =
                "You must be logged in.";

            return;
        }


        try {

            /* =================================================
               EDIT EXISTING BROCHURE
               ================================================= */

            if (editingBrochureId) {

                brochureFormMessage.textContent =
                    "Updating brochure...";


                let file_url =
                    editingBrochureFileUrl;


                /* Replace PDF if a new file was selected */

                if (file) {

                    if (
                        file.type !==
                        "application/pdf"
                    ) {

                        brochureFormMessage.textContent =
                            "Please select a PDF file.";

                        return;
                    }


                    const newFileName =
                        `${Date.now()}-${file.name}`;


                    const {
                        error: uploadError
                    } =
                        await supabaseClient.storage
                            .from("brochures")
                            .upload(
                                newFileName,
                                file
                            );


                    if (uploadError) {

                        console.error(
                            "New brochure upload error:",
                            uploadError
                        );

                        brochureFormMessage.textContent =
                            "Could not upload new brochure.";

                        return;
                    }


                    const {
                        data: publicUrlData
                    } =
                        supabaseClient.storage
                            .from("brochures")
                            .getPublicUrl(
                                newFileName
                            );


                    file_url =
                        publicUrlData.publicUrl;


                    /* Delete old PDF */

                    try {

                        const oldUrl =
                            new URL(
                                editingBrochureFileUrl
                            );


                        const oldPath =
                            decodeURIComponent(
                                oldUrl.pathname.split(
                                    "/object/public/brochures/"
                                )[1]
                            );


                        if (oldPath) {

                            const {
                                error: oldFileError
                            } =
                                await supabaseClient.storage
                                    .from("brochures")
                                    .remove([
                                        oldPath
                                    ]);


                            if (oldFileError) {

                                console.warn(
                                    "Could not delete old PDF:",
                                    oldFileError
                                );
                            }
                        }

                    } catch (error) {

                        console.warn(
                            "Could not determine old PDF path:",
                            error
                        );
                    }
                }


                /* Update database */

                const {
                    error: updateError
                } =
                    await supabaseClient
                        .from("brochures")
                        .update({
                            title,
                            image_url,
                            file_url,
                            is_active
                        })
                        .eq(
                            "id",
                            editingBrochureId
                        );


                if (updateError) {

                    console.error(
                        "Brochure update error:",
                        updateError
                    );

                    brochureFormMessage.textContent =
                        "Could not update brochure.";

                    return;
                }


                brochureFormMessage.textContent =
                    "Brochure updated successfully!";


                resetBrochureForm();

                await loadBrochures();


                setTimeout(function () {

                    brochureFormContainer.style.display =
                        "none";

                    brochureFormMessage.textContent =
                        "";

                }, 1000);


                return;
            }


            /* =================================================
               ADD NEW BROCHURE
               ================================================= */

            brochureFormMessage.textContent =
                "Uploading brochure...";


            if (!file) {

                brochureFormMessage.textContent =
                    "Please select a PDF.";

                return;
            }


            if (
                file.type !==
                "application/pdf"
            ) {

                brochureFormMessage.textContent =
                    "Please select a PDF file.";

                return;
            }


            const fileName =
                `${Date.now()}-${file.name}`;


            const {
                error: uploadError
            } =
                await supabaseClient.storage
                    .from("brochures")
                    .upload(
                        fileName,
                        file
                    );


            if (uploadError) {

                console.error(
                    "Brochure upload error:",
                    uploadError
                );

                brochureFormMessage.textContent =
                    "Could not upload brochure.";

                return;
            }


            const {
                data: publicUrlData
            } =
                supabaseClient.storage
                    .from("brochures")
                    .getPublicUrl(
                        fileName
                    );


            const file_url =
                publicUrlData.publicUrl;


            const {
                error: databaseError
            } =
                await supabaseClient
                    .from("brochures")
                    .insert([
                        {
                            title,
                            file_url,
                            image_url,
                            is_active
                        }
                    ]);


            if (databaseError) {

                console.error(
                    "Brochure database error:",
                    databaseError
                );

                brochureFormMessage.textContent =
                    "File uploaded, but brochure information could not be saved.";

                return;
            }


            brochureFormMessage.textContent =
                "Brochure uploaded successfully!";


            resetBrochureForm();

            await loadBrochures();


            setTimeout(function () {

                brochureFormContainer.style.display =
                    "none";

                brochureFormMessage.textContent =
                    "";

            }, 1000);


        } catch (error) {

            console.error(
                "Brochure operation failed:",
                error
            );

            brochureFormMessage.textContent =
                "Something went wrong. Please try again.";
        }
    }
);


/* -------------------------
   RESET BROCHURE FORM
------------------------- */

function resetBrochureForm() {

    editingBrochureId = null;
    editingBrochureFileUrl = null;

    brochureForm.reset();

    document.getElementById(
        "brochure-active"
    ).checked = true;


    brochureFormContainer
        .querySelector("h3")
        .textContent = "Add Brochure";


    brochureForm.querySelector(
        'button[type="submit"]'
    ).textContent =
        "Upload Brochure";
}


/* =========================================================
   PACKAGE / FEATURED / BROCHURE BUTTON HANDLER
   ========================================================= */

document.addEventListener(
    "click",
    async function (event) {

        /* =================================================
           EDIT PACKAGE
           ================================================= */

        const editPackageButton =
            event.target.closest(
                ".edit-package-btn"
            );

        if (editPackageButton) {

            await editPackage(
                editPackageButton.dataset.id
            );

            return;
        }


        /* =================================================
           DELETE PACKAGE
           ================================================= */

        const deletePackageButton =
            event.target.closest(
                ".delete-package-btn"
            );

        if (deletePackageButton) {

            await deletePackage(
                deletePackageButton.dataset.id,
                deletePackageButton
            );

            return;
        }


        /* =================================================
           TOGGLE PACKAGE
           ================================================= */

        const togglePackageButton =
            event.target.closest(
                ".toggle-package-btn"
            );

        if (togglePackageButton) {

            await togglePackage(
                togglePackageButton
            );

            return;
        }


        /* =================================================
           EDIT FEATURED TRIP
           ================================================= */

        const editFeaturedButton =
            event.target.closest(
                ".edit-featured-btn"
            );

        if (editFeaturedButton) {

            await editFeaturedTrip(
                editFeaturedButton.dataset.id
            );

            return;
        }


        /* =================================================
           MAKE FEATURED
           ================================================= */

        const makeFeaturedButton =
            event.target.closest(
                ".make-featured-btn"
            );

        if (makeFeaturedButton) {

            await makeFeaturedTrip(
                makeFeaturedButton.dataset.id
            );

            return;
        }


        /* =================================================
           DELETE FEATURED TRIP
           ================================================= */

        const deleteFeaturedButton =
            event.target.closest(
                ".delete-featured-btn"
            );

        if (deleteFeaturedButton) {

            await deleteFeaturedTrip(
                deleteFeaturedButton.dataset.id
            );

            return;
        }


        /* =================================================
           EDIT BROCHURE
           ================================================= */

        const editBrochureButton =
            event.target.closest(
                ".edit-brochure-btn"
            );

        if (editBrochureButton) {

            await editBrochure(
                editBrochureButton.dataset.id
            );

            return;
        }


        /* =================================================
           DELETE BROCHURE
           ================================================= */

        const deleteBrochureButton =
            event.target.closest(
                ".delete-brochure-btn"
            );

        if (deleteBrochureButton) {

            await deleteBrochure(
                deleteBrochureButton.dataset.id,
                deleteBrochureButton.dataset.fileUrl
            );

            return;
        }
    }
);


/* =========================================================
   DELETE PACKAGE
   ========================================================= */

async function deletePackage(id, button) {

    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this package?"
        );

    if (!confirmed) return;


    button.disabled = true;
    button.textContent = "Deleting...";


    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        alert("You must be logged in.");

        button.disabled = false;
        button.textContent = "🗑️ Delete";

        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/delete-package`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Delete package error:",
                result
            );

            alert(
                result.error ||
                "Could not delete package."
            );

            button.disabled = false;
            button.textContent = "🗑️ Delete";

            return;
        }


        alert(
            "Package deleted successfully!"
        );

        await loadPackages();


    } catch (error) {

        console.error(
            "Delete package failed:",
            error
        );

        alert(
            "Delete failed. Check the Console."
        );

        button.disabled = false;
        button.textContent = "🗑️ Delete";
    }
}


/* =========================================================
   TOGGLE PACKAGE
   ========================================================= */

async function togglePackage(button) {

    const id =
        button.dataset.id;

    const currentStatus =
        button.dataset.active === "true";

    const newStatus =
        !currentStatus;


    const confirmed =
        confirm(
            newStatus
                ? "Show this package on the website?"
                : "Hide this package from the website?"
        );


    if (!confirmed) return;


    button.disabled = true;
    button.textContent = "Saving...";


    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        alert("You must be logged in.");

        button.disabled = false;

        button.textContent =
            currentStatus
                ? "🟢 Active"
                : "⚪ Inactive";

        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/update-package`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id,
                        is_active: newStatus
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Package status update error:",
                result
            );

            alert(
                result.error ||
                "Could not change package status."
            );

            button.disabled = false;

            button.textContent =
                currentStatus
                    ? "🟢 Active"
                    : "⚪ Inactive";

            return;
        }


        await loadPackages();


    } catch (error) {

        console.error(
            "Toggle package failed:",
            error
        );

        alert(
            "Something went wrong while changing package status."
        );
    }
}


/* =========================================================
   MAKE FEATURED TRIP
   ========================================================= */

async function makeFeaturedTrip(id) {

    const confirmed =
        confirm(
            "Make this trip the current Featured Trip?"
        );


    if (!confirmed) return;


    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        alert("You must be logged in.");

        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/set-featured-trip`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Set featured trip error:",
                result
            );

            alert(
                result.error ||
                "Could not change featured trip."
            );

            return;
        }


        alert(
            "Featured trip changed successfully!"
        );


        await loadFeaturedTripsAdmin();


    } catch (error) {

        console.error(
            "Make featured request failed:",
            error
        );

        alert(
            "Something went wrong."
        );
    }
}


/* =========================================================
   DELETE FEATURED TRIP
   ========================================================= */

async function deleteFeaturedTrip(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this Featured Trip?"
        );


    if (!confirmed) return;


    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        alert("You must be logged in.");

        return;
    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/delete-featured-trip`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${session.access_token}`,

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Delete featured trip error:",
                result
            );

            alert(
                result.error ||
                "Could not delete featured trip."
            );

            return;
        }


        alert(
            "Featured trip deleted successfully!"
        );


        await loadFeaturedTripsAdmin();


    } catch (error) {

        console.error(
            "Delete featured trip failed:",
            error
        );

        alert(
            "Something went wrong while deleting the trip."
        );
    }
}


/* =========================================================
   DELETE BROCHURE
   ========================================================= */

async function deleteBrochure(id, fileUrl) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this brochure?"
        );


    if (!confirmed) return;


    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        alert("You must be logged in.");

        return;
    }


    try {

        /* ---------------------------------------------
           Find storage path
        --------------------------------------------- */

        const url =
            new URL(fileUrl);


        const pathPart =
            url.pathname.split(
                "/object/public/brochures/"
            )[1];


        const path =
            pathPart
                ? decodeURIComponent(pathPart)
                : null;


        if (!path) {

            console.error(
                "Could not determine file path:",
                fileUrl
            );

            alert(
                "Could not determine brochure file."
            );

            return;
        }


        /* ---------------------------------------------
           Delete PDF
        --------------------------------------------- */

        const {
            error: storageError
        } =
            await supabaseClient.storage
                .from("brochures")
                .remove([path]);


        if (storageError) {

            console.error(
                "Storage delete error:",
                storageError
            );

            alert(
                "Could not delete brochure file."
            );

            return;
        }


        /* ---------------------------------------------
           Delete database record
        --------------------------------------------- */

        const {
            error: databaseError
        } =
            await supabaseClient
                .from("brochures")
                .delete()
                .eq("id", id);


        if (databaseError) {

            console.error(
                "Database delete error:",
                databaseError
            );

            alert(
                "File deleted, but database record could not be deleted."
            );

            return;
        }


        alert(
            "Brochure deleted successfully!"
        );


        await loadBrochures();


    } catch (error) {

        console.error(
            "Delete brochure failed:",
            error
        );

        alert(
            "Something went wrong while deleting the brochure."
        );
    }
}

/* =========================================================
   MALAYALAM SECTION
   ========================================================= */

const malayalamForm =
    document.getElementById("malayalam-form");

const malayalamFormMessage =
    document.getElementById("malayalam-form-message");


/* -------------------------
   LOAD MALAYALAM SECTION
------------------------- */

async function loadMalayalamSection() {

    if (!malayalamForm) return;

    const {
        data,
        error
    } = await supabaseClient
        .from("malayalam_section")
        .select("*")
        .limit(1)
        .maybeSingle();


    if (error) {

        console.error(
            "Error loading Malayalam section:",
            error
        );

        malayalamFormMessage.textContent =
            "Could not load Malayalam section.";

        return;
    }


    if (!data) {

        malayalamFormMessage.textContent =
            "No Malayalam section found.";

        return;
    }


    document.getElementById(
        "malayalam-eyebrow"
    ).value =
        data.eyebrow || "";


    document.getElementById(
        "malayalam-main"
    ).value =
        data.main_text || "";


    document.getElementById(
        "malayalam-sub"
    ).value =
        data.sub_text || "";


    document.getElementById(
        "malayalam-button-text"
    ).value =
        data.button_text || "";


    document.getElementById(
        "malayalam-button-link"
    ).value =
        data.button_link || "#enquiry";


    document.getElementById(
        "malayalam-active"
    ).checked =
        data.is_active;


    malayalamForm.dataset.id =
        data.id;
}


/* -------------------------
   SAVE MALAYALAM SECTION
------------------------- */

malayalamForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        malayalamFormMessage.textContent =
            "Saving changes...";


        const id =
            malayalamForm.dataset.id;


        const eyebrow =
            document.getElementById(
                "malayalam-eyebrow"
            ).value.trim();


        const main_text =
            document.getElementById(
                "malayalam-main"
            ).value.trim();


        const sub_text =
            document.getElementById(
                "malayalam-sub"
            ).value.trim();


        const button_text =
            document.getElementById(
                "malayalam-button-text"
            ).value.trim();


        const button_link =
            document.getElementById(
                "malayalam-button-link"
            ).value.trim();


        const is_active =
            document.getElementById(
                "malayalam-active"
            ).checked;


        const {
            data: { session },
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (sessionError || !session) {

            malayalamFormMessage.textContent =
                "You must be logged in.";

            return;
        }


        if (!id) {

            malayalamFormMessage.textContent =
                "Malayalam section record not found.";

            return;
        }


        const {
            error
        } =
            await supabaseClient
                .from("malayalam_section")
                .update({

                    eyebrow,
                    main_text,
                    sub_text,
                    button_text,
                    button_link,
                    is_active,
                    updated_at: new Date().toISOString()

                })
                .eq("id", id);


        if (error) {

            console.error(
                "Malayalam section update error:",
                error
            );

            malayalamFormMessage.textContent =
                "Could not save changes.";

            return;
        }


        malayalamFormMessage.textContent =
            "Malayalam section updated successfully!";


        setTimeout(function () {

            malayalamFormMessage.textContent = "";

        }, 2500);

    }
);

/* =========================================================
   START ADMIN
   ========================================================= */

checkLogin();


/* ============================================================
   COLLEGE TRIPS — ADMIN
============================================================ */

let editingCollegeTripId = null;


/* ============================================================
   LOAD COLLEGE TRIPS
============================================================ */

async function loadCollegeTrips() {

    const grid =
        document.getElementById('collegeTripsAdminGrid');

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
                .order('display_order', {
                    ascending: true
                })
                .order('created_at', {
                    ascending: false
                });


        if (error) {

            console.error(
                'College trips load error:',
                error
            );

            grid.innerHTML = `
                <p class="data-error">
                    Unable to load college trips.
                </p>
            `;

            return;
        }


        if (!data || data.length === 0) {

            grid.innerHTML = `
                <p class="data-empty">
                    No college trips added yet.
                </p>
            `;

            return;
        }


        grid.innerHTML = '';


        data.forEach(trip => {

            const card =
                document.createElement('article');

            card.className =
                'package-admin-card';


            card.innerHTML = `

                <div class="package-admin-image"
                    style="
                        background-image:
                        url('${trip.image_url || ''}');
                    ">
                </div>


                <div class="package-admin-content">

                    <div class="package-admin-top">

                        <h3>
                            ${trip.title || ''}
                        </h3>

                        <span class="
                            ${trip.is_active
                                ? 'status-active'
                                : 'status-inactive'}
                        ">
                            ${trip.is_active
                                ? 'Active'
                                : 'Hidden'}
                        </span>

                    </div>


                    <p class="package-admin-destination">
                        ${trip.destination || ''}
                    </p>


                    <p class="package-admin-description">
                        ${trip.description || ''}
                    </p>


                    <div class="package-admin-meta">

                        <span>
                            ${trip.duration || ''}
                        </span>

                        <strong>
                            ${trip.price
                                ? `₹${Number(
                                    trip.price
                                ).toLocaleString('en-IN')}`
                                : 'Price on request'}
                        </strong>

                    </div>


                    <div class="package-admin-actions">

                        <button
                            type="button"
                            class="edit-package-btn"
                            data-edit-college-trip="${trip.id}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-college-trip-btn"
                            data-delete-college-trip="${trip.id}">
                            Delete
                        </button>

                    </div>

                </div>
            `;


            grid.appendChild(card);

        });


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
   RESET COLLEGE TRIP FORM
============================================================ */

function resetCollegeTripForm() {

    const form =
        document.getElementById('collegeTripForm');

    const container =
        document.getElementById(
            'collegeTripFormContainer'
        );

    const title =
        document.getElementById(
            'collegeTripFormTitle'
        );

    if (form) {
        form.reset();
    }

    const order =
        document.getElementById(
            'college-trip-order'
        );

    const active =
        document.getElementById(
            'college-trip-active'
        );

    if (order) {
        order.value = 0;
    }

    if (active) {
        active.checked = true;
    }

    if (title) {
        title.textContent =
            'Add College Trip';
    }

    editingCollegeTripId = null;

    if (container) {
        container.hidden = true;
    }
}


/* ============================================================
   EDIT COLLEGE TRIP
============================================================ */

async function editCollegeTrip(id) {

    try {

        const { data, error } =
            await supabaseClient
                .from('college_trips')
                .select('*')
                .eq('id', id)
                .single();


        if (error) {

            console.error(
                'College trip edit error:',
                error
            );

            alert(
                'Unable to load this college trip.'
            );

            return;
        }


        editingCollegeTripId =
            id;


        document.getElementById(
            'college-trip-title'
        ).value =
            data.title || '';


        document.getElementById(
            'college-trip-destination'
        ).value =
            data.destination || '';


        document.getElementById(
            'college-trip-description'
        ).value =
            data.description || '';


        document.getElementById(
            'college-trip-price'
        ).value =
            data.price || '';


        document.getElementById(
            'college-trip-duration'
        ).value =
            data.duration || '';


        document.getElementById(
            'college-trip-image'
        ).value =
            data.image_url || '';


        document.getElementById(
            'college-trip-order'
        ).value =
            data.display_order || 0;


        document.getElementById(
            'college-trip-active'
        ).checked =
            data.is_active;


        document.getElementById(
            'collegeTripFormTitle'
        ).textContent =
            'Edit College Trip';


        document.getElementById(
            'collegeTripFormContainer'
        ).hidden =
            false;


        document.getElementById(
            'collegeTripFormContainer'
        ).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });


    } catch (err) {

        console.error(
            'Unexpected edit error:',
            err
        );

    }
}


/* ============================================================
   DELETE COLLEGE TRIP
============================================================ */

async function deleteCollegeTrip(id) {

    const confirmed =
        confirm(
            'Are you sure you want to delete this college trip?'
        );

    if (!confirmed) return;


    try {

        const { error } =
            await supabaseClient
                .from('college_trips')
                .delete()
                .eq('id', id);


        if (error) {

            console.error(
                'College trip delete error:',
                error
            );

            alert(
                'Unable to delete the college trip.'
            );

            return;
        }


        await loadCollegeTrips();


    } catch (err) {

        console.error(
            'Unexpected delete error:',
            err
        );

        alert(
            'Something went wrong while deleting.'
        );
    }
}


/* ============================================================
   COLLEGE TRIP FORM
============================================================ */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        const addButton =
            document.getElementById(
                'addCollegeTripBtn'
            );

        const cancelButton =
            document.getElementById(
                'cancelCollegeTripBtn'
            );

        const form =
            document.getElementById(
                'collegeTripForm'
            );


        /* ---------- ADD BUTTON ---------- */

        if (addButton) {

            addButton.addEventListener(
                'click',
                function () {

                    resetCollegeTripForm();

                    document.getElementById(
                        'collegeTripFormContainer'
                    ).hidden = false;

                }
            );
        }


        /* ---------- CANCEL ---------- */

        if (cancelButton) {

            cancelButton.addEventListener(
                'click',
                resetCollegeTripForm
            );
        }


        /* ---------- SAVE ---------- */

        if (form) {

            form.addEventListener(
                'submit',
                async function (e) {

                    e.preventDefault();


                    const message =
                        document.getElementById(
                            'collegeTripFormMessage'
                        );


                    const tripData = {

                        title:
                            document.getElementById(
                                'college-trip-title'
                            ).value.trim(),

                        destination:
                            document.getElementById(
                                'college-trip-destination'
                            ).value.trim(),

                        description:
                            document.getElementById(
                                'college-trip-description'
                            ).value.trim(),

                        price:
                            Number(
                                document.getElementById(
                                    'college-trip-price'
                                ).value
                            ) || null,

                        duration:
                            document.getElementById(
                                'college-trip-duration'
                            ).value.trim(),

                        image_url:
                            document.getElementById(
                                'college-trip-image'
                            ).value.trim(),

                        display_order:
                            Number(
                                document.getElementById(
                                    'college-trip-order'
                                ).value
                            ) || 0,

                        is_active:
                            document.getElementById(
                                'college-trip-active'
                            ).checked,

                        updated_at:
                            new Date().toISOString()
                    };


                    if (
                        !tripData.title ||
                        !tripData.destination ||
                        !tripData.description ||
                        !tripData.duration ||
                        !tripData.image_url
                    ) {

                        if (message) {

                            message.textContent =
                                'Please fill in all required fields.';

                            message.className =
                                'form-error';
                        }

                        return;
                    }


                    try {

                        let error;


                        /* ---------- UPDATE ---------- */

                        if (
                            editingCollegeTripId
                        ) {

                            const result =
                                await supabaseClient
                                    .from('college_trips')
                                    .update(
                                        tripData
                                    )
                                    .eq(
                                        'id',
                                        editingCollegeTripId
                                    );

                            error =
                                result.error;

                        }


                        /* ---------- INSERT ---------- */

                        else {

                            const result =
                                await supabaseClient
                                    .from('college_trips')
                                    .insert([
                                        tripData
                                    ]);

                            error =
                                result.error;
                        }


                        if (error) {

                            console.error(
                                'College trip save error:',
                                error
                            );

                            if (message) {

                                message.textContent =
                                    error.message ||
                                    'Unable to save college trip.';

                                message.className =
                                    'form-error';
                            }

                            return;
                        }


                        if (message) {

                            message.textContent =
                                editingCollegeTripId
                                    ? 'College trip updated successfully!'
                                    : 'College trip added successfully!';

                            message.className =
                                'form-success';
                        }


                        await loadCollegeTrips();


                        setTimeout(
                            function () {

                                resetCollegeTripForm();

                            },
                            800
                        );


                    } catch (err) {

                        console.error(
                            'Unexpected save error:',
                            err
                        );

                        if (message) {

                            message.textContent =
                                'Something went wrong.';

                            message.className =
                                'form-error';
                        }

                    }

                }
            );
        }


        /* ---------- EDIT / DELETE ---------- */

        document.addEventListener(
            'click',
            function (e) {

                const editButton =
                    e.target.closest(
                        '[data-edit-college-trip]'
                    );

                if (editButton) {

                    editCollegeTrip(
                        editButton.dataset
                            .editCollegeTrip
                    );

                    return;
                }


                const deleteButton = e.target.closest(
    '[data-delete-college-trip]'
);

if (deleteButton) {

    const tripId =
        deleteButton.getAttribute(
            'data-delete-college-trip'
        );

    console.log(
        'Deleting college trip ID:',
        tripId
    );

    if (!tripId) {
        alert('College trip ID is missing.');
        return;
    }

    deleteCollegeTrip(tripId);

    return;
}
            }
        );


        /* ---------- INITIAL LOAD ---------- */

        loadCollegeTrips();

    }
);


/* ============================================================
   TREKS — ADMIN
============================================================ */

let editingTrekId = null;


/* ============================================================
   LOAD TREKS
============================================================ */

async function loadTreks() {

    const grid =
        document.getElementById("treksAdminGrid");

    if (!grid) return;

    grid.innerHTML = `
        <p class="data-loading">
            Loading treks...
        </p>
    `;

    try {

        const { data, error } =
            await supabaseClient
                .from("treks")
                .select("*")
                .order("display_order", {
                    ascending: true
                })
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Treks load error:",
                error
            );

            grid.innerHTML = `
                <p class="data-error">
                    Unable to load treks.
                </p>
            `;

            return;
        }


        if (!data || data.length === 0) {

            grid.innerHTML = `
                <p class="data-empty">
                    No treks added yet.
                </p>
            `;

            return;
        }


        grid.innerHTML = "";


        data.forEach(trek => {

            const card =
                document.createElement("article");

            card.className =
                "package-admin-card";


            card.innerHTML = `

                <div
                    class="package-admin-image"
                    style="
                        background-image:
                        url('${trek.image_url || ""}');
                    ">
                </div>


                <div class="package-admin-content">

                    <div class="package-admin-top">

                        <h3>
                            ${trek.title || ""}
                        </h3>

                        <span class="
                            ${
                                trek.is_active
                                    ? "status-active"
                                    : "status-inactive"
                            }
                        ">
                            ${
                                trek.is_active
                                    ? "Active"
                                    : "Hidden"
                            }
                        </span>

                    </div>


                    <p class="package-admin-destination">
                        ${trek.destination || ""}
                    </p>


                    <p>
                        Display order:
                        ${trek.display_order ?? 0}
                    </p>


                    <div class="package-admin-actions">

                        <button
                            type="button"
                            class="edit-trek-btn"
                            data-edit-trek="${trek.id}">
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="delete-trek-btn"
                            data-delete-trek="${trek.id}">
                            🗑️ Delete
                        </button>

                    </div>

                </div>
            `;


            grid.appendChild(card);

        });


    } catch (err) {

        console.error(
            "Unexpected treks error:",
            err
        );

        grid.innerHTML = `
            <p class="data-error">
                Something went wrong while loading treks.
            </p>
        `;
    }
}


/* ============================================================
   RESET TREK FORM
============================================================ */

function resetTrekForm() {

    const form =
        document.getElementById("trekForm");

    const container =
        document.getElementById(
            "trekFormContainer"
        );

    const title =
        document.getElementById(
            "trekFormTitle"
        );


    if (form) {
        form.reset();
    }


    const order =
        document.getElementById(
            "trek-order"
        );

    const active =
        document.getElementById(
            "trek-active"
        );


    if (order) {
        order.value = 0;
    }


    if (active) {
        active.checked = true;
    }


    if (title) {
        title.textContent =
            "Add New Trek";
    }


    editingTrekId = null;


    if (container) {
        container.hidden = true;
    }
}


/* ============================================================
   EDIT TREK
============================================================ */

async function editTrek(id) {

    try {

        const { data, error } =
            await supabaseClient
                .from("treks")
                .select("*")
                .eq("id", id)
                .single();


        if (error) {

            console.error(
                "Trek edit error:",
                error
            );

            alert(
                "Unable to load this trek."
            );

            return;
        }


        editingTrekId =
            id;


        document.getElementById(
            "trek-title"
        ).value =
            data.title || "";


        document.getElementById(
            "trek-destination"
        ).value =
            data.destination || "";


        document.getElementById(
            "trek-image"
        ).value =
            data.image_url || "";


        document.getElementById(
            "trek-order"
        ).value =
            data.display_order || 0;


        document.getElementById(
            "trek-active"
        ).checked =
            data.is_active;


        document.getElementById(
            "trekFormTitle"
        ).textContent =
            "Edit Trek";


        document.getElementById(
            "trekFormContainer"
        ).hidden =
            false;


        document.getElementById(
            "trekFormContainer"
        ).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (err) {

        console.error(
            "Unexpected trek edit error:",
            err
        );

    }
}


/* ============================================================
   DELETE TREK
============================================================ */

async function deleteTrek(id) {

    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this trek?"
        );


    if (!confirmed) return;


    try {

        const { error } =
            await supabaseClient
                .from("treks")
                .delete()
                .eq("id", id);


        if (error) {

            console.error(
                "Trek delete error:",
                error
            );

            alert(
                error.message ||
                "Unable to delete the trek."
            );

            return;
        }


        alert(
            "Trek deleted successfully!"
        );


        await loadTreks();


    } catch (err) {

        console.error(
            "Unexpected trek delete error:",
            err
        );

        alert(
            "Something went wrong while deleting the trek."
        );
    }
}


/* ============================================================
   TREK FORM
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const addButton =
            document.getElementById(
                "addTrekBtn"
            );


        const cancelButton =
            document.getElementById(
                "cancelTrekBtn"
            );


        const form =
            document.getElementById(
                "trekForm"
            );


        /* ====================================================
           ADD TREK
        ==================================================== */

        if (addButton) {

            addButton.addEventListener(
                "click",
                function () {

                    resetTrekForm();


                    const container =
                        document.getElementById(
                            "trekFormContainer"
                        );


                    if (container) {
                        container.hidden = false;
                    }

                }
            );
        }


        /* ====================================================
           CANCEL
        ==================================================== */

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                resetTrekForm
            );
        }


        /* ====================================================
           SAVE TREK
        ==================================================== */

        if (form) {

            form.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    const message =
                        document.getElementById(
                            "trekFormMessage"
                        );


                    const trekData = {

                        title:
                            document.getElementById(
                                "trek-title"
                            ).value.trim(),


                        destination:
                            document.getElementById(
                                "trek-destination"
                            ).value.trim(),


                        image_url:
                            document.getElementById(
                                "trek-image"
                            ).value.trim(),


                        display_order:
                            Number(
                                document.getElementById(
                                    "trek-order"
                                ).value
                            ) || 0,


                        is_active:
                            document.getElementById(
                                "trek-active"
                            ).checked,


                        updated_at:
                            new Date().toISOString()

                    };


                    /* -----------------------------
                       VALIDATION
                    ----------------------------- */

                    if (
                        !trekData.title ||
                        !trekData.destination ||
                        !trekData.image_url
                    ) {

                        if (message) {

                            message.textContent =
                                "Please fill in all required fields.";

                            message.className =
                                "form-error";
                        }

                        return;
                    }


                    try {

                        let error;


                        /* -----------------------------
                           UPDATE
                        ----------------------------- */

                        if (editingTrekId) {

                            const result =
                                await supabaseClient
                                    .from("treks")
                                    .update(
                                        trekData
                                    )
                                    .eq(
                                        "id",
                                        editingTrekId
                                    );


                            error =
                                result.error;
                        }


                        /* -----------------------------
                           INSERT
                        ----------------------------- */

                        else {

                            const result =
                                await supabaseClient
                                    .from("treks")
                                    .insert([
                                        trekData
                                    ]);


                            error =
                                result.error;
                        }


                        if (error) {

                            console.error(
                                "Trek save error:",
                                error
                            );

                            if (message) {

                                message.textContent =
                                    error.message ||
                                    "Unable to save trek.";

                                message.className =
                                    "form-error";
                            }

                            return;
                        }


                        if (message) {

                            message.textContent =
                                editingTrekId
                                    ? "Trek updated successfully!"
                                    : "Trek added successfully!";

                            message.className =
                                "form-success";
                        }


                        await loadTreks();


                        setTimeout(
                            function () {

                                resetTrekForm();

                            },
                            800
                        );


                    } catch (err) {

                        console.error(
                            "Unexpected trek save error:",
                            err
                        );


                        if (message) {

                            message.textContent =
                                "Something went wrong.";

                            message.className =
                                "form-error";
                        }
                    }

                }
            );
        }


        /* ====================================================
           EDIT / DELETE
        ==================================================== */

        document.addEventListener(
            "click",
            function (e) {

                /* EDIT */

                const editButton =
                    e.target.closest(
                        "[data-edit-trek]"
                    );


                if (editButton) {

                    editTrek(
                        editButton.dataset.editTrek
                    );

                    return;
                }


                /* DELETE */

                const deleteButton =
                    e.target.closest(
                        "[data-delete-trek]"
                    );


                if (deleteButton) {

                    const trekId =
                        deleteButton.getAttribute(
                            "data-delete-trek"
                        );


                    console.log(
                        "Deleting trek ID:",
                        trekId
                    );


                    if (!trekId) {

                        alert(
                            "Trek ID is missing."
                        );

                        return;
                    }


                    deleteTrek(
                        trekId
                    );

                    return;
                }

            }
        );


        /* ====================================================
           INITIAL LOAD
        ==================================================== */

        loadTreks();

    }
);