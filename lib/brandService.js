export async function getBrands({ name, brandId }) {
  const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN;
  let url = "";

  if (brandId) {
    url = new URL(`https://revtrust-br7i.onrender.com/api/brand/${brandId}`);
  } else {
    url = new URL("https://revtrust-br7i.onrender.com/api/brand/all");
  }

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
