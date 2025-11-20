import { getReviews } from '../../../lib/reviewService';

// Reusable CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // replace * with Shopify domain if needed
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const brandId = searchParams.get("brandId");
  const name = searchParams.get("name");

  const brands = await getBrands({ brandId, name });

  return new Response(
    JSON.stringify({ data: brands }),
    { status: 200, headers: corsHeaders() }
  );
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const brand = await addBrand(formData); // pass original formdata

    return new Response(
      JSON.stringify({ data: brand }),
      { status: 200, headers: corsHeaders() }
    );

  } catch (error) {
    console.error("Request failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Required for CORS preflight (POST with JSON)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

