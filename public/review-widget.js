(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

  const containers = document.querySelectorAll(".review-widget-container");

  // Add global styles
  const style = document.createElement("style");
  style.innerHTML = `
    .review-widget { border:1px solid #e5e5e5; padding:20px; border-radius:10px; max-width:400px; font-family:Arial,sans-serif; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.1); margin-bottom:20px; }
    .review-widget h3 { margin-top:0; font-size:18px; }
    .review-item { border-top:1px solid #ddd; padding:10px 0; }
    .review-item:first-child { border-top:none; }
    .review-item .reviewer { font-weight:bold; font-size:14px; }
    .review-item .rating { color: #f5a623; font-size:14px; }
    .review-item .review-body { margin-top:5px; font-size:13px; }
  `;
  document.head.appendChild(style);

  containers.forEach(async (container) => {
    const brandId = container.getAttribute("data-brandid");

    // Create main widget element
    const widget = document.createElement("div");
    widget.className = "review-widget";
    widget.innerHTML = `<h3>Customer Reviews</h3><div class="reviews-list">Loading reviews...</div>`;
    container.appendChild(widget);

    try {
      // Fetch reviews from your API
      const res = await fetch(`https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}`);
      const data = await res.json();

      const reviews = data?.data?.data || [];
      const reviewsList = widget.querySelector(".reviews-list");
      reviewsList.innerHTML = ""; // clear loading text

      if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
        return;
      }

      // Render each review
      reviews.forEach((r) => {
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";
        reviewItem.innerHTML = `
          <div class="reviewer">${r.name}</div>
          <div class="rating">${"★".repeat(r.product_store_rating)}${"☆".repeat(5 - r.product_store_rating)}</div>
          <div class="review-body">${r.reviewBody}</div>
        `;
        reviewsList.appendChild(reviewItem);
      });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      widget.querySelector(".reviews-list").innerHTML = "<p>Failed to load reviews.</p>";
    }
  });
})();
