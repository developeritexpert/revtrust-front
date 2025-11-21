export async function getReviews({ brandId, productId, sortBy, order, page, limit, status }) {
  const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
  const url = new URL("https://revtrust-br7i.onrender.com/api/review/all");

  if (brandId) url.searchParams.set("brandId", brandId);
  if (productId) url.searchParams.set("shopifyProductId", productId);
  if (sortBy) url.searchParams.set("sortBy", sortBy);
  if (order) url.searchParams.set("order", order);
  if (page) url.searchParams.set("page", page);
  if (limit) url.searchParams.set("limit", limit);
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // return data?.data?.data || [];

  let data_array = [];

  if (data?.data?.data) {
    const reviews = data.data.data;
    const pagination = data.data.pagination;
    if(pagination){
      data_array.pagination = pagination;
    }else{
      data_array.pagination = {};
    } 

    console.log(data);

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