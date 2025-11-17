(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

	const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
	const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;

	const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);

    // Pure JS check instead of jQuery: $('#revsBrandReviewWidget').length > 0
    const isBrandWidget = document.querySelector('#revsBrandReviewWidget') !== null;

	function createReviewCard(r) {
		const rating = Math.round(Number(r.product_store_rating) || 0);
		const date = new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        if(isBrandWidget){
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
                </div>`;
        }else{
            return `
                <div class="revsReviewItem">
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
                    <div class="review-body">${r.reviewContent || ""}</div>
                </div>`;
        }
		
	}

	async function initMasonry(list) {
		if (!window.Masonry) await loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js");
		if (!window.imagesLoaded) await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
        if(isBrandWidget){
            imagesLoaded(list, () => new Masonry(list, { itemSelector: ".revsreviewPage__card", gutter: 20, fitWidth: true }));
        }else{
            imagesLoaded(list, () => new Masonry(list, { itemSelector: ".revsReviewItem", gutter: 20, fitWidth: true }));
        }
		
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
                totalReviews = data.data;
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
        if(isBrandWidget){
            if (!reviews || reviews.length === 0) return `<div class="revsreviewPage__summaryBars"><div class="noReviews"><p>No reviews yet.</p></div>`;
        }else{
            if (!reviews || reviews.length === 0) return `<div class="rating-header"><div class="noReviews"><p>No reviews yet.</p></div>`;
        }
        

        const ratingCounts = {5:0,4:0,3:0,2:0,1:0};
        let totalRatingSum = 0, totalRatingCount = 0;

        reviews.forEach(review => {
            if(review.reviewStatus == 'ACTIVE'){
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

        if(isBrandWidget){
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

            return `<div class="revsreviewPage__summaryBars">${ratingBarsHTML}</div>`;
        }else{
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
        
    }


    async function initContainer(container) {
        const brandId = container.getAttribute("data-brandid");
        const productId = container.getAttribute("data-product-id");
        if (!brandId) return;

        let totalReviewsCount = 0; let totalReviewsAvailable = [];
       

        if (container) {
            const brandId = container.dataset.brandid;
            const productId = container.dataset.productId;

            if (brandId) { // Make sure brandId exists
                if (productId) {
                    totalReviewsAvailable = await fetchReviewsTotal({ brandId, productId });
                } else {
                    totalReviewsAvailable = await fetchReviewsTotal({ brandId });
                }
            }
        }

        totalReviewsCount = totalReviewsAvailable.length;

        if(isBrandWidget){
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
            
            async function renderAllReviews(reset = false, currentSort) {
                if (isLoading) return;
                isLoading = true;
                loaderEl.classList.add("revShow");

                if (reset) {
                    currentPage = 1;
                    reviewsList.innerHTML = "";
                    totalReviewsLoaded = 0;
                }

                const sortMapping = {
                    newest: { sortBy: "createdAt", order: "desc" },
                    oldest: { sortBy: "createdAt", order: "asc" },
                    popular: { sortBy: "product_quality_rating", order: "desc" },
                    rating_highest: { sortBy: "product_store_rating", order: "desc" },
                    rating_lowest: { sortBy: "product_store_rating", order: "asc" },
                };

                const { sortBy, order } = sortMapping[currentSort] || {};

                const reviews = await fetchReviews({ brandId, sortBy, order, page: currentPage, limit: pageSize });

                if (!reviews.length && totalReviewsLoaded === 0) {
                    reviewsList.innerHTML = "<p>No reviews yet.</p>";
                    loaderEl.classList.remove("revShow");
                    return;
                }

                reviewsList.insertAdjacentHTML(
                    "beforeend",
                    reviews.map(createReviewCard).join("")
                );

                totalReviewsLoaded += reviews.length;

                loaderEl.classList.remove("revShow");

                const reviewsCard = container.querySelector(".reviewPage__summaryContainer");
                reviewsCard.innerHTML = generateDynamicRatingBlock(totalReviewsAvailable, totalReviewsCount);

                initMasonry(reviewsList);
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
                    if (scrollPosition >= documentHeight - 400 && !isLoading && totalReviewsLoaded < totalReviewsCount) {
                        currentPage++;
                        await renderAllReviews();
                    }
                }, 200);
            }); 

            window.addEventListener("resize", () => initMasonry(reviewsList));
            renderAllReviews();

            const sortDropdown = document.querySelector('.reviewPage__actions .reviewPage__dropdownWrapper #reviewPageSort');
            if (sortDropdown) {
                sortDropdown.addEventListener('change', function () {
                    currentSort = this.value;
                    renderAllReviews(true,currentSort);
                });
            }

        }else{
            container.innerHTML = `<div class="revs-review-widget">
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
                ${(totalReviewsCount > 0) ? `<div class="revs-dropdown-reviews-summary"><div class="revs-dropdown-review-card"><div class="rating-header"> <div class="rating-overview"> <p class="out-pera revshimmer">5 out of 5 stars — Rated</p></div></div><div class="rating-bars"><div class="bar"><span class="label revshimmer">Excellent</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Very Good</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Average</span><div class="progress"><div class="fill revshimmer" style="width:33.3%"></div></div><span class="count revshimmer">1</span></div><div class="bar"><span class="label revshimmer">Poor</span><div class="progress"><div class="fill revshimmer" style="width:0.0%"></div></div> <span class="count revshimmer">0</span></div><div class="bar"><span class="label revshimmer">Terrible</span><div class="progress"><div class="fill revshimmer" style="width:0.0%"></div></div><span class="count revshimmer">0</span></div></div></div></div>` : `<div class="revs-dropdown-reviews-summary"></div>` }
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
        
    }

	function initAll() { 
        if(isBrandWidget){
            initContainer(document.getElementById('revsBrandReviewWidget'));
        }else{
            document.querySelectorAll(".revs-review-widget-container").forEach(initContainer); 
        }
        
    }
	
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
	else initAll();

    // Keep a reference to currently open dropdown (if any)
    let openDropdown = null;

    // Delegate click for toggle buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#revs-rating-menu-filter'); // ID selector here
        if (btn) {
            e.stopPropagation();

            const header = btn.closest('.revs-reviews-header');
            if (!header) return;
            const dropdown = header.querySelector('.revs-filter-options');
            if (!dropdown) return;

            // Close other dropdowns
            document.querySelectorAll('.revs-filter-options').forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });

            // Toggle this dropdown
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            openDropdown = isVisible ? null : dropdown;
            return;
        }

        // Close dropdown if clicking outside
        const clickedInsideDropdown = e.target.closest('.revs-filter-options');
        if (!clickedInsideDropdown) {
            document.querySelectorAll('.revs-filter-options').forEach(d => d.style.display = 'none');
            openDropdown = null;
        }
    });

	setTimeout(function(){
		document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
	},1000);


    // Add CSS
    const style = document.createElement("style");
    if(isBrandWidget){
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
                width:100%;
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
            @media only screen and (max-width: 991px) {
                .revsreviewPage__summaryLeft {
                    flex: 0 0 100%;
                    max-width: 100%;
                } 
                .reviewPage__summaryContainer {
                    flex: 0 0 60%;
                    max-width: 60%;
                }
                .reviewPage__actions {
                    flex: 0 0 35%;
                    max-width: 35%;
                }
            }
            @media only screen and (max-width: 480px) {
                .reviewPage__actions {
                    flex: 0 0 100%;
                    max-width: 100%;
                    margin-top: 10px;
                }
                .reviewPage__summaryContainer {
                    flex: 0 0 100%;
                    max-width: 100%;
                }
            }
            @media only screen and (max-width: 360px){
                .revsreviewPage__container .revsreviewPage__cards {
                    width: 100%;
                }
            }
            `;  
    }else{
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
            .revsReviewItem {
                width: 320px;
                margin-bottom: 20px;
                background: #fff;
                border-radius: 12px;
                padding: 18px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                transition: transform 0.2s ease;
            }
            .revsReviewItem:hover { transform: translateY(-4px); }
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
            .revs-review-widget .revs-reviews-list .revsReviewItem .reviewer {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .revs-review-widget .revs-reviews-list .revsReviewItem .reviewer span {
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
            .revs-review-widget .revs-reviews-list .revsReviewItem .revReviewTitle h3 {
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
            @media only screen and (max-width:360px){
                .revsReviewItem{
                    width: 100%;
                }
            }
        `;
    }
    document.head.appendChild(style);

})();