(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

	const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
	const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
    
	const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);


    // Pure JS check instead of jQuery: $('#revsBrandReviewWidget').length > 0
    const isBrandWidget = document.querySelector('#revsBrandReviewWidget') !== null;

	function createReviewCard(r) {
        console.log(r);
		const rating = Math.round(Number(r.product_store_rating) || 0);
		const date = new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        if(isBrandWidget){
            return `<div class="revsreviewPage__card"><div class="revsreviewPage__reviewer"><span class="revshimmer">${r.reviewerName || "Anonymous"}</span><span class="revshimmer"><svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20"><style>.s0 { fill: #000000 }</style><g><path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/></g></svg></span></div><div class="revsreviewPage__ReviewDate revshimmer">${date}</div><div class="revsreviewPage__stars revshimmer">${starsHTML(rating)}</div><div class="revsreviewPage_reviewTitle"><h3 class="revshimmer">${r.reviewTitle}</h3></div><div class="revsreviewPage__reviewBody"><p class="revshimmer">${r.reviewContent || ""}</p></div></div>`;
        }else{
            return `<div class="revsReviewItem"><div class="reviewer"><span>${r.reviewerName || "Anonymous"}</span><span><svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20"><style>.s0{fill:#000000}</style><g><path class="s0" d="m19.62 11.01c-0.33-0.64-0.33-1.4 0-2.04 0.53-1.03 0.19-2.29-0.78-2.91-0.6-0.39-0.98-1.05-1.02-1.77-0.06-1.15-0.98-2.07-2.13-2.13-0.72-0.04-1.38-0.42-1.77-1.02-0.63-0.97-1.88-1.31-2.91-0.78-0.64 0.32-1.4 0.32-2.04 0-1.03-0.53-2.29-0.19-2.91 0.78-0.39 0.6-1.05 0.98-1.77 1.02-1.15 0.06-2.07 0.98-2.13 2.13-0.04 0.72-0.42 1.38-1.02 1.77-0.97 0.62-1.31 1.88-0.78 2.9 0.32 0.65 0.32 1.41 0 2.05-0.53 1.03-0.19 2.28 0.78 2.91 0.6 0.39 0.98 1.05 1.02 1.77 0.06 1.15 0.98 2.07 2.13 2.13 0.72 0.04 1.38 0.42 1.77 1.02 0.62 0.97 1.88 1.3 2.9 0.78 0.65-0.33 1.41-0.33 2.05 0 1.03 0.52 2.28 0.19 2.91-0.78 0.39-0.6 1.05-0.98 1.77-1.02 1.15-0.06 2.07-0.98 2.13-2.13 0.04-0.72 0.42-1.38 1.02-1.77 0.97-0.63 1.3-1.88 0.78-2.91zm-11.4 3.65l-4.27-4.26 2.13-2.13 2.14 2.14 5.08-5.1 2.14 2.13z"/></g></svg></span></div><div class="revReviewDate">${date}</div><div class="revs-rating-stars">${starsHTML(rating)}</div><div class="revReviewTitle"><h3>${r.reviewTitle}</h3></div><div class="review-body">${r.reviewContent || ""}</div></div>`;
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
                totalReviews = data.data.reviews;
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

            if (productId && brandId) {
                totalReviewsAvailable = await fetchReviewsTotal({ brandId, productId });
            } else if(!productId && brandId) {
                totalReviewsAvailable = await fetchReviewsTotal({ brandId });
            }else{
                totalReviewsAvailable = await fetchReviewsTotal({ brandId });
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

                const data = await fetchReviews({ brandId, sortBy, order, page: currentPage, limit: pageSize });
                const reviews = data?.reviews || [];

                const data1 = await fetchReviews({ brandId, reviewStatus: "ACTIVE" });
                const reviews1 = data1?.reviews || [];

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
                reviewsCard.innerHTML = generateDynamicRatingBlock(reviews1, totalReviewsCount);

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
                const data = await fetchReviews({ brandId, productId, sortBy, order, page: currentPage, limit: pageSize });
                const reviews = data?.reviews || [];    

                const data1 = await fetchReviews({ brandId, productId, reviewStatus: "ACTIVE" });
                const reviews1 = data1?.reviews || []; 

                if (!reviews.length && totalReviewsLoaded === 0) {
                    reviewsList.innerHTML = `<p>No reviews yet.</p>`;
                    reviewCountEl.textContent = "No reviews";
                    loadMoreBtn.style.display = "none";
                    return;
                }

                reviewsList.insertAdjacentHTML("beforeend", reviews.map(createReviewCard).join(""));
                totalReviewsLoaded += reviews.length;

                totalReviewsInProduct = reviews1.length;
                
                // Show Load More only if there are more reviews
                loadMoreBtn.style.display = totalReviewsLoaded < totalReviewsCount ? "block" : "none";

                initMasonry(reviewsList);
                reviewCountEl.textContent = `${totalReviewsInProduct} Review${totalReviewsInProduct > 1 ? 's' : ''}`;
                if(reviewsCard){
                    reviewsCard.innerHTML = generateDynamicRatingBlock(reviews1, totalReviewsInProduct);
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


    function calculateOverallRating(reviews) {
        if (!reviews || reviews.length === 0) return 0;

        let ratingCounts = {5:0,4:0,3:0,2:0,1:0};
        let totalRatingSum = 0, totalRatingCount = 0;

        reviews.forEach(review => {
            if (review.reviewStatus === 'ACTIVE') {
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
                    if (rounded >= 1 && rounded <= 5) ratingCounts[rounded]++;
                    totalRatingSum += reviewAverage;
                    totalRatingCount++;
                }
            }
        });

        const overallRating = totalRatingCount ? totalRatingSum / totalRatingCount : 0;
        const roundedOverall = overallRating.toFixed(1);
        return Number(roundedOverall); // returns as number
    }

    // Generate flexible star fill HTML
    function flexibleStarsHTML(rating) {
        let html = "";

        for (let i = 0; i < 5; i++) {
            const percent = Math.min(100, Math.max(0, (rating - i) * 100));

            html += `
            <div class="rev-star">
                <div class="rev-star-base">${STAR_GRAY}</div>
                <div class="rev-star-fill" style="width:${percent}%;">
                    ${STAR_YELLOW}
                </div>
            </div>`;
        }

        return html;
    }

    async function createStarRatingWidget() {
        const el = document.querySelector('.revsStarRatingWidget');
        if (!el) return;

        const brandId = el.dataset.brandid;
        const productId = el.dataset.productId;
        const badgeType = el.dataset.badgeType;

        if (!brandId) return;

        const data = await fetchReviews({ brandId, productId });
        const reviews = data?.reviews || [];
        
        if (reviews.length > 0) {

            const avRating = parseFloat(calculateOverallRating(reviews));
            const tlReviews = reviews.length;

            let reviewTextHTML = '';

            if (badgeType === 'rating_with_review') {
                reviewTextHTML = `<span class="revs-badge__stars">${flexibleStarsHTML(avRating)}</span><span class="revs-review__text">${tlReviews} Review${tlReviews > 1 ? 's' : ''}</span>`;
            } else if (badgeType === 'review_only') {
                reviewTextHTML = `<span class="revs-review__text">${tlReviews} Reviews</span>`;
            } else if (badgeType === 'rating_with_avgrating') {
                reviewTextHTML = `<span class="revs-badge__stars">${flexibleStarsHTML(avRating)}</span><span class="revs-review__text"> ${avRating}</span>`;
            }else{
                reviewTextHTML = `<span class="revs-badge__stars">${flexibleStarsHTML(avRating)}</span>`;
            }

            el.innerHTML = `
                <div class="revs-badge">
                    ${reviewTextHTML}
                </div>`;
        }

        document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
    }

    createStarRatingWidget();


	setTimeout(function(){
		document.querySelectorAll('.revshimmer').forEach(el => el.classList.remove('revshimmer'));
	},1000);

})();