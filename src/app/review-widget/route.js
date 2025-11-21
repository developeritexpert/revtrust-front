import { getReviews } from '../../../lib/reviewService';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const brandId = searchParams.get("brandId");
  const productId = searchParams.get("productId");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const status = searchParams.get("status");

  // ⬇️ Destructure properly
  const { reviews, pagination } = await getReviews({
    brandId,
    productId,
    sortBy,
    order,
    page,
    limit,
    status
  });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  return new Response(
    JSON.stringify({
      data: reviews,       // ⬅️ array only
      pagination: pagination, // ⬅️ separated
    }),
    { status: 200, headers }
  );
}


// Handle OPTIONS requests (required for preflight requests in browsers)
export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*', // You can restrict to your Shopify domain
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return new Response(null, { status: 204, headers });
}
