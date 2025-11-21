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

    if (!data?.data) return {};

    const brand = data.data;
    console.log("API Raw Brand:", brand);

    let reviewsData = [];
    if (Array.isArray(brand.reviews)) {
      reviewsData = brand.reviews.map((review) => ({
        reviewTitle: review.reviewTitle || "",
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
    }

    const brandData = {
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
      reviews: reviewsData,
    };

    return brandData;
}

export async function addBrand(formData) {

    const res = await fetch("https://revtrust-br7i.onrender.com/api/brand/add", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData  // send as-is
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error("addBrand failed: " + err);
    }

    return await res.json();
}


