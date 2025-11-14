document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("revsBrandReviewWidget");
  if (!container) return;

  const brandId = container.dataset.brandid;
  if (!brandId) {
    console.error("Brand ID missing on #revsBrandReviewWidget");
    return;
  }

    const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
    const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;

    const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);

    function generateDynamicRatingBlock(reviews, totalreviews) {
      if (!reviews || reviews.length === 0) return `<div class="revsreviewPage__summaryBars"><div class="noReviews"><p>No reviews yet.</p></div>`;

      const ratingCounts = {5:0,4:0,3:0,2:0,1:0};
      let totalRatingSum = 0, totalRatingCount = 0;

      reviews.forEach(review => {
        if(review.status == 'ACTIVE'){
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
        }
      });

      const totalReviews = totalreviews;
      const overallRating = totalRatingCount ? totalRatingSum/totalRatingCount : 0;
      const roundedOverall = overallRating.toFixed(1);

      const reviewRatingWrapper = document.querySelector('.revsreviewPage__summaryLeft');

      if(roundedOverall){
          reviewRatingWrapper.innerHTML = `<div class="revsreviewPage__ratingScore">
              <span class="revsreviewPage__stars">${STAR_YELLOW}${STAR_YELLOW}${STAR_YELLOW}${STAR_YELLOW}${STAR_YELLOW}</span>
              <span class="revsreviewPage__score">${roundedOverall} out of 5</span>
          </div>
          <p>Based on ${reviews.length} reviews</p>`;
      }

      const filledStar = STAR_YELLOW;
      const emptyStar = STAR_GRAY; // optional for empty stars

      // Function to generate star visuals
      const stars = (rating) => {
      const full = Math.min(Math.max(Number(rating), 0), 5); // clamp between 0–5
      return `
          <span class="revsStar">
          ${filledStar.repeat(full)}${emptyStar.repeat(5 - full)}
          </span>
      `;
      };

      let ratingBarsHTML = '';
      for (let i = 5; i >= 1; i--) {
      const count = ratingCounts[i] || 0; // safely handle missing keys
      const percent = totalReviews ? ((count / totalReviews) * 100).toFixed(1) : 0;

      ratingBarsHTML += `
          <div class="revsreviewPage__bar">
          ${stars(i)}
          <div class="revsreviewPage__progress">
              <div class="fill" style="width:${percent}%"></div>
          </div>
          <span class="revsreviewPage__count">${count}</span>
          </div>
      `;
      }

      return `
          <div class="revsreviewPage__summaryBars">${ratingBarsHTML}</div>
      `;
    }

    // Inject base widget structure dynamically
    container.innerHTML = `
      <div class="revsreviewPage__container">
          <div class="revsreviewPage__summary">
              <div class="revsreviewPage__summaryLeft">
                  <div class="revsreviewPage__ratingScore">
                      <span class="revsreviewPage__stars">${STAR_GRAY}${STAR_GRAY}${STAR_GRAY}${STAR_GRAY}${STAR_GRAY}</span>
                      <span class="revsreviewPage__score revshimmer">0 out of 5</span>
                  </div>
                  <p class="revshimmer">Based on 0 reviews</p>
              </div>

              <div class="reviewPage__summaryContainer">
                  <div class="revsreviewPage__bar">
                      <span class="revsStar">${STAR_GRAY}</span>
                      <div class="revsreviewPage__progress"><div class="fill revshimmer" style="width:80%"></div></div>
                  </div>
                  <div class="revsreviewPage__bar">
                      <span class="revsStar">${STAR_GRAY}</span>
                      <div class="revsreviewPage__progress"><div class="fill revshimmer" style="width:80%"></div></div>
                  </div>
                  <div class="revsreviewPage__bar">
                      <span class="revsStar">${STAR_GRAY}</span>
                      <div class="revsreviewPage__progress"><div class="fill revshimmer" style="width:80%"></div></div>
                  </div>
                  <div class="revsreviewPage__bar">
                      <span class="revsStar">${STAR_GRAY}</span>
                      <div class="revsreviewPage__progress"><div class="fill revshimmer" style="width:80%"></div></div>
                  </div>
                  <div class="revsreviewPage__bar">
                      <span class="revsStar">${STAR_GRAY}</span>
                      <div class="revsreviewPage__progress"><div class="fill revshimmer" style="width:80%"></div></div>
                  </div>
              </div>

              <div class="reviewPage__actions">
                  <div class="reviewPage__actionsRight">
                      <div class="reviewPage__sortWrapper">
                          <label for="reviewPageSort" class="reviewPage__sortLabel revshimmer">Sort by:</label>
                          <div class="reviewPage__dropdownWrapper">
                              <select id="reviewPageSort" class="reviewPage__sortDropdown revshimmer" aria-label="Sort dropdown">
                                  <option value="newest">Newest</option>
                                  <option value="oldest">Oldest</option>
                                  <option value="popular">Most Popular</option>
                                  <option value="rating_highest">Highest Rated</option>
                                  <option value="rating_lowest">Lowest Rated</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="revsreviewPage__cards"></div>
          <div class="revs-loadMoreWrap">
            <div class="revsReviewPage__Loader"><span class="revTLoader"></span></div>
            <button class="revs-load-more-btn" style="display:none;">Load More Reviews</button>
          </div>
      </div>`;

    const reviewsList = container.querySelector(".revsreviewPage__cards");
    const reviewCountEl = container.querySelector(".revs-review-count");
    const loadMoreBtn = container.querySelector(".revs-load-more-btn");
    const loaderEl = container.querySelector(".revsReviewPage__Loader");

    let currentSort = 'newest';
    let currentPage = 1;
    const pageSize = 5;
    let totalReviewsLoaded = 0;
    let isLoading = false;

    async function fetchAllReviews({ brandId, sortBy = "createdAt", order = "desc", page = 1, limit = 5 }) {
      const baseURL = "https://revtrust-front.onrender.com";
      const url = new URL("/review-widget", baseURL);
      url.searchParams.set("brandId", brandId);
      url.searchParams.set("sortBy", sortBy);
      url.searchParams.set("order", order);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", limit);

      try {
          const res = await fetch(url.toString());
          if (!res.ok) throw new Error("Failed to fetch reviews");
          const data = await res.json();
          return data || [];
      } catch (err) {
          console.error("Error fetching reviews:", err);
          return [];
      }
    }

    async function fetchAllReviewsTotal({ brandId, productId }) {
      try {
        const baseURL = "https://revtrust-front.onrender.com";
        let url = new URL("/review-widget", baseURL);

        // Add query parameters safely
        if (productId) {
          url.searchParams.set("productId", productId);
        }

        // Example for brandId as well
        if (brandId) {
          url.searchParams.set("brandId", brandId);
        }

        const res = await fetch(url.toString());

        if (!res.ok) throw new Error("Failed to fetch total reviews");
        const data = await res.json();
        let totalReviews = 0;
        // Make sure the response structure is valid
        if (data) {
          totalReviews = data.length;
        }

        // Only set if parentContainer exists and totalReviews is a valid number
        if (Number.isFinite(totalReviews)) {
          return data;
        }else{
          return data;
        }

      }catch (error) {
        console.error("Error fetching total reviews:", error);
        return 0;
      }
    }

    function createReviewWidgetCard(r) {
      const rating = Math.round(Number(r.product_store_rating) || 0);
      const date = new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      return `
        <div class="revsreviewPage__card">
          <div class="revsreviewPage__reviewer"><span class="revshimmer">${r.name || "Anonymous"}</span> 
          <span class="revshimmer"><svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
          <style>
              .s0 { fill: #000000 } 
          </style>
          <g>
              <path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/>
          </g>
          </svg></span></div>
          <div class="revsreviewPage__ReviewDate revshimmer">${date}</div>
          <div class="revsreviewPage__stars revshimmer">${starsHTML(rating)}</div>
          <div class="revsreviewPage_reviewTitle"><h3 class="revshimmer">${r.reviewTitle}</h3></div>
          <div class="revsreviewPage__reviewBody"><p class="revshimmer">${r.reviewContent || ""}</p></div>
        </div>
      `;
    }

    async function initreviewMasonry(list) {
      if (!window.Masonry) await loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js");
      if (!window.imagesLoaded) await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
      imagesLoaded(list, () => new Masonry(list, { itemSelector: ".revsreviewPage__card", gutter: 20, fitWidth: true }));
    }

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }


    async function renderAllReviews(reset = false, currentSort) {
      if (isLoading) return;
      isLoading = true;
      loaderEl.classList.add("revShow");

      if (reset) {
        currentPage = 1;
        reviewsList.innerHTML = "";
        totalReviewsLoaded = 0;
      }

      const totalReviewsAvailable = await fetchAllReviewsTotal({ brandId });
      totalReviewsCount = totalReviewsAvailable.length;

      const sortMapping = {
        newest: { sortBy: "createdAt", order: "desc" },
        oldest: { sortBy: "createdAt", order: "asc" },
        popular: { sortBy: "product_quality_rating", order: "desc" },
        rating_highest: { sortBy: "product_store_rating", order: "desc" },
        rating_lowest: { sortBy: "product_store_rating", order: "asc" },
      };

      const { sortBy, order } = sortMapping[currentSort] || {};

      const reviews = await fetchAllReviews({ brandId, sortBy, order, page: currentPage, limit: pageSize });

      if (!reviews.length && totalReviewsLoaded === 0) {
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
        loaderEl.classList.remove("revShow");
        return;
      }

      reviewsList.insertAdjacentHTML(
        "beforeend",
        reviews.map(createReviewWidgetCard).join("")
      );

      totalReviewsLoaded += reviews.length;

      loaderEl.classList.remove("revShow");

      const reviewsCard = container.querySelector(".reviewPage__summaryContainer");
      reviewsCard.innerHTML = generateDynamicRatingBlock(totalReviewsAvailable, totalReviewsCount);

      initreviewMasonry(reviewsList);
      isLoading = false;

      document.querySelectorAll(".revshimmer").forEach(el => el.classList.remove("revshimmer"));
    }



    // Debounced scroll-based auto-load
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(async () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.offsetHeight;
        if (
          scrollPosition >= documentHeight - 400 &&
          !isLoading &&
          totalReviewsLoaded < totalReviewsCount
        ) {
          currentPage++;
          await renderAllReviews();
        }
      }, 200);
    }); 

    window.addEventListener("resize", () => initreviewMasonry(reviewsList));
    renderAllReviews();

    setTimeout(function(){
      document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
    },1000);


    const sortDropdown = document.querySelector('.reviewPage__actions .reviewPage__dropdownWrapper #reviewPageSort');
    if (sortDropdown) {
      sortDropdown.addEventListener('change', function () {
        currentSort = this.value;
        renderAllReviews(true,currentSort);
      });
    }

  // Styles
  const style = document.createElement("style");
  style.innerHTML = `
    .revsreviewPage__container {
      width: 90%;
      max-width: 1200px;
      margin: 2rem auto;
    }

    /* Summary Section */
    .revsreviewPage__summary {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      flex-wrap: wrap;
      margin-bottom:30px;
    }
    .revsreviewPage__summaryLeft {
      flex: 0 0 20%;
      max-width:20%;
    }
    .reviewPage__summaryContainer {
      flex: 0 0 50%;
      max-width:50%;
    }
    .reviewPage__actions {
      flex: 0 0 20%;
      max-width: 20%;
    }

    .revsreviewPage__ratingScore {
      font-size: 16px;
      font-weight: 600;
    }

    .revsreviewPage__bar {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 0.9rem;
    }

    .revsreviewPage__progress {
      flex: 1 1 0;
      height: 6px;
      background: #ffbf000f;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .revsreviewPage__progress div.fill {
      height: 100%;
      max-width: 100%;
      background: #FFBF00;
      border-radius: 20px;
      transition: width .3s ease;
      box-sizing: border-box;
      display: block;
    }

    .revsreviewPage__btnPrimary {
      background: black;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 0.7rem 1.5rem;
      cursor: pointer;
      font-weight: 600;
    }
    .reviewPage__actionsRight .reviewPage__dropdownWrapper select {
      padding: 10px 20px;
      font-size: 14px;
      background: transparent;
      cursor: pointer;
      position: relative;
      z-index: 1;
      border: 1px solid #eee;
    }
    .reviewPage__actionsRight .reviewPage__dropdownWrapper select:focus {
      outline-offset: 0 !important;
      outline: 0 !important;
      box-shadow: none;
    }

    /* Media Section */
    .revsreviewPage__media {
      margin-top: 2rem;
    }

    .revsreviewPage__photoStrip {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .revsreviewPage__reviewer span {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .revsreviewPage__reviewer {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .revsreviewPage__ReviewDate {
      font-size: 12px;
      color: #888;
      margin-bottom: 8px;
    }
    .revsreviewPage_reviewTitle h3 {
      font-size: 16px;
      margin: 5px 0;
    }
    .revsreviewPage__card .revsreviewPage__reviewBody p {
      margin: 0;
      font-size: 16px;
      letter-spacing: 0;
    }

    .revsreviewPage__summaryBars .revsreviewPage__count {
      font-size: 14px;
    }

    .revsreviewPage__photoStrip img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 5px;
    }

    .revsreviewPage__moreLink {
      font-size: 0.9rem;
      color: #555;
      text-decoration: none;
    }
    .revsreviewPage__cards{
      margin: 0 auto;
    }
    .revsreviewPage__card {
      width: 320px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }
    .revsreviewPage__card:hover { transform: translateY(-4px); }

    .revsreviewPage__cardHeader {
      text-align: center;
    }

    .revsreviewPage__verified {
      background: #000;
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 10px;
    }

    .revsreviewPage__image {
      width: 120px;
      height: auto;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
    .revshimmer {
      position: relative;
      background: linear-gradient(90deg,#e0e0e0 25%,#f0f0f0 50%,#e0e0e0 75%) !important;
      margin-bottom: 10px !important;
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
      color: transparent !important;      
      border-radius: 4px;                
      border-color: #e3e3e3;
      box-shadow: none;
    }
    /* Hide all images completely */
    .revshimmer img {
      opacity:0 !important;
    }

    /* Shimmer keyframes */
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
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
    .revsReviewPage__Loader{
      display:none;
    }
    .revsReviewPage__Loader.revShow{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .revsReviewPage__Loader .revTLoader {
      width: 48px;
      height: 48px;
      display: inline-block;
      position: relative;
    }
    .revsReviewPage__Loader .revTLoader::after,
    .revsReviewPage__Loader .revTLoader::before {
      content: '';  
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid #1f1f1f;
      position: absolute;
      left: 0;
      top: 0;
      animation: revanimloader 2s linear infinite;
    }
    .revsReviewPage__Loader .revTLoader::after {
      animation-delay: 1s;
    }

    @keyframes revanimloader {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    `;
    document.head.appendChild(style);
});