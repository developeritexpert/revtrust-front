(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

    const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
    const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
  
    const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);


    async function fetchBrands({ name, brandId }) {
        const baseURL = "https://revtrust-front.onrender.com";
        const url = new URL("/brand-widget", baseURL);
        if(name) url.searchParams.set("name", name);
        if (brandId) url.searchParams.set("brandId", brandId);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        return data?.data || [];
    }

    async function fetchReviews({ brandId, productId, sortBy, order, page, limit, status }) {
        const baseURL = "https://revtrust-front.onrender.com";
        const url = new URL("/review-widget", baseURL);
        if (brandId) url.searchParams.set("brandId", brandId);
		if (productId) url.searchParams.set("productId", productId);
		if (sortBy) url.searchParams.set("sortBy", sortBy);
		if (order) url.searchParams.set("order", order);
		if (page) url.searchParams.set("page", page);
		if (limit) url.searchParams.set("limit", limit);
        if(status) url.searchParams.set("status", status);
        
		const res = await fetch(url.toString());
		if (!res.ok) throw new Error("Failed to fetch reviews");
		const data = await res.json();
        return data?.data || [];
	}

    async function addBrands(formData) {
        const res = await fetch("https://revtrust-front.onrender.com/brand-widget", {
            method: "POST",
            body: formData
        });

        const result = await res.json();
        if (!res.ok) {
            const err = result?.message || JSON.stringify(result);
            throw new Error("Request failed: " + err);
        }

        return result;
    }

    async function addReviews(formData) {
        const res = await fetch("https://revtrust-front.onrender.com/review-widget", {
            method: "POST",
            body: formData
        });

        const result = await res.json();
        if (!res.ok) {
            const err = result?.message || JSON.stringify(result);
            throw new Error("Request failed: " + err);
        }

        return result;
    }


    const form = document.querySelector('#brandform');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const responseMsg = document.querySelector('.responseMessage');
            if (responseMsg) responseMsg.innerHTML = '';

            const requiredFields = ['name', 'email', 'postcode', 'websiteUrl', 'logoUrl'];
            let isValid = true;

            requiredFields.forEach(id => {
                const field = document.getElementById(id);
                if (!field) return;

                field.style.borderColor = '';

                if (field.type === 'file') {
                    if (field.files.length === 0) {
                        field.style.borderColor = 'red';
                        isValid = false;
                    }
                } else if (field.value.trim() === '') {
                    field.style.borderColor = 'red';
                    isValid = false;
                }
            });

            if (!isValid) {
                responseMsg.innerHTML = `<p style="color:red;">Please fill in all required fields.</p>`;
                return;
            }

            const formData = new FormData(form);

            try {
                // Correct function call
                const result = await addBrands(formData);

                // Backend validation error passthrough
                if (result?.statusCode === 400) {
                    const errorMsg =
                        result?.validation?.body?.message ||
                        result?.message ||
                        "Validation failed.";
                    responseMsg.innerHTML = `<p style="color:red;">${errorMsg}</p>`;
                    return;
                }

                // Success block
                responseMsg.innerHTML = `<p style="color:green;">${result.message || 'Brand added successfully!'}</p>`;
                form.reset();

            } catch (error) {
                console.error("Error:", error);

                // Extract desc from nested JSON string
                let desc = "Something went wrong. Please try again.";

                try {
                    // Match inner JSON: {...}
                    const jsonMatch = error.message.match(/\{.*\}/);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]); // outer JSON

                        if (parsed.error) {
                            // extract the inner JSON inside error string
                            const innerMatch = parsed.error.match(/\{.*\}/);
                            if (innerMatch) {
                                const innerParsed = JSON.parse(innerMatch[0]);
                                if (innerParsed.desc) desc = innerParsed.desc;
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Failed to parse error:", e);
                }

                responseMsg.innerHTML = `<p style="color:red;">${desc}</p>`;
            }
        });
    }


    function initBrandSearch({ inputId, resultsId, wrapperClass }) {

        const inputBox = document.getElementById(inputId);
        const resultsDiv = document.getElementById(resultsId);
        const inputBoxParent = document.querySelector(`.${wrapperClass}`);

        let debounceTimer;

        if (!inputBox || !resultsDiv) return;

        /* -------------------- INPUT EVENT -------------------- */
        inputBox.addEventListener('input', function (e) {
            const value = e.target.value.trim();
            clearTimeout(debounceTimer);

            if (value.length === 0) {
            resultsDiv.innerHTML = '';
            return;
            }

            resultsDiv.style.display = 'block';

            debounceTimer = setTimeout(() => {
            fetchBrandSuggestions(value);
            }, 400);
        });

        
        /* -------------------- UTILITY FUNCTION -------------------- */
        function isInsideInputOrResults(node) {
            if (!node) return false;
            return (
            inputBox.contains(node) ||
            resultsDiv.contains(node) ||
            inputBoxParent.contains(node)
            );
        }


        /* -------------------- SHOW/HIDE HANDLERS -------------------- */
        inputBoxParent.addEventListener('mouseleave', (e) => {
            const movedTo = e.relatedTarget;
            if (isInsideInputOrResults(movedTo)) return;

            setTimeout(() => {
                if (!resultsDiv.matches(':hover') && !inputBox.matches(':hover')) {
                    resultsDiv.style.display = 'none';
                }
            }, 100);
        });

        inputBoxParent.addEventListener('mouseenter', () => {
            if (resultsDiv.innerHTML.trim() !== '') {
                resultsDiv.style.display = 'block';
            }
        });

        resultsDiv.addEventListener('mouseleave', (e) => {
            const movedTo = e.relatedTarget;
            if (isInsideInputOrResults(movedTo)) return;

            setTimeout(() => {
                if (!resultsDiv.matches(':hover') && !inputBox.matches(':hover')) {
                    resultsDiv.style.display = 'none';
                }
            }, 100);
        });

        resultsDiv.addEventListener('mouseenter', () => {
            if (resultsDiv.innerHTML.trim() !== '') {
                resultsDiv.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!isInsideInputOrResults(e.target)) {
                resultsDiv.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                resultsDiv.style.display = 'none';
            }
        });


        /* -------------------- MAIN FETCH FUNCTION -------------------- */
        async function fetchBrandSuggestions(name) {
            try {
                resultsDiv.innerHTML = `<div class="search-box-sec"><p class="resultsLoading">Loading...</p></div>`;
                const brands = await fetchBrands({ name })
                console.log(brands);

                if (brands.length === 0) {
                    resultsDiv.innerHTML =
                        `<div class="search-box-sec"><h4 class="noDataBrand">No brands found matching your search.</h4></div>`;
                    return;
                }

                /* ---- Fetch reviews for each brand ---- */
                const reviewPromises = brands.map(brand => {
                    const baseURL = "https://revtrust-front.onrender.com";
                    const reviewUrl = new URL("/brand-widget", baseURL);
                    reviewUrl.searchParams.set("brandId", brand.id);
                    reviewUrl.searchParams.set("status", "ACTIVE");

                    return fetch(reviewUrl.toString())
                        .then(res => res.json())
                        .then(reviewData => {
                            let totalReviews = brand.totalReviews
                            let overallRating = 0;

                            let ratingClass = "green";
                            if (totalReviews > 0) {
                                overallRating = brand.averageRating;
                                if (overallRating < 1.5) ratingClass = "red";
                                else if (overallRating < 2.5) ratingClass = "orange";
                                else if (overallRating < 4) ratingClass = "yellow";
                                else if (overallRating < 4.5) ratingClass = "light-green";
                            }

                            return { brand, overallRating, totalReviews, ratingClass };
                        })
                        .catch(() => ({
                            brand,
                            overallRating: 0,
                            totalReviews: 0,
                            ratingClass: "green"
                        }));
                });

                const brandData = await Promise.all(reviewPromises);

                /* ---- Build HTML ---- */
                const html = `
                    <div class="search-box-sec">
                        <div class="nike-sec">
                            <div class="top-nike-side">
                                <h5>Brands</h5>
                                ${brandData
                                    .map(({ brand, overallRating, totalReviews, ratingClass }) => {
                                        const encodedName = btoa(brand.name || "");
                                        const encodedID = btoa(brand.id);

                                        return `
                                            <div class="review-side-item">
                                                <a class="brandUrl" href="/pages/review?name=${encodedName}&id=${encodedID}">
                                                    <div class="review-side">
                                                        <div class="left-review">
                                                            ${
                                                                brand.logoUrl
                                                                    ? `<div class="img-review"><img src="${brand.logoUrl}"></div>`
                                                                    : `<div class="img-review"><img src="https://cdn.shopify.com/s/files/1/0973/5015/6618/files/dummylogo-1.png?v=1761740004"></div>`
                                                            }
                                                            <div class="content-review">
                                                                <h6>${brand.name}</h6>
                                                                <p class="recomInfo">
                                                                    ${
                                                                        brand.websiteUrl
                                                                            ? `<span>${brand.websiteUrl}</span>`
                                                                            : ""
                                                                    }
                                                                    ${
                                                                        totalReviews
                                                                            ? `<span class="recomDot"> • </span><span>${totalReviews} reviews</span>`
                                                                            : ""
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div class="right-review ${ratingClass}">
                                                            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                                                                <path d="M9.88 6.225H16l-4.929 3.504-3.047 2.149-4.953 3.504L4.952 9.73 0 6.225h6.119L8 .572l1.881 5.653Z"></path>
                                                            </svg>
                                                            <span>${overallRating ? overallRating.toFixed(1) : "5.0"}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>`;
                                    })
                                    .join("")}
                            </div>
                        </div>
                    </div>`;

                resultsDiv.innerHTML = html;
            } catch (error) {
                console.error("Error fetching brand data:", error);
                resultsDiv.innerHTML = `<div class="search-box-sec"><p style="color:red;">Error fetching data. Please try again.</p></div>`;
            }
        }

    }


    initBrandSearch({
        inputId: "search_brand",
        resultsId: "brandResults",
        wrapperClass: "brandSearchInner"
    });


    // === HELPER FUNCTIONS ===
    function getStarsHTML(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const partial = rating - fullStars;

        for (let i = 1; i <= 5; i++) {
            let fillPercent = 0;
            if (i <= fullStars) {
                fillPercent = 100;
            } else if (i === fullStars + 1 && partial > 0) {
                fillPercent = Math.round(partial * 100);
            }
            starsHTML += getStarSVG(fillPercent, 16, 15);
        }

        return `<div class="rating-stars">${starsHTML}</div>`;
    }

    function getBigStarsHTML(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const partial = rating - fullStars;

        for (let i = 1; i <= 5; i++) {
            let fillPercent = 0;
            if (i <= fullStars) {
            fillPercent = 100;
            } else if (i === fullStars + 1 && partial > 0) {
            fillPercent = Math.round(partial * 100);
            }

            starsHTML += getStarSVG(fillPercent, 26, 25, true);
        }

        return `<div class="rating-stars big">${starsHTML}</div>`;
    }

    // === REUSABLE SVG FUNCTION ===

    function getStarSVG(fillPercent, width, height, isBig = false) {
        const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
        const starPath = isBig
            ? `M12.6432 0L15.6279 9.18585H25.2865L17.4725 14.863L20.4572 24.0489L12.6432 18.3717L4.8293 24.0489L7.81396 14.863L1.43051e-05 9.18585H9.65858L12.6432 0Z`
            : `M7.6084 0L9.40451 5.52786H15.2168L10.5146 8.94427L12.3107 14.4721L7.6084 11.0557L2.90612 14.4721L4.70223 8.94427L-5.38826e-05 5.52786H5.81229L7.6084 0Z`;

        return `
            <span class="star${isBig ? ' bigStar' : ''}">
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <linearGradient id="${gradientId}">
                    <stop offset="0%" stop-color="#f58723"/>
                    <stop offset="${fillPercent}%" stop-color="#f58723"/>
                    <stop offset="${fillPercent}%" stop-color="#d9d9d9"/>
                    <stop offset="100%" stop-color="#d9d9d9"/>
                </linearGradient>
                </defs>
                <path d="${starPath}" fill="url(#${gradientId})"/>
            </svg>
            </span>
        `;
    }

    function generateDynamicRatingBlock(reviews, totalreviews) {
        if (!reviews || reviews.length === 0) return `<div class="rating-header"><div class="rating-sec"><h3>Ratings</h3></div><div class="noReviews"><p>No reviews yet.</p></div>`;

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
            <div class="rating-sec"><h3>Ratings</h3></div>
            <div class="rating-overview">
                <div class="Reviews-star">
                ${getStarsHTML(overallRating)}
                <p>${totalReviews} Reviews</p>
                </div>
                <p class="out-pera">${roundedOverall} out of 5 stars — Rated ${
                    roundedOverall >= 4.5 ? 'Excellent' :
                    roundedOverall >= 4 ? 'Very Good' :
                    roundedOverall >= 3 ? 'Average' :
                    roundedOverall >= 2 ? 'Poor' : 'Terrible'
                }</p>
            </div>
            </div>
            <div class="rating-bars">${ratingBarsHTML}<a class="add-review-btn">Add Review</a></div>
        `;
    }


    // === PAGINATION HANDLER ===
    function renderPagination(pagination) {
        const { totalPages, page } = pagination || {};
        if (!totalPages || totalPages <= 1) return '';

        let pagesHTML = '';
        for (let i = 1; i <= totalPages; i++) {
        pagesHTML += `<a href="#" class="page-num ${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
        }

        return `
        <div class="pagination-sec">
            <div class="pagination-container">
            ${page === 1 ? `<span class="prev disabled" data-page="${page - 1}">Previous</span>` : ` <a href="#" class="prev" data-page="${page - 1}">Previous</a>`}
            <div class="page-numbers">${pagesHTML}</div>
            ${page === totalPages ? `<span class="next disabled" data-page="${page + 1}">Next</span>` : ` <a href="#" class="next" data-page="${page + 1}">Next</a>`}
            </div>
        </div>
        `;
    }

    (async () => {

        // === FETCH AND RENDER DATA ===
        const pageUrl = window.location.href;
        let params = new URLSearchParams(window.location.search);
        let encodedName = ''; let encodedID = '';
        if(params){
            encodedName = pageUrl.includes('pages/write-a-review') ? params.get('brand') : params.get('name');
            encodedID = params.get('id');
        }

        try {
            let decodedName = ''; let decodedID = '';
            if(encodedName != '' && encodedName != 'undefined' && encodedName != null){
                decodedName = atob(encodedName);
            }

            if(encodedID != '' && encodedID != 'undefined' && encodedID != null){
                decodedID = atob(encodedID);
            }

            if (!decodedID || decodedID ==='undefined' || decodedID == null) throw 'Invalid brand name';

            const brand = await fetchBrands({brandId:decodedID});

            if (brand.length === 0) return;

            const brandInput = document.getElementById('brandId');
            if (brandInput) {
                brandInput.value = decodedID;
            }

            const data = await fetchReviews({brandId:decodedID,status:'ACTIVE'});
            const reviews = data.reviews;

            const data1 = await fetchReviews({
                brandId: decodedID,
                limit: 10,
                status: 'ACTIVE'
            });
            const reviews1 = data1.reviews

            const pagination = data1?.pagination || [];

            let totalReviews = reviews.length;
            let overallRating = 0;

            if (totalReviews > 0) {
                if(brand.ratingSummary){
                    overallRating = brand.ratingSummary.averageRating;
                }
            }


            // Optional: round to 1 decimal place
            overallRating = overallRating.toFixed(1);

            // === WRITE-A-REVIEW PAGE ===
            if (pageUrl.includes('pages/write-a-review')) {
                if(!params.has('brand') && !encodedName){
                    if (!Shopify.designMode){
                    window.location.href = '/';
                    }
                }
                const resultsDivLeft = document.querySelector('.lft_nike');
                const resultsDivRight = document.querySelector('.rgt_nike');
                const reviewSidebar = document.querySelector('.reviewSideBar');

                resultsDivLeft.innerHTML = `
                    <div class="img_nke_img">
                    <img src="${brand.logoUrl || 'https://cdn.shopify.com/s/files/1/0973/5015/6618/files/dummylogo-1.png?v=1761740004'}" alt="${brand.name}" />
                    </div>
                    <div class="hd_lfnik">
                    <h4>${brand.name || 'Unnamed Brand'}</h4>
                    ${brand.websiteUrl ? `<p class="brandWebUrl"><a href="${brand.websiteUrl}" target="_blank">${brand.websiteUrl}</a></p>` : ''}
                    </div>
                `;


                resultsDivRight.innerHTML = `<ul>${(overallRating > 0) ? `<li><h6>${overallRating}</h6></li>${getStarsHTML(overallRating)}` : ''} ${totalReviews ? `<li><p class="review_para">${totalReviews} Reviews</p></li>`: `<li>No reviews yet.</li>`}</ul>`;
                    
                reviewSidebar.innerHTML = `
                    <div class="rgt_start_review">
                    ${(reviews.length > 0) ? `<div class="hding_rgtrtar">
                        <h3 class="blck">Recent Reviews of This Website</h3>
                    </div>
                    <div class="rgt_reviwboxotr">
                        ${reviews.slice(0, 3).map(r => {
                        const avgRating = brand.averageRating;

                        return `
                            <div class="inside_rgtriew">
                            <h6 class="blck">${r.reviewTitle || 'Nice!'}</h6>
                            <div class="reiw_starul">
                                <ul>
                                ${avgRating ? `<li>${getStarsHTML(avgRating)}<p>${avgRating} out of 5 stars</p></li>` : ''}
                                </ul>
                            </div>
                            <div class="cont_rew">
                                ${r.reviewContent || "No review text provided."}
                            </div>
                            </div>
                        `;
                        }).join('')}

                    </div>` : `<div class="hding_rgtrtar"><h3 class="blck">Recent Reviews of This Website</h3><div class="rgt_reviwboxotr"><p>No reviews yet.</p></div></div>`}
                    </div>`;

            // === REVIEW PAGE ===
            } else if (pageUrl.includes('/pages/review')) {
                if(!params.has('name') && !encodedName){
                    if (!Shopify.designMode){
                    window.location.href = '/';
                    }
                }
                const resultsDiv = document.querySelector('.nke_hd_contnt');
                const conDiv = document.querySelector('.cont_start');
                const sidebarContainer = document.querySelector('.brandReviewSidebarWrap');

                // Brand list
                resultsDiv.innerHTML = `
                    <div class="img_nke_img">
                    <img src="${brand.logoUrl || 'https://cdn.shopify.com/s/files/1/0973/5015/6618/files/dummylogo-1.png?v=1761740004'}" alt="${brand.name}" />
                    </div>
                    <div class="otr_rwet">
                    <div class="nke_contntbox">
                        <h4>${brand.name || 'Unnamed Brand'}</h4>
                        ${brand.websiteUrl ? `<p class="brandWebUrl"><a href="${brand.websiteUrl}" target="_blank">${brand.websiteUrl}</a></p>` : ''}
                    </div>
                    <div class="reiwpge_hdbox">
                        <ul>
                        ${(overallRating > 0) ? `<li><h6>${overallRating}</h6></li>${getStarsHTML(overallRating)}` : ''}
                        ${(totalReviews > 0) ? `<li><p class="review_para">${totalReviews} Reviews</p></li>` : ''}
                        </ul>
                    </div>
                    </div>
                `;


                // Contact section
                conDiv.innerHTML = `
                    <div class="contbtn">
                    <a href="mailto:${brand.email || '#'}" class="cta contbtn-sec">Contact ${brand.name || 'Brand'}</a>
                    </div>
                    <div class="gt_start">
                    <a href="#" class="cta_scnd contbtn-sec">Get Started</a>
                    </div>
                    <div class="net_wrk">
                    <a href="${brand.websiteUrl || '#'}">
                        <img src="https://cdn.shopify.com/s/files/1/0973/5015/6618/files/network_website.png?v=1761733601" alt="${brand.name || 'Brand'}" />
                    </a>
                    <a href="${brand.websiteUrl || '#'}">Visit Website</a>
                    </div>
                `;


                // Reviews container
                const allReviewsContainer = document.querySelector('.brandAllReviews');
                allReviewsContainer.innerHTML = `
                    <div class="leftrvw_custmor">
                    <div class="hd_rgtcst"><h2 class="blck"><span>${totalReviews}</span> Reviews From Our Customers</h2></div>
                    <div class="shre_thrgbox"><p>Share Your Thoughts</p><div class="throg_box"><button type="button" class="cta throg_box_btn leaveReview">Leave a Review</button></div></div>
                    
                    ${(reviews.length > 0) ? `<div class="sort-dropdown">
                        <label for="sort">Sort By:</label>
                        <select id="sort" name="sort">
                        <option value="newest" selected="">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        </select>
                    </div>`: ''}
                    
                    <div class="revire_otrbox">
                        ${reviews1.map(r => {
                        // const reviewCount = emailCounts[r.email?.toLowerCase() || 'unknown'] || 1;
                        const reviewCount = r.totalReviewsByEmail;
                        return `
                            <div class="inside_revew">
                                <div class="otr_padrevw">
                                    <div class="recw_insidehd">
                                    <div class="ins_recw_insild">
                                        <div class="hd_rgtbx"><span>${r.reviewerName.charAt(0)}</span></div>
                                        <div class="rgt_hdcont duble-side-sec">
                                        <div class="content-rgt-side">
                                            <h6>${r.reviewerName || 'Anonymous'}</h6>
                                            <ul><li>${reviewCount} review${reviewCount > 1 ? 's' : ''}</li></ul>
                                        </div>
                                        <div class="img-rgt-side">
                                            <img src="https://cdn.shopify.com/s/files/1/0973/5015/6618/files/verified-img.png?v=1762433209" alt="">
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div class="product_resp">
                                    <ul>
                                        ${r.product_store_rating > 0 ? `<li>${getStarsHTML(r.product_store_rating)}<p>Product and Store Experience</p></li>` : ''}
                                        ${r.seller_rating > 0 ? `<li>${getStarsHTML(r.seller_rating)}<p>Responsive and Helpful</p></li>` : ''}
                                        ${r.product_price_rating > 0 ? `<li>${getStarsHTML(r.product_price_rating)}<p>Value for Price</p></li>` : ''}
                                    </ul>
                                    </div>
                                    <div class="star_finalyy">
                                    ${getBigStarsHTML(r.product_store_rating || 0)}
                                    <div class="starfinly_cont">
                                        <p class="outr_starfl">"${r.reviewTitle}"</p>
                                        <p class="star_finlycont">${r.reviewContent}</p>
                                    </div>
                                    <div class="oct_tmbtnotr">
                                        <ul>
                                        <li>${new Date(r.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}</li>
                                        <li>Unprompted review</li>
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>

                    <div class="pagination-wrapper">${renderPagination(pagination)}</div>
                </div>`;

                // Sidebar
                sidebarContainer.innerHTML = `
                    <div class="rgtrvw_custmor">
                    <div class="review-card top-card">
                        <div class="rating-sec"><h3>Ratings & Reviews</h3></div>
                        <div class="rating-score">
                        <div class="rating-span">
                            ${(overallRating > 0) ? `<h3>${overallRating}</h3>${getStarsHTML(overallRating)}`: '<p>No reviews yet.</p>'}
                        </div>
                        ${totalReviews ? `<p>Based On <a href="#">${totalReviews} Reviews</a></p>`: ''}
                        </div>
                    </div>
                    <div class="logo-card"><img src="https://revstrust.myshopify.com/cdn/shop/files/Ravtrust-logo_large.png?v=1761305780" alt="RevTrust Logo"></div>
                    <div class="review-card">${generateDynamicRatingBlock(reviews, totalReviews)}</div>
                </div>`;
            }

        } catch (error) {
            console.log('Error:', error);
            if(pageUrl.includes('pages/review') || pageUrl.includes('pages/write-a-review')){
                if(!params.has('brand') && !encodedName){
                    if (!Shopify.designMode){
                    window.location.href = '/';
                    }
                }
            }
        }

        const sortSelect = document.querySelector('.brandAllReviews .sort-dropdown #sort');
        let brandID = atob(encodedID);
        if (sortSelect) {
            sortSelect.addEventListener('change', async function() {
            const option = this.value;
            let orderby = '';
            let sortby = '';
            const reviewsContainer = document.querySelector('.revire_otrbox');

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
                } else if (option === 'rating') {
                    sortby = 'product_store_rating';
                    orderby = 'desc';
                }

                try {

                    const data = await fetchReviews({
                        brandId: brandID,
                        limit: 10,
                        sortBy: sortby,
                        order:orderby,
                        status: 'ACTIVE'
                    });

                    const reviews = data?.reviews || [];
                    const pagination = data?.pagination || [];

                    if (reviewsContainer) {

                        if (reviews.length > 0) {
                        reviewsContainer.innerHTML = `
                            ${reviews.map(r => `
                            <div class="inside_revew">
                                <div class="otr_padrevw">
                                <div class="recw_insidehd">
                                    <div class="ins_recw_insild">
                                    <div class="hd_rgtbx"><span>${r.reviewerName ? r.reviewerName.charAt(0) : ''}</span></div>
                                    <div class="rgt_hdcont duble-side-sec">
                                        <div class="content-rgt-side">
                                        <h6>${r.reviewerName || 'Anonymous'}</h6>
                                        <ul>
                                            <li>1 review</li>
                                        </ul>
                                        </div>
                                        <div class="img-rgt-side">
                                        <img src="https://cdn.shopify.com/s/files/1/0973/5015/6618/files/verified-img.png?v=1762433209" alt="">
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div class="product_resp">
                                    <ul>
                                    ${r.product_store_rating > 0 ? `<li>${getStarsHTML(r.product_store_rating)}<p>Product and Store Experience</p></li>` : ''}
                                    ${r.seller_rating > 0 ? `<li>${getStarsHTML(r.seller_rating)}<p>Responsive and Helpful</p></li>` : ''}
                                    ${r.product_price_rating > 0 ? `<li>${getStarsHTML(r.product_price_rating)}<p>Value for Price</p></li>` : ''}
                                    </ul>
                                </div>
                                <div class="star_finalyy">
                                    ${getBigStarsHTML(r.product_store_rating || 0)}
                                    <div class="starfinly_cont">
                                    <p class="outr_starfl">"${r.reviewTitle || ''}"</p>
                                    <p class="star_finlycont">${r.reviewContent || ''}</p>
                                    </div>
                                    <div class="oct_tmbtnotr">
                                    <ul>
                                        <li>${new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                                        <li>Unprompted review</li>
                                    </ul>
                                    </div>
                                </div>
                                </div>
                            </div>
                            `).join('')}
                        `;
                        } else {
                            reviewsContainer.innerHTML = `<p class="no-reviews">No reviews found for this brand.</p>`;
                        }
                        setTimeout(function(){
                            document.querySelectorAll('.shimmer-active').forEach(el => el.classList.remove('shimmer-active'));
                        },1500);
                    }

                    } catch (error) {
                        console.log('Error fetching sorted reviews:', error);
                    }
                }
            });
        }

        // === REMOVE SHIMMER AFTER LOAD ===
        document.querySelectorAll('.shimmer-active').forEach(el => el.classList.remove('shimmer-active'));


        document.addEventListener('click', async function(e) {
            const pageLink = e.target.closest('.pagination-container a[data-page]');
            const container = e.target.closest('.leftrvw_custmor');
            if (container) {
                const selectors = [
                    'span',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'li', 'p',
                    '.fill',
                ];
            
                container.querySelectorAll(selectors.join(',')).forEach(el => {
                    el.classList.add('shimmer-active');
                });
            }

            if (!pageLink || pageLink.classList.contains('disabled')) return;
            e.preventDefault();

            const selectedPage = parseInt(pageLink.dataset.page);
            if (isNaN(selectedPage) || selectedPage <= 0) return;

            try {
                const data = await fetchReviews({
                    brandId: brandID,
                    limit: 10,
                    page: selectedPage,
                    status: 'ACTIVE'
                });

                const reviews = data?.reviews || [];
                const pagination = data?.pagination || {};

                const reviewsContainer = document.querySelector('.revire_otrbox');
                const paginationContainer = document.querySelector('.pagination-wrapper');
                if (reviewsContainer) {
                    reviewsContainer.innerHTML = `
                    ${reviews.map(r => `<div class="inside_revew">
                    <div class="otr_padrevw">
                        <div class="recw_insidehd">
                        <div class="ins_recw_insild">
                            <div class="hd_rgtbx"><span>${r.reviewerName.charAt(0)}</span></div>
                            <div class="rgt_hdcont duble-side-sec">
                            <div class="content-rgt-side">
                                <h6>${r.reviewerName || 'Anonymous'}</h6>
                                <ul>
                                <li>1 review</li>
                                </ul>
                            </div>
                            <div class="img-rgt-side">
                                <img src="https://cdn.shopify.com/s/files/1/0973/5015/6618/files/verified-img.png?v=1762433209" alt="">
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="product_resp">
                        <ul>
                            ${r.product_store_rating>0?`<li>${getStarsHTML(r.product_store_rating)}<p>Product and Store Experience</p></li>`:''}
                            ${r.seller_rating>0?`<li>${getStarsHTML(r.seller_rating)}<p>Responsive and Helpful</p></li>`:''}
                            ${r.product_price_rating>0?`<li>${getStarsHTML(r.product_price_rating)}<p>Value for Price</p></li>`:''}
                        </ul>
                        </div>
                        <div class="star_finalyy">
                        ${getBigStarsHTML(r.product_store_rating || 0)}
                        <div class="starfinly_cont">
                            <p class="outr_starfl">"${r.reviewTitle}"</p>
                            <p class="star_finlycont">${r.reviewContent}</p>
                        </div>
                        <div class="oct_tmbtnotr"><ul><li>${new Date(r.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}</li><li>Unprompted review</li></ul></div>
                        </div>
                    </div>
                    </div>`).join('')} `;
                }

                if(paginationContainer){
                    paginationContainer.innerHTML = renderPagination(pagination);
                }

                document.querySelectorAll('.shimmer-active').forEach(el => el.classList.remove('shimmer-active'));
                
                const targetSection = document.querySelector('.brandAllReviews');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            } catch (error) {
                console.error('Pagination fetch error:', error);
            }
        });
    })();
  

    const params = new URLSearchParams(window.location.search);
    const encodedName = params.get('brand');
    const encodedID = params.get('id');

    const Reviewform = document.querySelector('#reviewForm');
    if (Reviewform) {

        // Select all checkboxes inside #reviewForm with class .custom-checkbox
        document.querySelectorAll('#reviewForm .custom-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('click', function() {
                if (this.checked) {
                this.value = true;
                } else {
                this.value = false;
                }
            });
        });


        Reviewform.addEventListener('submit', async function (e) {
            e.preventDefault();

            const responseMsg = document.querySelector('.responseMessage');
            if (responseMsg) responseMsg.innerHTML = '';

            const requiredFields = ['reviewTitle', 'reviewBody', 'name', 'email', 'term_and_condition', 'privacy_policy' ];
            let isValid = true;

            requiredFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) field.style.borderColor = '';
                if (field) {
                    if (field.type === 'file' && field.files.length === 0) {
                        field.style.borderColor = 'red';
                        isValid = false;
                    } else if (field.value.trim() === '') {
                        field.style.borderColor = 'red';
                        isValid = false;
                    }
                }
            });

            if (!isValid) {
                if (responseMsg) responseMsg.innerHTML = `<p style="color:red;">Please fill in all required fields.</p>`;
                return;
            }

            const formData = new FormData(Reviewform);

            try {
                // Correct function call
                const result = await addReviews(formData);

                // Backend validation error passthrough
                if (result?.statusCode === 400) {
                    const errorMsg =
                        result?.validation?.body?.message ||
                        result?.message ||
                        "Validation failed.";
                    responseMsg.innerHTML = `<p style="color:red;">${errorMsg}</p>`;
                    return;
                }

                // Success block
                responseMsg.innerHTML = `
                    <p style="color:green;">
                    ${result.message || 'Review added successfully!'}
                    <a class="viewAllReview" href="/pages/review?name=${encodedName}&id=${encodedID}">.View Review</a>
                    </p>
                `;
                Reviewform.reset();

            } catch (error) {
                console.error("Error:", error);

                // Extract desc from nested JSON string
                let desc = "Something went wrong. Please try again.";

                try {
                    // Match inner JSON: {...}
                    const jsonMatch = error.message.match(/\{.*\}/);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]); // outer JSON

                        if (parsed.error) {
                            // extract the inner JSON inside error string
                            const innerMatch = parsed.error.match(/\{.*\}/);
                            if (innerMatch) {
                                const innerParsed = JSON.parse(innerMatch[0]);
                                if (innerParsed.desc) desc = innerParsed.desc;
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Failed to parse error:", e);
                }

                responseMsg.innerHTML = `<p style="color:red;">${desc}</p>`;
            }

        });
    }

})();