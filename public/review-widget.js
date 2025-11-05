(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

  function generateDynamicRatingBlock(reviews, totalreviews) {
    if (!reviews || reviews.length === 0) return `<div class="rating-header"><div class="noReviews"><p>No reviews yet.</p></div>`;

    const ratingCounts = {5:0,4:0,3:0,2:0,1:0};
    let totalRatingSum = 0, totalRatingCount = 0;

    reviews.forEach(review => {
      const ratings = [
        review.product_store_rating,
        review.seller_rating,
        review.product_quality_rating,
        review.product_price_rating,
        review.issue_handling_rating
      ].filter(r => typeof r === 'number' && r > 0);

      const reviewAverage = ratings.length ? ratings.reduce((sum,r)=>sum+r,0)/ratings.length : 0;
      if (reviewAverage > 0) {
        const rounded = Math.round(reviewAverage);
        if (rounded >=1 && rounded <=5) ratingCounts[rounded]++;
        totalRatingSum += reviewAverage;
        totalRatingCount++;
      }
    });

    const totalReviews = totalreviews;
    const overallRating = totalRatingCount ? totalRatingSum/totalRatingCount : 0;
    const roundedOverall = overallRating.toFixed(1);

    const labels = {5:'Excellent',4:'Very Good',3:'Average',2:'Poor',1:'Terrible'};
    let ratingBarsHTML = '';
    for (let i=5;i>=1;i--){
      const count = ratingCounts[i];
      const percent = totalReviews ? ((count/totalReviews)*100).toFixed(1) : 0;
      ratingBarsHTML += `
        <div class="bar">
          <span class="label">${labels[i]}</span>
          <div class="progress">
            <div class="fill" style="width:${percent}%"></div>
          </div>
          <span class="count">${count}</span>
        </div>`;
    }

    return `
      <div class="rating-header">
        <div class="rating-overview">
          <p class="out-pera">${roundedOverall} out of 5 stars — Rated ${
              roundedOverall >= 4.5 ? 'Excellent' :
              roundedOverall >= 4 ? 'Very Good' :
              roundedOverall >= 3 ? 'Average' :
              roundedOverall >= 2 ? 'Poor' : 'Terrible'
            }</p>
        </div>
      </div>
      <div class="rating-bars">${ratingBarsHTML}</div>
    `;
  }

  // Add global styles
  const style = document.createElement("style");
  style.innerHTML = `
    .review-widget-container { width: 100%; margin: 0 auto; padding: 30px; box-sizing: border-box; }
    .review-widget { max-width: 1200px; margin: 0 auto; position: relative; }
    .reviews-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .reviews-header .review-count { font-weight: 600; font-size: 24px; line-height:24px; color: #333; }
    .review-widget .reviews-header .rating-stars .star svg {
      width: 25px;
      height: 25px;
    }
    .rating-stars .star svg { width: 20px; height: 20px; }
    
    .review-widget-container .dropdown-reviews-summary {
      max-width: 550px;
      margin: 30px auto 30px auto;
    }
    .review-widget-container .dropdown-review-card {
      border: .5px solid #0000004D;
      border-radius: 15px;
      background: #fff;
      padding: 30px 20px;
    } 
    .review-widget-container .dropdown-reviews-summary .rating-overview p {
      margin-top: 0;
    }
    .review-widget-container .dropdown-reviews-summary .rating-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .review-widget-container .dropdown-reviews-summary .rating-bars .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      box-sizing: border-box;
    }
    .review-widget-container .dropdown-reviews-summary .rating-bars .label {
      flex: 0 0 66px;
      white-space: nowrap;
      color: #000;
      font-weight: 400;
      font-size: 14px;
    }
    .review-widget-container .dropdown-reviews-summary .progress {
      flex: 1 1 0;
      height: 20px;
      background: #ffbf000f;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }
    .review-widget-container .dropdown-reviews-summary .count {
      flex: 0 0 44px;
      text-align: right;
      color: #000;
      font-weight: 400;
      font-size: 14px;
    }
    .review-widget-container .dropdown-reviews-summary .rating-bars .fill {
      height: 100%;
      width: 0%;
      max-width: 100%;
      background: #FFBF00;
      border-radius: 20px;
      transition: width .3s ease;
      box-sizing: border-box;
      display:block;
    }

    /* Masonry Grid */
    .reviews-list {
      column-count: 1;
      column-gap: 20px;
    }
    @media (min-width: 768px) {
      .reviews-list { column-count: 2; }
    }
    @media (min-width: 1024px) {
      .reviews-list { column-count: 3; }
    }

    .review-item {
      display: inline-block;
      width: 100%;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin: 0 0 20px;
      padding: 20px;
      font-family: Arial, sans-serif;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
      -moz-column-break-inside: avoid;
      transition: transform 0.2s ease;
    }

    .review-item:hover { transform: translateY(-4px); }
    .reviewer {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .reviewer span {
      line-height: 0;
    }
    .rating-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 0;
      line-height: 0;
    }
    .review-body {
      font-size: 14px;
      line-height: 20px;
      color: #333;
      padding-top: 10px;
    }
    .header-chevron .chevron-hide{
      display:none;
    }
    .review-widget .review-item .reviewDate {
      font-size: 11px;
      margin: 5px 0;
      color: #73777B;
    }
  `;
  document.head.appendChild(style);

  const STAR_YELLOW = `
    <span class="star">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2002 0L16.3164 9.59051H26.4004L18.2422 15.5178L21.3584 25.1083L13.2002 19.181L5.04204 25.1083L8.15818 15.5178L0 9.59051H10.0841L13.2002 0Z" fill="#FFBF00"/>
      </svg>
    </span>`;
  const STAR_GRAY = `
    <span class="star">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.2002 0L16.3164 9.59051H26.4004L18.2422 15.5178L21.3584 25.1083L13.2002 19.181L5.04204 25.1083L8.15818 15.5178L0 9.59051H10.0841L13.2002 0Z" fill="#D9D9D9"/>
      </svg>
    </span>`;

  // Loop through each widget container
  const containers = document.querySelectorAll(".review-widget-container");
  containers.forEach(async (container) => {
    const brandId = container.getAttribute("data-brandid");
    const productImage = container.getAttribute("data-product-image");

    if (!brandId) return;

    const widget = document.createElement("div");
    widget.className = "review-widget";
    widget.innerHTML = `
      <div class="reviews-header">
        <div class="rating-stars">
          ${STAR_YELLOW.repeat(5)}
        </div>
        <span class="review-count">Loading...</span>
        <div class="header-chevron" style="display:none;">
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="chevron open" role="img" class="chevron-open">
            <path d="M7.11098 5.15691L2.16098 0.206909L0.746979 1.62091L7.11098 7.98491L13.475 1.62091L12.061 0.206911L7.11098 5.15691Z" fill="black"></path>
          </svg>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="chevron closed" role="img" class="chevron-closed chevron-hide">
            <path d="M6.88902 3.03498L11.839 7.98499L13.253 6.57099L6.88902 0.206985L0.525021 6.57098L1.93902 7.98498L6.88902 3.03498Z" fill="black"></path>
          </svg>
        </div>
      </div>
      <div class="dropdown-reviews-summary">
        <div class="dropdown-review-card"></div>
      </div>
      <div class="reviews-list">Loading reviews...</div>
    `;
    container.appendChild(widget);

    try {
      const res = await fetch(`https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}`);
      const data = await res.json();
      const reviews = data?.data?.data || [];

      const reviewCountEl = widget.querySelector(".review-count");
      const reviewsList = widget.querySelector(".reviews-list");
      const reviewsCard = widget.querySelector('.dropdown-review-card');

      const totalReviews = reviews.length;

      if (!reviews.length) {
        reviewCountEl.textContent = "No reviews";
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
        return;
      }

      reviewCountEl.textContent = `${reviews.length} Review${reviews.length > 1 ? "s" : ""}`;
      reviewsCard.innerHTML = `${generateDynamicRatingBlock(reviews, totalReviews)}`;
      reviewsList.innerHTML = "";

      reviews
        .filter(r => r.status === "ACTIVE")
        .forEach(r => {
          const filledStars = STAR_YELLOW.repeat(r.product_store_rating);
          const emptyStars = STAR_GRAY.repeat(5 - r.product_store_rating);

          const reviewItem = document.createElement("div");
          reviewItem.className = "review-item";
          reviewItem.innerHTML = `
            <div class="reviewer"><span>${r.name}</span> <span class="verFReviewer">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
              <style>
                .s0 { fill: #000000 } 
              </style>
              <g>
                <path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/>
              </g>
            </svg></span>
            </div>
            <div class="reviewDate">${new Date(r.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}</div>
            <div class="rating-stars">${filledStars + emptyStars}</div>
            <div class="review-body">${r.reviewBody}</div>
          `;
          reviewsList.appendChild(reviewItem);
        });

      // Re-trigger layout recalculation after images or DOM ready
      setTimeout(() => refreshMasonry(reviewsList), 300);
      window.addEventListener("resize", () => refreshMasonry(reviewsList));

    } catch (err) {
      console.error("Error fetching reviews:", err);
      widget.querySelector(".reviews-list").innerHTML = "<p>Failed to load reviews.</p>";
    }
  });

  // Optional: reflow handler (mostly for consistent columns on resize)
  function refreshMasonry(list) {
    list.style.columnGap = "20px";
  }


  /* document.addEventListener("click", function (e) {
    const target = e.target.closest(".review-widget-container .reviews-header .header-chevron svg");
    if (!target) return; // Exit if click is outside target

    // Add 'chevron-hide' to clicked SVG
    target.classList.add("chevron-hide");

    // Remove 'chevron-hide' from sibling SVGs
    const siblings = target.parentElement.querySelectorAll("svg");
    siblings.forEach((svg) => {
      if (svg !== target) svg.classList.remove("chevron-hide");
    });

    // Find the dropdown section
    const reviewWidget = target.closest(".review-widget");
    const dropdown = reviewWidget ? reviewWidget.querySelector(".dropdown-reviews-summary") : null;
    if (!dropdown) return;

    // Toggle visibility
    if (target.classList.contains("chevron-open")) {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  }); */

})();
