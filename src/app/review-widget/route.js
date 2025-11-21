import * as reviewService from '../../../lib/reviewService';

// Reusable CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*", // IMPORTANT: allow all headers for FormData
    "Access-Control-Max-Age": "86400"
  };
}

// ---------------------- GET ----------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const brandId = searchParams.get("brandId");
    const productId = searchParams.get("productId");
    const sortBy = searchParams.get("sortBy");
    const order = searchParams.get("order");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const status = searchParams.get("status");

    const reviews = await reviewService.getReviews({
      brandId, productId, sortBy, order, page, limit, status
    });

    return new Response(
      JSON.stringify({ data: reviews }),
      { status: 200, headers: corsHeaders() }
    );

  } catch (err) {
    console.error("GET /review-widget error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

// ---------------------- POST ----------------------
export async function POST(req) {
  try {
    const formData = await req.formData();
    const review = await reviewService.addReview(formData);

    return new Response(
      JSON.stringify({ data: review }),
      { status: 200, headers: corsHeaders() }
    );

  } catch (error) {
    console.error("POST /review-widget error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

// ---------------------- OPTIONS (CORS Preflight) ----------------------
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
