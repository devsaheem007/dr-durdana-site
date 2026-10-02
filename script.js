const clinicConfig = {
  whatsapp: "923373830789",
  phone: "03373830789",
  email: "aesthetik80@gmail.com",
  tiktok: "https://www.tiktok.com/@drdurdana_aesthetics?_r=1&_t=ZS-9ACCVXvMFHd",
  instagram: "",
};
const $ = (s) => document.querySelector(s);
const nav = $("#mainNav"),
  menu = $("#menuToggle"),
  header = $("#header");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
nav
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open")),
  );
const savedTheme = localStorage.getItem("drdurdana-theme");
if (savedTheme === "dark") document.body.classList.add("dark");
function syncTheme() {
  $("#themeIcon").textContent = document.body.classList.contains("dark")
    ? "☀"
    : "☾";
}
syncTheme();
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "drdurdana-theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
  syncTheme();
});
function updateHeader() {
  header.classList.toggle("scrolled", scrollY > 18);
}
addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
function openWhatsApp(message) {
  window.open(
    `https://wa.me/${clinicConfig.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
}
$("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#bName").value.trim(),
    phone = $("#bPhone").value.trim(),
    email = $("#bEmail").value.trim(),
    date = $("#bDate").value,
    time = $("#bTime").value,
    service = $("#bService").value,
    message = $("#bMessage").value.trim(),
    status = $("#bookingStatus");
  if (!name || !phone || !date || !service) {
    status.textContent = "Please complete your name, phone, date and service.";
    status.className = "form-note error";
    return;
  }
  const msg = `Hello Dr Durdana, I would like to book a consultation.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\nPreferred date: ${date}\nPreferred time: ${time || "Flexible"}\nService: ${service}\nMessage: ${message || "No additional message"}`;
  openWhatsApp(msg);
  status.textContent =
    "WhatsApp opened with your consultation details. Please press Send to complete the request.";
  status.className = "form-note";
});
document.querySelectorAll("[data-service]").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp(
      `Hello Dr Durdana, I am interested in ${btn.dataset.service}. I would like to know more and book a consultation.`,
    );
  }),
);

// Infinite review carousel with autoplay, arrows and touch/mouse dragging.
const track = $("#reviewTrack"),
  windowEl = $(".review-window"),
  originalCards = [...document.querySelectorAll(".review-card")];
const cloneCount = originalCards.length;
originalCards
  .slice()
  .reverse()
  .forEach((card) =>
    track.insertBefore(card.cloneNode(true), track.firstChild),
  );
originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
let reviewIndex = cloneCount,
  reviewTimer,
  dragging = false,
  startX = 0,
  startTranslate = 0;
function visible() {
  return innerWidth <= 720 ? 1 : innerWidth <= 900 ? 2 : 3;
}
function cardStep() {
  const card = track.querySelector(".review-card");
  return card ? card.getBoundingClientRect().width + 16 : 0;
}
function moveReviews(animate = true) {
  track.style.transition = animate
    ? "transform .7s cubic-bezier(.22,1,.36,1)"
    : "none";
  track.style.transform = `translateX(-${reviewIndex * cardStep()}px)`;
}
function resetIfNeeded() {
  const v = visible();
  if (reviewIndex >= cloneCount + originalCards.length) {
    reviewIndex = cloneCount;
    moveReviews(false);
  }
  if (reviewIndex < cloneCount) {
    reviewIndex = cloneCount + originalCards.length - v;
    moveReviews(false);
  }
}
function nextReview() {
  reviewIndex++;
  moveReviews();
  setTimeout(resetIfNeeded, 720);
}
function prevReview() {
  reviewIndex--;
  moveReviews();
  setTimeout(resetIfNeeded, 720);
}
function startReviews() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(nextReview, 4200);
}
$("#reviewNext").addEventListener("click", () => {
  nextReview();
  startReviews();
});
$("#reviewPrev").addEventListener("click", () => {
  prevReview();
  startReviews();
});
windowEl.addEventListener("mouseenter", () => clearInterval(reviewTimer));
windowEl.addEventListener("mouseleave", startReviews);
windowEl.addEventListener("pointerdown", (e) => {
  dragging = true;
  startX = e.clientX;
  startTranslate = reviewIndex * cardStep();
  windowEl.classList.add("dragging");
  track.style.transition = "none";
  windowEl.setPointerCapture?.(e.pointerId);
});
windowEl.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const delta = e.clientX - startX;
  track.style.transform = `translateX(${-startTranslate * 1 - delta}px)`;
});
windowEl.addEventListener("pointerup", (e) => {
  if (!dragging) return;
  dragging = false;
  windowEl.classList.remove("dragging");
  const delta = e.clientX - startX;
  if (Math.abs(delta) > 45) {
    delta < 0 ? nextReview() : prevReview();
  } else moveReviews();
  startReviews();
});
addEventListener("resize", () => moveReviews(false));
moveReviews(false);
startReviews();

// Scroll reveal animations + staggered cards.
const revealTargets = document.querySelectorAll(
  ".section,.booking-card,.booking-side,.about-copy,.certificate-card,.section-head,.cta-inner,.contact-grid,.floating-card",
);
revealTargets.forEach((el) => el.classList.add("reveal"));
[".service-grid", ".media-grid", ".benefit-grid"].forEach((sel) =>
  document.querySelectorAll(sel).forEach((el) => el.classList.add("stagger")),
);
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal,.reveal-left,.reveal-right,.stagger")
  .forEach((el) => observer.observe(el));

// Image lightbox for supplied clinic media and certificate.
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML =
  '<button class="lightbox-close" aria-label="Close image">×</button><img alt="Expanded clinic image">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector("img");
document
  .querySelectorAll(".media-card img,.certificate-card img")
  .forEach((img) =>
    img.addEventListener("click", () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      document.body.classList.add("no-scroll");
    }),
  );
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    if (!lightbox.classList.contains("open")) lightboxImg.src = "";
  }, 350);
}
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.classList.contains("lightbox-close"))
    closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Formspree endpoint is now configured.
const contactForm = $("#contactForm");
contactForm.addEventListener("submit", () => {
  $("#contactStatus").textContent = "Sending your enquiry securely…";
  $("#contactStatus").className = "form-note";
});
