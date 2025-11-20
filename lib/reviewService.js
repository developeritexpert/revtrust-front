const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
export async function getReviews({ brandId, productId, sortBy, order, page, limit }) {
  const url = new URL("https://revtrust-br7i.onrender.com/api/review/all");

  if (brandId) url.searchParams.set("brandId", brandId);
  if (productId) url.searchParams.set("shopifyProductId", productId);
  if (sortBy) url.searchParams.set("sortBy", sortBy);
  if (order) url.searchParams.set("order", order);
  if (page) url.searchParams.set("page", page);
  if (limit) url.searchParams.set("limit", limit);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // return data?.data?.data || [];

  let data_array = [];

  if (data?.data?.data) {
    const reviews = data.data.data;

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];

      data_array.push({
        reviewTitle: review.reviewTitle || "",
        reviewContent: review.reviewBody || "",
        reviewerName: review.name || "",
        reviewType: review.reviewType || "",
        reviewStatus: review.status || "",
        product_store_rating: review.product_store_rating || 0,
        seller_rating: review.seller_rating || 0,
        product_quality_rating: review.product_quality_rating || 0,
        product_price_rating: review.product_price_rating || 0,
        issue_handling_rating: review.issue_handling_rating || 0,
        createdAt: review.createdAt || "",
        totalReviewsByEmail: review.totalReviewsByEmail || 0
      });
    }
  }
  return data_array;
}

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