document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("revsBrandReviewWidget");
  if (!container) return;

  const brandId = container.dataset.brandid;
  if (!brandId) {
    console.error("Brand ID missing on #revsBrandReviewWidget");
    return;
  }

  // Inject base widget structure dynamically
  container.innerHTML = `
    <div class="revs-review-header mb-4">
      <h2 class="text-xl font-semibold">Customer Reviews</h2>
      <div class="revs-review-count text-gray-600 text-sm"></div>
    </div>
    <div class="revs-reviews-list"></div>
    <div class="revs-load-more text-center mt-4">
      <button class="revs-load-more-btn bg-gray-900 text-white px-4 py-2 rounded-lg">Load More</button>
    </div>
  `;

  const reviewsList = container.querySelector(".revs-reviews-list");
  const reviewCountEl = container.querySelector(".revs-review-count");
  const loadMoreBtn = container.querySelector(".revs-load-more-btn");

  let currentPage = 1;
  const pageSize = 5;
  let totalReviewsLoaded = 0;

  async function fetchAllReviews({ brandId, sortBy = "createdAt", order = "desc", page = 1, limit = 5 }) {
    const baseURL = "https://revtrust-br7i.onrender.com/api/review/all";
    const url = new URL(baseURL);
    url.searchParams.set("brandId", brandId);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("order", order);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);

    try {
      const res = await fetch(url);
      const json = await res.json();
      return json?.data?.data || [];
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return [];
    }
  }

  function createReviewWidgetCard(review) {
    return `
      <div class="review-item">
        <div class="reviewer">
          <h4 class="font-semibold">${review.name || "Anonymous"}</h4>
          <span class="text-yellow-500">⭐ ${review.product_store_rating || 0}</span>
        </div>
        <p class="review-body">${review.review_body || ""}</p>
      </div>
    `;
  }

  function initreviewMasonry(listEl) {
    // Simple responsive CSS columns for masonry
    listEl.style.columnCount = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    listEl.style.columnGap = "20px";
  }

  async function renderAllReviews(reset = false) {
    if (reset) {
      currentPage = 1;
      reviewsList.innerHTML = "";
      totalReviewsLoaded = 0;
    }

    const reviews = await fetchAllReviews({ brandId, page: currentPage, limit: pageSize });
    if (!reviews.length && totalReviewsLoaded === 0) {
      reviewsList.innerHTML = `<p>No reviews yet.</p>`;
      reviewCountEl.textContent = "No reviews";
      loadMoreBtn.style.display = "none";
      return;
    }

    reviewsList.insertAdjacentHTML("beforeend", reviews.map(createReviewWidgetCard).join(""));
    totalReviewsLoaded += reviews.length;

    loadMoreBtn.style.display = reviews.length === pageSize ? "block" : "none";
    reviewCountEl.textContent = `${totalReviewsLoaded} Review${totalReviewsLoaded > 1 ? "s" : ""}`;
    initreviewMasonry(reviewsList);
  }

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    renderAllReviews();
  });

  window.addEventListener("resize", () => initreviewMasonry(reviewsList));
  renderAllReviews();
});
