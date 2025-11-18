import { getBrands } from '../../../lib/brandService';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const brandId = searchParams.get("brandId");
  const name = searchParams.get("name");

  const brands = await getBrands({ brandId, name });

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // You can replace '*' with your Shopify domain
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  return new Response(JSON.stringify({ data: brands }), { status: 200, headers });
}

export async function POST(req) {
  const body = await req.json(); // Parse POST JSON body

  const {  name, email, postcode, websiteUrl, logoUrl } = body || {};

  const brand = await addBrand({  name, email, postcode, websiteUrl, logoUrl });

  const headers = corsHeaders();

  return new Response(JSON.stringify({ data: brand }), { status: 200, headers });
}

// Handle OPTIONS requests (required for preflight requests in browsers)
export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*', // You can restrict to your Shopify domain
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return new Response(null, { status: 204, headers });
}
