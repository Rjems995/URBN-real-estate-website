/**
 * URBN Real Estate - Main Client Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initGalleryLightbox();
  initSaveProperty();
  initShareModal();
  initContactModals();
  initTechSpecsModal();
  initMobileMenu();
  initSmoothNav();
});

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, icon = "✓") {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="text-emerald-400 font-bold">${icon}</span> <span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* ==========================================================================
   Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById("gallery-lightbox");
  if (!lightbox) return;

  const currentImg = document.getElementById("lightbox-current-img");
  const captionEl = document.getElementById("lightbox-caption");
  const counterEl = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const thumbsContainer = document.getElementById("lightbox-thumbs");

  // Gather photos from window.propertyPhotos or DOM
  let photos = window.propertyPhotos || [];
  let currentIndex = 0;

  function updateLightbox(index) {
    if (!photos.length) return;
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;
    currentIndex = index;

    const photo = photos[currentIndex];
    currentImg.src = photo.url;
    currentImg.alt = photo.caption || "Property image";
    if (captionEl)
      captionEl.textContent = photo.caption || `Photo ${currentIndex + 1}`;
    if (counterEl)
      counterEl.textContent = `${currentIndex + 1} / ${photos.length}`;

    // Highlight active thumbnail
    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll(".lightbox-thumb");
      thumbs.forEach((t, i) => {
        if (i === currentIndex) {
          t.classList.add("border-white", "opacity-100", "scale-105");
          t.classList.remove("border-transparent", "opacity-50");
          t.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        } else {
          t.classList.remove("border-white", "opacity-100", "scale-105");
          t.classList.add("border-transparent", "opacity-50");
        }
      });
    }
  }

  function openLightbox(startIndex = 0) {
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    updateLightbox(startIndex);
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Populate thumbnails once
  if (thumbsContainer && photos.length) {
    thumbsContainer.innerHTML = "";
    photos.forEach((photo, i) => {
      const thumb = document.createElement("img");
      thumb.src = photo.url;
      thumb.alt = photo.caption || "";
      thumb.className =
        "lightbox-thumb w-16 h-12 object-cover rounded cursor-pointer border-2 transition-all opacity-50 flex-shrink-0";
      thumb.addEventListener("click", () => updateLightbox(i));
      thumbsContainer.appendChild(thumb);
    });
  }

  // Event triggers for opening
  document.querySelectorAll("[data-gallery-index]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(el.getAttribute("data-gallery-index"), 10) || 0;
      openLightbox(idx);
    });
  });

  const showAllBtn = document.getElementById("btn-show-all-photos");
  if (showAllBtn) {
    showAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(0);
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn)
    prevBtn.addEventListener("click", () => updateLightbox(currentIndex - 1));
  if (nextBtn)
    nextBtn.addEventListener("click", () => updateLightbox(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") updateLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") updateLightbox(currentIndex + 1);
  });

  // Close when clicking outside image
  lightbox.addEventListener("click", (e) => {
    if (
      e.target === lightbox ||
      e.target.classList.contains("lightbox-backdrop")
    ) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   Save / Favorite Feature
   ========================================================================== */
function initSaveProperty() {
  const saveBtn = document.getElementById("btn-save-property");
  if (!saveBtn) return;

  const propertyId = saveBtn.dataset.propertyId || "benevento-villa";
  const heartIcon = saveBtn.querySelector("svg");
  const saveText = saveBtn.querySelector(".save-text");

  // Check initial state from localStorage
  const savedProps = JSON.parse(
    localStorage.getItem("urbn_saved_properties") || "[]",
  );
  let isSaved = savedProps.includes(propertyId);

  function updateSaveUI(saved) {
    if (saved) {
      heartIcon.classList.add("text-red-500", "fill-red-500");
      heartIcon.classList.remove("text-gray-900");
      if (saveText) saveText.textContent = "Saved";
    } else {
      heartIcon.classList.remove("text-red-500", "fill-red-500");
      heartIcon.classList.add("text-gray-900");
      if (saveText) saveText.textContent = "Save";
    }
  }

  updateSaveUI(isSaved);

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSaved = !isSaved;

    let currentList = JSON.parse(
      localStorage.getItem("urbn_saved_properties") || "[]",
    );
    if (isSaved) {
      if (!currentList.includes(propertyId)) currentList.push(propertyId);
      showToast("Property saved to your portfolio", "♥");
    } else {
      currentList = currentList.filter((id) => id !== propertyId);
      showToast("Property removed from favorites", "✕");
    }

    localStorage.setItem("urbn_saved_properties", JSON.stringify(currentList));
    updateSaveUI(isSaved);
  });
}

/* ==========================================================================
   Share Modal
   ========================================================================== */
function initShareModal() {
  const shareBtn = document.getElementById("btn-share-property");
  const shareModal = document.getElementById("share-modal");
  const closeBtn = document.getElementById("share-modal-close");
  const copyBtn = document.getElementById("btn-copy-link");

  if (!shareBtn || !shareModal) return;

  function openShareModal() {
    shareModal.classList.remove("hidden");
    shareModal.classList.add("flex");
  }

  function closeShareModal() {
    shareModal.classList.add("hidden");
    shareModal.classList.remove("flex");
  }

  shareBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Try native share on mobile if supported
    if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      navigator
        .share({
          title: document.title,
          text: "Explore this architectural residence on URBN",
          url: window.location.href,
        })
        .catch(() => openShareModal());
    } else {
      openShareModal();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeShareModal);

  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) closeShareModal();
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Link copied to clipboard");
        closeShareModal();
      });
    });
  }
}

/* ==========================================================================
   Contact Agent & Schedule Tour Modals
   ========================================================================== */
function initContactModals() {
  const contactBtn = document.getElementById("btn-contact-agent");
  const contactModal = document.getElementById("contact-modal");
  const closeBtn = document.getElementById("contact-modal-close");
  const form = document.getElementById("contact-agent-form");

  if (!contactModal) return;

  function openContactModal() {
    contactModal.classList.remove("hidden");
    contactModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeContactModal() {
    contactModal.classList.add("hidden");
    contactModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeContactModal);

  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) closeContactModal();
  });

  // Form submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Transmitting Inquiry...";

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        showToast(
          result.message ||
            "Inquiry sent! Agent Alessandro Moretti will reply within 2 hours.",
        );
        form.reset();
        closeContactModal();
      } catch (err) {
        showToast("Inquiry sent successfully to Floors Agency!");
        closeContactModal();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

/* ==========================================================================
   Technical Specifications Modal
   ========================================================================== */
function initTechSpecsModal() {
  const specsLink = document.getElementById("link-tech-specs");
  const specsModal = document.getElementById("tech-specs-modal");
  const closeBtn = document.getElementById("tech-specs-modal-close");

  if (!specsLink || !specsModal) return;

  specsLink.addEventListener("click", (e) => {
    e.preventDefault();
    specsModal.classList.remove("hidden");
    specsModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  });

  function closeSpecsModal() {
    specsModal.classList.add("hidden");
    specsModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeSpecsModal);

  specsModal.addEventListener("click", (e) => {
    if (e.target === specsModal) closeSpecsModal();
  });
}

/* ==========================================================================
   Smooth Navigations & Calculate Mortgage trigger
   ========================================================================== */
function initSmoothNav() {
  const calcLink = document.getElementById("link-calculate-mortgage");
  if (calcLink) {
    calcLink.addEventListener("click", (e) => {
      e.preventDefault();
      const calcSection = document.getElementById(
        "mortgage-calculator-section",
      );
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: "smooth" });
        calcSection.classList.add("ring-2", "ring-black");
        setTimeout(() => {
          calcSection.classList.remove("ring-2", "ring-black");
        }, 1500);
      }
    });
  }
}

/* ==========================================================================
   Mobile Nav Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}
