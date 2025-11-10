(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFETUlOX1NUQVRJQ19UT0tFTiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2Mjc2MDA5OX0.eb12wid_2TMw9c0jyGxJ98M7lV-pZvuL8jxbg_HkN0o';

  // Star SVGs
  const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg"><path d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z" fill="#FFBF00"/></svg>`;
  const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg"><path d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z" fill="#D9D9D9"/></svg>`;

  // Load external JS
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

  // Generate star markup
  const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);

  // Create a single review card
  function createReviewCard(r) {
    const rating = Math.round(Number(r.product_store_rating) || 0);
    const date = new Date(r.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `
      <div class="review-item">
        <div class="reviewer"><span>${r.name || "Anonymous"}</span> 
        <span><svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
          <style>
            .s0 { fill: #000000 } 
          </style>
          <g>
            <path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/>
          </g>
        </svg></span></div>
        <div class="reviewDate">${date}</div>
        <div class="revs-rating-stars">${starsHTML(rating)}</div>
        <div class="review-body">${r.reviewBody || ""}</div>
      </div>`;
  }

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

  async function initMasonry(list) {
    await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
    await loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js");

    // Wait for images then initialize Masonry
    imagesLoaded(list, function () {
      new Masonry(list, {
        itemSelector: ".review-item",
        gutter: 20,
        fitWidth: true,
      });
    });
  }

  async function initContainer(container) {
    const brandId = container.getAttribute("data-brandid");
    const productId = container.getAttribute("data-product-id")
    if (!brandId) return;

    container.innerHTML = `
      <div class="revs-review-widget">
        <div class="revs-reviews-header">
          <div class="revs-reviewsInfoWrap">
            <div class="revs-rating-stars">
              ${STAR_YELLOW.repeat(5)}
            </div>
            <span class="revs-review-count">Loading...</span>
          </div>
          <div class="revs-reviewsFilterWrap">
            <button id="revs-rating-menu-filter" style="display:none;">
              <span id="revs-rating-filter-icon">
                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                  <style>
                    .s0 { fill: none;stroke: #000000;stroke-linecap: round;stroke-width: 1.3 } 
                  </style>
                  <path class="s0" d="m3.33 4.17h5m0 0c0 0.92 0.75 1.66 1.67 1.66 0.92 0 1.67-0.74 1.67-1.66m-3.34 0c0-0.92 0.75-1.67 1.67-1.67 0.92 0 1.67 0.75 1.67 1.67m0 0h5m-13.34 5.83h10m0 0c0 0.92 0.75 1.67 1.67 1.67 0.92 0 1.67-0.75 1.67-1.67 0-0.92-0.75-1.67-1.67-1.67-0.92 0-1.67 0.75-1.67 1.67zm-6.66 5.83h10m-10 0c0-0.92-0.75-1.66-1.67-1.66-0.92 0-1.67 0.74-1.67 1.66 0 0.92 0.75 1.67 1.67 1.67 0.92 0 1.67-0.75 1.67-1.67z"/>
                </svg>
              </span>
            </button>
          </div>
          <ul class="revs-filter-options" style="display:none;">
            <li class="revs-filter-value">
              <button data-option="newest">
                <div class="rev-sorting-option">Newest</div>
                <span class="rev-option-selected">
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.364 9.28895L15.556 0.0959473L16.971 1.50995L6.364 12.1169L0 5.75295L1.414 4.33895L6.364 9.28895Z" fill="black"></path></svg>
                </span>
              </button>
            </li>
            <li class="revs-filter-value" data-option="oldest">
              <button data-option="oldest">
                <div class="rev-sorting-option">Oldest</div>
                <span>
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.364 9.28895L15.556 0.0959473L16.971 1.50995L6.364 12.1169L0 5.75295L1.414 4.33895L6.364 9.28895Z" fill="black"></path></svg>
                </span>
              </button>
            </li>
            <li class="revs-filter-value" data-option="popular">
              <button data-option="popular">
                <div class="rev-sorting-option">Most Popular</div>
                <span>
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.364 9.28895L15.556 0.0959473L16.971 1.50995L6.364 12.1169L0 5.75295L1.414 4.33895L6.364 9.28895Z" fill="black"></path></svg>
                </span>
              </button>
            </li>
            <li class="revs-filter-value" data-option="rating_highest">
              <button data-option="rating_highest">
                <div class="rev-sorting-option">Highest Rated</div>
                <span>
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.364 9.28895L15.556 0.0959473L16.971 1.50995L6.364 12.1169L0 5.75295L1.414 4.33895L6.364 9.28895Z" fill="black"></path></svg>
                </span>
              </button>
            </li>
            <li class="revs-filter-value" data-option="rating_lowest">
              <button data-option="rating_lowest">
                <div class="rev-sorting-option">Lowest Rated</div>
                <span>
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.364 9.28895L15.556 0.0959473L16.971 1.50995L6.364 12.1169L0 5.75295L1.414 4.33895L6.364 9.28895Z" fill="black"></path></svg>
                </span>
              </button>
            </li>
          </ul>
          <div class="revs-header-chevron" style="display:none;">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="revs-chevron-open">
              <path d="M7.11098 5.15691L2.16098 0.206909L0.746979 1.62091L7.11098 7.98491L13.475 1.62091L12.061 0.206911L7.11098 5.15691Z" fill="black"></path>
            </svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="revs-chevron-closed revs-chevron-hide">
              <path d="M6.88902 3.03498L11.839 7.98499L13.253 6.57099L6.88902 0.206985L0.525021 6.57098L1.93902 7.98498L6.88902 3.03498Z" fill="black"></path>
            </svg>
          </div>
        </div>
        <div class="revs-dropdown-reviews-summary">
          <div class="revs-dropdown-review-card"></div>
        </div>
        <div class="revs-reviews-list">Loading reviews...</div>
        <div class="revs-loadMoreWrap"><button class="revs-load-more-btn" style="display:none;">Load More Reviews</button></div>
      </div>`;

    const list = container.querySelector(".revs-reviews-list");
    const reviewCountEl = container.querySelector(".revs-review-count");
    const reviewsCard = container.querySelector('.revs-dropdown-review-card');
    const loadMoreBtn = container.querySelector(".revs-load-more-btn");

    try {
      let res;

      if (productId) {
        res = await fetch(
          `https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}&shopifyProductId=${productId}&status=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await fetch(
          `https://revtrust-br7i.onrender.com/api/review/all?brandId=${brandId}&status=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const data = await res.json();
      const reviews = data?.data?.data || [];
      const totalReviews = reviews.length;
      let visibleCount = 5;

      if (!reviews.length) {
        list.innerHTML = `<p>No reviews yet.</p>`;
        reviewCountEl.textContent = "No reviews";
        return;
      }

      function renderVisibleReviews() {
        const visible = reviews
          .filter((r) => r.status === "ACTIVE")
          .slice(0, visibleCount)
          .map((r) => createReviewCard(r))
          .join("");
        list.innerHTML = visible;
        if (visibleCount < reviews.length) {
          loadMoreBtn.style.display = "block";
        } else {
          loadMoreBtn.style.display = "none";
        }
        initMasonry(list);
      }

      loadMoreBtn.addEventListener("click", () => {
        visibleCount += 10;
        renderVisibleReviews();
      });

      renderVisibleReviews();

      /* list.innerHTML = reviews
        .filter((r) => r.status === "ACTIVE")
        .map((r) => createReviewCard(r))
        .join(""); */

      reviewCountEl.textContent = `${reviews.length} Review${reviews.length > 1 ? "s" : ""}`;
      reviewsCard.innerHTML = `${generateDynamicRatingBlock(reviews, totalReviews)}`;

      // await initMasonry(list);
    } catch (err) {
      console.error("Error loading reviews:", err);
      list.innerHTML = `<p>Failed to load reviews.</p>`;
    }
  }

  function initAll() {
    document.querySelectorAll(".revs-review-widget-container").forEach(initContainer);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initAll);
  else initAll();



  document.querySelectorAll('.revs-reviewsFilterWrap button#revs-rating-menu-filter').forEach(button => {
    const header = button.closest('.revs-reviews-header');
    const filterOptions = header.querySelector('.revs-filter-options');

    // Toggle on button click
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering document click
      const isVisible = filterOptions.style.display === 'block';
      // Hide all open dropdowns first
      document.querySelectorAll('.revs-filter-options').forEach(opt => opt.style.display = 'none');
      // Then toggle the clicked one
      filterOptions.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!filterOptions.contains(e.target) && !button.contains(e.target)) {
        filterOptions.style.display = 'none';
      }
    });
  });


  /* const sortSelect = document.querySelector('.brandAllReviews .sort-dropdown #sort');
  let brandID = atob(encodedID);
  if (sortSelect) {
    sortSelect.addEventListener('change', async function() {
      const option = this.value;
      let orderby = '';
      let sortby = '';
      const reviewsContainer = document.querySelector('.revs-reviews-list');

      if (option) {
        if (option === 'newest') {
          sortby = 'createdAt';
          orderby = 'desc';
        } else if (option === 'oldest') {
          sortby = 'createdAt';
          orderby = 'asc';
        } else if (option === 'popular') {
          sortby = 'product_quality_rating';
          orderby = 'desc';
        } else if (option === 'rating_highest') {
          sortby = 'product_store_rating';
          orderby = 'desc';
        }else if (option === 'rating_lowest') {
          sortby = 'product_store_rating';
          orderby = 'asc';
        }

        try {
          const reviewResponse = await fetch(
            `https://revstrust.myshopify.com/apps/rev-proxy/api/review/all?brandId=${brandID}&sortBy=${sortby}&order=${orderby}`
          );

          if (!reviewResponse.ok) throw new Error(`Review API failed: ${reviewResponse.status}`);

          const data = await reviewResponse.json();
          const reviews = data?.data?.data || [];
          const pagination = data?.data?.pagination || [];

          if (reviewsContainer) {

            if (reviews.length > 0) {
              reviewsContainer.innerHTML = `
                ${reviews.map(r => `
                  <div class="review-item">
                    <div class="reviewer"><span>${r.name || "Anonymous"}</span> 
                    <span><svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                      <style>
                        .s0 { fill: #000000 } 
                      </style>
                      <g>
                        <path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/>
                      </g>
                    </svg></span></div>
                    <div class="reviewDate">${date}</div>
                    <div class="revs-rating-stars">${starsHTML(rating)}</div>
                    <div class="review-body">${r.reviewBody || ""}</div>
                  </div>
                `).join('')}
              `;
            } else {
              reviewsContainer.innerHTML = `<p class="no-reviews">No reviews found for this brand.</p>`;
            }
          }

        } catch (error) {
          console.log('Error fetching sorted reviews:', error);
        }
      }
    });
  } */


  // Styles
  const style = document.createElement("style");
  style.innerHTML = `
    .revs-review-widget { max-width: 1100px; margin: 0 auto; font-family: Arial, sans-serif; }
    .review-title { font-size: 22px; font-weight: 600; margin-bottom: 20px; text-align: center; }
    .revs-reviews-list { margin: 0 auto; }
    .revs-reviews-header .revs-reviewsInfoWrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .revs-reviewsFilterWrap button#revs-rating-menu-filter {
      font-size: 16px;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      height: 40px !important;
      cursor: pointer;
      color: #000000;
      background: none;
      padding: 8px 6px 2px;
      width: 37px;
    }
    .revs-reviews-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; justify-content: space-between; position: relative; }
    .revs-reviews-header .revs-review-count { font-weight: 600; font-size: 24px; line-height:24px; color: #333; }
    .revs-review-widget .revs-reviews-header .revs-rating-stars .star svg {
      width: 25px;
      height: 25px;
    }
    .review-item {
      width: 320px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      transition: transform 0.2s ease;
    }
    .review-item:hover { transform: translateY(-4px); }
    .reviewer { font-weight: 600; margin-bottom: 4px; }
    .reviewDate { font-size: 12px; color: #888; margin-bottom: 8px; }
    .revs-rating-stars { display: flex; gap: 4px; margin-bottom: 10px; }
    .review-body { font-size: 14px; color: #333; line-height: 1.4; }
    .revs-review-widget-container .revs-dropdown-reviews-summary {
      max-width: 550px;
      margin: 30px auto 30px auto;
    }
    .revs-review-widget-container .revs-dropdown-review-card {
      border: .5px solid #0000004D;
      border-radius: 15px;
      background: #fff;
      padding: 30px 20px;
    } 
    .revs-review-widget-container .revs-dropdown-reviews-summary .rating-overview p {
      margin-top: 0;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .rating-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .rating-bars .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      box-sizing: border-box;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .rating-bars .label {
      flex: 0 0 66px;
      white-space: nowrap;
      color: #000;
      font-weight: 400;
      font-size: 14px;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .progress {
      flex: 1 1 0;
      height: 20px;
      background: #ffbf000f;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .count {
      flex: 0 0 44px;
      text-align: right;
      color: #000;
      font-weight: 400;
      font-size: 14px;
    }
    .revs-review-widget-container .revs-dropdown-reviews-summary .rating-bars .fill {
      height: 100%;
      width: 0%;
      max-width: 100%;
      background: #FFBF00;
      border-radius: 20px;
      transition: width .3s ease;
      box-sizing: border-box;
      display:block;
    }
    .revs-review-widget-container .revs-loadMoreWrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 15px 0;
    }
    .revs-review-widget-container .revs-loadMoreWrap .revs-load-more-btn {
      background: #000;
      border: 0;
      border-radius: 5px;
      height: 40px;
      color: #fff;
      padding: 0 15px;
      font-size: 14px;
      cursor: pointer;
    }
    .revs-review-widget .revs-reviews-list .review-item .reviewer {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .revs-review-widget .revs-reviews-list .review-item .reviewer span {
      line-height: 0;
    }
    .revs-review-widget-container ul.revs-filter-options {
      width: 275px;
      margin-top: 4px;
      text-align: left;
      position: absolute;
      padding: 20px 20px 8px;
      font-size: 14px;
      list-style: none;
      background-color: #fff;
      box-shadow: 0px 6px 14px -4px rgba(0, 0, 0, 0.14);
      border-radius: 4px;
      -webkit-box-shadow: 0px 6px 14px -4px rgba(0, 0, 0, 0.14);
      animation: growOut .2s ease-in-out forwards;
      transform-origin: 100% 0px;
      right: 0;
      top: 40px;
      z-index: 9;
    }
    .revs-review-widget-container ul.revs-filter-options li button {
      border: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: none;
      width: 100%;
      padding-bottom: 20px;
      color: #000000;
    }
    .revs-review-widget-container ul.revs-filter-options button span {
      display: none;
    }
    .revs-review-widget-container ul.revs-filter-options button span.rev-option-selected {
      display: block;
    }
    @keyframes growOut{
      0% {
        opacity: 0;
        transform: scale(0.7) translateY(-20px);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    @media only screen and (max-width: 575px){
      .revs-review-widget-container{
        padding: 0 20px;
      }
    }
  `;
  document.head.appendChild(style);
})();