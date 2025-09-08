// ===============================
// SELECT IMPORTANT ELEMENTS
// ===============================

// Hamburger button (3 lines icon for mobile)
const hamburger = document.getElementById("hamburger");

// The <ul> menu list (all nav links)
const navLinks = document.getElementById("navLinks");

// A helper function to check if we are on mobile screen (<= 768px)
const mq = () => window.innerWidth <= 768;

// Store whether we were on mobile before resizing (used later)
let wasMobile = mq();

// ===============================
// HELPER FUNCTIONS
// ===============================

// Close all dropdowns and submenus inside the given "scope" (default: document)
function closeDropdowns(scope = document) {
  // Close all open dropdown menus
  scope
    .querySelectorAll(".dropdown-content.show, .nested-content.show")
    .forEach((menu) => menu.classList.remove("show"));

  // Reset "aria-expanded" (for accessibility: tells screen readers if open or closed)
  scope
    .querySelectorAll(
      ".dropdown-toggle[aria-expanded], .nested-toggle[aria-expanded]"
    )
    .forEach((btn) => btn.setAttribute("aria-expanded", "false"));

  // Remove alignment classes (desktop only)
  scope
    .querySelectorAll(".dropdown-content.align-right")
    .forEach((menu) => menu.classList.remove("align-right"));

  scope
    .querySelectorAll(".nested-content.open-left")
    .forEach((menu) => menu.classList.remove("open-left"));
}

// Close the entire mobile nav (when hamburger is clicked again or outside click)
function closeMobileNav() {
  navLinks.classList.remove("show"); // hide menu
  hamburger.setAttribute("aria-expanded", "false"); // update accessibility
}

// Close everything (dropdowns + mobile nav)
function closeEverything() {
  closeDropdowns();
  closeMobileNav();
}

// Adjust dropdown position (desktop only)
// If menu goes out of screen on right side, flip to left
function adjustDropdownPosition(menu) {
  if (mq()) return; // skip this check if mobile mode

  const buffer = 20; // some extra space before flipping

  // If it's a first-level dropdown
  if (menu.classList.contains("dropdown-content")) {
    const rect = menu.getBoundingClientRect(); // get position on screen
    if (rect.right > window.innerWidth - buffer) {
      menu.classList.add("align-right"); // move left
    } else {
      menu.classList.remove("align-right");
    }
  }

  // If it's a nested submenu
  if (menu.classList.contains("nested-content")) {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth - buffer) {
      menu.classList.add("open-left"); // open on left side
    } else {
      menu.classList.remove("open-left");
    }
  }
}

// ===============================
// EVENT LISTENERS
// ===============================

// 1. HAMBURGER BUTTON CLICK (open/close mobile nav)
hamburger.addEventListener("click", (e) => {
  e.stopPropagation(); // stop event from reaching document

  const willOpen = !navLinks.classList.contains("show"); // check if menu is closed
  if (willOpen) closeDropdowns(); // close other dropdowns before opening

  navLinks.classList.toggle("show"); // open/close menu
  hamburger.setAttribute("aria-expanded", String(willOpen)); // update accessibility
});

// 2. FIRST-LEVEL DROPDOWN TOGGLES (Products, Services, Account)
document.querySelectorAll(".dropdown-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const menu = btn.nextElementSibling; // dropdown menu next to button
    const willOpen = !menu.classList.contains("show"); // is it closed?

    // Close all sibling dropdowns
    const parentUl = btn.closest("ul") || document;
    parentUl.querySelectorAll(".dropdown-content").forEach((m) => {
      if (m !== menu) m.classList.remove("show");
    });
    parentUl.querySelectorAll(".dropdown-toggle").forEach((b) => {
      if (b !== btn) b.setAttribute("aria-expanded", "false");
    });

    // Toggle this menu
    menu.classList.toggle("show", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));

    // Adjust position if needed
    if (willOpen) adjustDropdownPosition(menu);
  });
});

// 3. NESTED SUBMENU TOGGLES (Accessories, OAuth)
document.querySelectorAll(".nested-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const submenu = btn.nextElementSibling; // submenu div
    const willOpen = !submenu.classList.contains("show");

    // Close other submenus inside same parent dropdown
    const scope = btn.closest(".dropdown-content") || document;
    scope.querySelectorAll(".nested-content").forEach((m) => {
      if (m !== submenu) m.classList.remove("show");
    });
    scope.querySelectorAll(".nested-toggle").forEach((b) => {
      if (b !== btn) b.setAttribute("aria-expanded", "false");
    });

    // Toggle submenu
    submenu.classList.toggle("show", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) adjustDropdownPosition(submenu);
  });
});

// 4. CLICK OUTSIDE NAVBAR = CLOSE EVERYTHING
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar")) closeEverything();
});

// 5. PRESS ESC KEY = CLOSE EVERYTHING
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEverything();
});

// 6. WHEN RESIZE SCREEN
window.addEventListener("resize", () => {
  const isMobile = mq();

  // If switching between desktop <-> mobile
  if (isMobile !== wasMobile) {
    closeEverything(); // reset menus
    wasMobile = isMobile; // update state
  } else {
    // Re-adjust open dropdowns so they don’t go outside screen
    document
      .querySelectorAll(".dropdown-content.show, .nested-content.show")
      .forEach(adjustDropdownPosition);
  }
});
