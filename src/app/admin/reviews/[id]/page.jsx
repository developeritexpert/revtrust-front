import { Metadata } from "next";

import ReviewDetail from '../../../../components/admin-dashboard/review/ReviewDetail';


export default function ReviewDetailPage() {
  return (
    <>
        <ReviewDetail />
    </>

  )
}
export const metadata = {
    title: 'Review Detail | Admin Dashboard',
    description:
      'View and manage individual customer reviews, including ratings, comments, and feedback details directly from the admin dashboard.',
}
