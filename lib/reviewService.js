export async function getReviews({ brandId, productId, sortBy, order, page, limit }) {
  const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
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
  return data?.data?.data || [];
}
