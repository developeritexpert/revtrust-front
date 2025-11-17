export async function getReviews({ brandId, productId, sortBy, order, page, limit }) {
  const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
  const url = new URL("https://revtrust-br7i.onrender.com/api/brand/${brandId}");

  if (brandId) url.searchParams.set("brandId", brandId);
  if (productId) url.searchParams.set("shopifyProductId", productId);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // return data?.data?.data || [];

  let data_array = [];

  if (data?.data) {
    const reviews = data.data;

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];

      data_array.push({
        totalReviews: review.totalReviews || 0,
        rating: review.ratingSummary.averageRating || 0,
        brandId: brandId,
        productId:productId
      });
    }
  }
  return data_array;
}