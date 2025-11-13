(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

	const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
	const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;

	const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);

	function createReviewCard(r) {
		const rating = Math.round(Number(r.product_store_rating) || 0);
		const date = new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
			<div class="revReviewDate">${date}</div>
			<div class="revs-rating-stars">${starsHTML(rating)}</div>
			<div class="revReviewTitle"><h3>${r.reviewTitle}</h3></div>
			<div class="review-body">${r.reviewBody || ""}</div>
		  </div>`;
	}

	async function initMasonry(list) {
		if (!window.Masonry) await loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js");
		if (!window.imagesLoaded) await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
		imagesLoaded(list, () => new Masonry(list, { itemSelector: ".review-item", gutter: 20, fitWidth: true }));
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

	async function fetchReviews({ brandId, productId, sortBy, order, page, limit }) {
    const baseURL = "https://revtrust-front.onrender.com";
    const url = new URL("/review-widget", baseURL);
		url.searchParams.set("brandId", brandId);
		if (productId) url.searchParams.set("productId", productId);
		if (sortBy) url.searchParams.set("sortBy", sortBy);
		if (order) url.searchParams.set("order", order);
		if (page) url.searchParams.set("page", page);
		if (limit) url.searchParams.set("limit", limit);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error("Failed to fetch reviews");
		const data = await res.json();
		return data?.data || [];
	}

  async function fetchReviewsTotal({ brandId, productId }) {
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
      if (data?.data) {
        totalReviews = data.data.length;
      }

      // Only set if parentContainer exists and totalReviews is a valid number
      if (Number.isFinite(totalReviews)) {
        return totalReviews;
      }else{
        return totalReviews;
      }

    }catch (error) {
      console.error("Error fetching total reviews:", error);
      return 0;
    }
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


  async function initContainer(container) {
    const brandId = container.getAttribute("data-brandid");
    const productId = container.getAttribute("data-product-id");
    if (!brandId) return;

    let totalReviewsCount = 0;

    if (container) {
      const brandId = container.dataset.brandid;
      const productId = container.dataset.productId;

      if (brandId) { // Make sure brandId exists
        if (productId) {
          totalReviewsCount = await fetchReviewsTotal({ brandId, productId });
        } else {
          totalReviewsCount = await fetchReviewsTotal({ brandId });
        }
      }
    }

 
    container.innerHTML = `
      <div class="revs-review-widget">
        <div class="revs-reviews-header">
          <div class="revs-reviewsInfoWrap">
            <div class="revs-rating-stars">${STAR_YELLOW.repeat(5)}</div>
            <span class="revs-review-count revshimmer">Reviews</span>
          </div>
          <div class="revs-reviewsFilterWrap">
            <button id="revs-rating-menu-filter" class="revshimmer">
              <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                <style>
                .s0 { fill: none;stroke: #000000;stroke-linecap: round;stroke-width: 1.3 } 
                </style>
                <path class="s0" d="m3.33 4.17h5m0 0c0 0.92 0.75 1.66 1.67 1.66 0.92 0 1.67-0.74 1.67-1.66m-3.34 0c0-0.92 0.75-1.67 1.67-1.67 0.92 0 1.67 0.75 1.67 1.67m0 0h5m-13.34 5.83h10m0 0c0 0.92 0.75 1.67 1.67 1.67 0.92 0 1.67-0.75 1.67-1.67 0-0.92-0.75-1.67-1.67-1.67-0.92 0-1.67 0.75-1.67 1.67zm-6.66 5.83h10m-10 0c0-0.92-0.75-1.66-1.67-1.66-0.92 0-1.67 0.74-1.67 1.66 0 0.92 0.75 1.67 1.67 1.67 0.92 0 1.67-0.75 1.67-1.67z"/>
              </svg>
            </button>
             <ul class="revs-filter-options" style="display:none;">
              <li class="revs-filter-value"><span class="revsSortingTitle">Sort By</span></li>
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
          </div>
        </div>
        ${(totalReviewsCount > 0) ? `<div class="revs-dropdown-reviews-summary">
          <div class="revs-dropdown-review-card"><div class="rating-header"> <div class="rating-overview"> <p class="out-pera revshimmer">5 out of 5 stars — Rated</p></div></div><div class="rating-bars"><div class="bar"><span class="label revshimmer">Excellent</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Very Good</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Average</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Poor</span><div class="progress"><div class="fill revshimmer" style="width:0.0%"></div></div> <span class="count revshimmer">0</span></div><div class="bar"><span class="label revshimmer">Terrible</span><div class="progress"><div class="fill revshimmer" style="width:0.0%"></div></div><span class="count revshimmer">0</span></div></div></div>
        </div>` : `<div class="revs-dropdown-reviews-summary"></div>` }
        <div class="revs-reviews-list"></div>
        <div class="revs-loadMoreWrap"><button class="revs-load-more-btn" style="display:none;">Load More Reviews</button></div>
      </div>`;

    const reviewsList = container.querySelector(".revs-reviews-list");
    const reviewCountEl = container.querySelector(".revs-review-count");
    const reviewsCard = container.querySelector('.revs-dropdown-review-card');
    const loadMoreBtn = container.querySelector(".revs-load-more-btn");

    let currentSort = "newest";
    let currentPage = 1;
    const pageSize = 5;
    let totalReviewsLoaded = 0;

    async function renderReviews(reset = false) {
      if (reset) {
        currentPage = 1;
        reviewsList.innerHTML = "";
        totalReviewsLoaded = 0;
        loadMoreBtn.style.display = "none";
      }

      const sortMapping = {
        newest: { sortBy: "createdAt", order: "desc" },
        oldest: { sortBy: "createdAt", order: "asc" },
        popular: { sortBy: "product_quality_rating", order: "desc" },
        rating_highest: { sortBy: "product_store_rating", order: "desc" },
        rating_lowest: { sortBy: "product_store_rating", order: "asc" },
      };

      const { sortBy, order } = sortMapping[currentSort] || {};
      const reviews = await fetchReviews({ brandId, productId, sortBy, order, page: currentPage, limit: pageSize });

      if (!reviews.length && totalReviewsLoaded === 0) {
        reviewsList.innerHTML = `<p>No reviews yet.</p>`;
        reviewCountEl.textContent = "No reviews";
        loadMoreBtn.style.display = "none";
        return;
      }

      reviewsList.insertAdjacentHTML("beforeend", reviews.map(createReviewCard).join(""));
      totalReviewsLoaded += reviews.length;

      
      // Show Load More only if there are more reviews
      loadMoreBtn.style.display = totalReviewsLoaded < totalReviewsCount ? "block" : "none";

      initMasonry(reviewsList);
      reviewCountEl.textContent = `${totalReviewsLoaded} Review${totalReviewsLoaded > 1 ? 's' : ''}`;
      if(reviewsCard){
        reviewsCard.innerHTML = generateDynamicRatingBlock(reviews, totalReviewsLoaded);
      }
      document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
    }

    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderReviews();
    });

    container.querySelectorAll(".revs-filter-options li button").forEach(btn => {
      btn.addEventListener("click", () => {
        currentSort = btn.getAttribute("data-option");
        container.querySelectorAll(".revs-filter-options li span").forEach(span => 
          span.classList.remove("rev-option-selected")
        );
        btn.querySelector("span")?.classList.add("rev-option-selected");
        renderReviews(true, currentSort);
        btn.closest('.revs-filter-options').style.display = 'none';
      });
    });

    // Initial load
    renderReviews();
  }

	function initAll() { document.querySelectorAll(".revs-review-widget-container").forEach(initContainer); }
	
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
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

	setTimeout(function(){
		document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
	},1000);

  // Add CSS
  const style = document.createElement("style");
  style.innerHTML = `
	.revs-review-widget { max-width: 1100px; margin: 0 auto; font-family: Arial, sans-serif; }
    .review-title { font-size: 22px; font-weight: 600; margin-bottom: 20px; text-align: center; }
    .revsPlaceholderhide{
      display:none;
    }
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
    .revReviewDate { font-size: 12px; color: #888; margin-bottom: 8px; }
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
      width: 250px;
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
      z-index:9;
    }
    .revs-review-widget-container ul.revs-filter-options li button {
      border: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: none;
      width: 100%;
      padding: 0 0 20px 0;
      color: #000000;
      font-size:14px;
    }
    .revs-review-widget-container ul.revs-filter-options button span {
      display: none;
    }
    .revs-review-widget-container ul.revs-filter-options button span.rev-option-selected {
      display: block;
    }
    .revFlex{
      display:flex;
      align-items: center;
      justify-content: space-between;
    }
    .revs-review-widget-container ul.revs-filter-options li.revs-filter-value span.revsSortingTitle {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 20px;
      display: block;
    }
    .revs-review-widget .revs-reviews-list .review-item .revReviewTitle h3 {
      font-size: 16px;
      margin-bottom: 5px;
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
  `;
  document.head.appendChild(style);

})();