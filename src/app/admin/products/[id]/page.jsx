import { Metadata } from "next";

import ProductDetail from '../../../../components/admin-dashboard/product/ProductDetail';


export default function ProductDetailPage() {
  return (
    <>
        <ProductDetail />
    </>

  )
}
export const metadata = {
    title: 'Product Detail | Admin Dashboard',
    description: 'View complete details of a product including brand, ratings, and stock information.',
  };
  