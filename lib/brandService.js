const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
export async function getBrands({ name }) {
    const url = new URL("https://revtrust-br7i.onrender.com/api/brand/all");

    if (name) url.searchParams.set("name", name);

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    let brandsArray = [];

    if (data?.data?.data) {
        const brands = data.data.data;

        for (let i = 0; i < brands.length; i++) {
            const brand = brands[i];
            brandsArray.push({
                id: brand._id || "",
                name: brand.name || "",
                websiteUrl: brand.websiteUrl || "",
                logoUrl: brand.logoUrl || "",
                description: brand.description || "",
                status: brand.status || "",
                createdAt: brand.createdAt || "",
                totalReviews: brand.totalReviews || 0,
                averageRating: brand.averageRating || 0,
                ratingDistribution: brand.ratingDistribution || {},
            });
        }
    }

    return brandsArray;
}

export async function getBrandById(brandId) {
    const url = new URL(`https://revtrust-br7i.onrender.com/api/brand/${brandId}`);
    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    let brandData = [];

    if (data?.data) {
        const brand = data.data;
        if(brand.reviews){
            let reviewsData = brand.reviews.map((review) => ({
                reviewTitle: review.reviewTitle || 0,
                reviewBody: review.reviewBody || "",
                name: review.name || "",
                status: review.status || "",
                createdAt: review.createdAt || "",
                product_store_rating: review.product_store_rating || 0,
                seller_rating: review.seller_rating || 0,
                product_quality_rating: review.product_quality_rating || 0,
                product_price_rating: review.product_price_rating || 0,
                issue_handling_rating: review.issue_handling_rating || 0,
            }));
            brandData.reviews = reviewsData;
        }

        brandData = {
            name: brand.name || "",
            websiteUrl: brand.websiteUrl || "",
            logoUrl: brand.logoUrl || "",
            description: brand.description || "",
            status: brand.status || "",
            createdAt: brand.createdAt || "",
            totalReviews: brand.totalReviews || 0,
            averageRating: brand.averageRating || 0,
            ratingDistribution: brand.ratingDistribution || {},
            ratingSummary: brand.ratingSummary || {},
        };
    }

    return brandData;
}

export async function addBrand({ name, email, postcode, websiteUrl, logoUrl }) {
    const url = new URL("https://revtrust-br7i.onrender.com/api/brand/add");
    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, postcode, websiteUrl, logoUrl }),
    });

    const data = await res.json();
    console.log(data);
    return data;
}