import { getReviews } from '../../../lib/brandReview';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const brandId = searchParams.get("brandId");
  const productId = searchParams.get("productId");

  const reviews = await getReviews({ brandId, productId });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // You can replace '*' with your Shopify domain
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  return new Response(JSON.stringify({ data: reviews }), { status: 200, headers });
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
