// == REVIEWS WIDGET JS ==

// Helper: Load external JS dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Helper: Generate star markup
function generateStars(rating) {
  const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg"><path d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z" fill="#FFBF00"/></svg>`;
  const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg"><path d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z" fill="#D9D9D9"/></svg>`;
  return STAR_YELLOW.repeat(rating) + STAR_GRAY.repeat(5 - rating);
}

// Load more button logic
function initLoadMore(container, reviews) {
  const listEl = container.querySelector(".revs-reviews-list");
  const loadMoreBtn = container.querySelector(".revs-load-more-btn");
  const pageSize = 5;
  let page = 1;

  function renderPage() {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const items = reviews.slice(start, end);

    items.forEach(r => {
      const reviewEl = document.createElement("div");
      reviewEl.classList.add("review-item");
      reviewEl.innerHTML = `
        <div class="reviewer">${r.name || "Anonymous"}</div>
        <div class="reviewDate">${r.createdAt}</div>
        <div class="revs-rating-stars">${generateStars(r.product_store_rating)}</div>
        <div class="review-body">${r.reviewBody || ""}</div>
      `;
      listEl.appendChild(reviewEl);
    });

    // Update Masonry layout
    if (window.Masonry && window.imagesLoaded) {
      imagesLoaded(listEl, function () {
        new Masonry(listEl, {
          itemSelector: ".review-item",
          gutter: 20,
          fitWidth: true,
        });
      });
    }

    if (end >= reviews.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }

  loadMoreBtn.addEventListener("click", () => {
    page++;
    renderPage();
  });

  renderPage();
}

// Optional: Filter by rating dropdown
function initRatingFilter(container) {
  const filterBtn = container.querySelector("#revs-rating-menu-filter");
  if (!filterBtn) return;

  filterBtn.addEventListener("click", () => {
    // Implement filter logic as needed
    alert("Filter dropdown clicked! Implement logic here.");
  });
}

// Initialize the widget
(async function () {
  try {
    const script = document.currentScript;
    const baseURL = new URL(script.src).origin;

    // Load CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${baseURL}/widget.css`;
    document.head.appendChild(css);

    // Load HTML
    const container = document.getElementById("revsPDPwidget");
    const html = await fetch(`${baseURL}/product-widget.html`).then(r => r.text());
    container.innerHTML = html;

    // Load external libraries
    await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
    await loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js");

    // Fetch reviews
    const brandId = container.dataset.brandid;
    const productId = container.dataset.productId;
    const url = productId
      ? `https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}&productId=${productId}&status=ACTIVE`
      : `https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}&status=ACTIVE`;

    const data = await fetch(url).then(r => r.json());
    const reviews = data?.data?.data || [];

    // Initialize Load More, Masonry, Filters
    initLoadMore(container, reviews);
    initRatingFilter(container);

  } catch (err) {
    console.error("Error initializing reviews widget:", err);
  }
})();
