import { getReviews } from '../../../lib/reviewService';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");
  const productId = searchParams.get("productId");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const reviews = await getReviews({ brandId, productId, sortBy, order, page, limit });

  return new Response(JSON.stringify({ data: reviews }), { status: 200 });
}
