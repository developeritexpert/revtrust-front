'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconMessage,
  IconUser,
  IconMail,
  IconPhone,
  IconStar,
  IconBuildingStore,
  IconPackage,
  IconCalendar,
} from '@tabler/icons-react';
import DynamicView from '../../../components/DynamicView/DynamicView';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { REVIEW_API, PRODUCT_API, BRAND_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function ReviewDetail() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id;

  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const token = useAuthStore((state) => state.token);

  // ✅ Define fetch function separately (so we can reuse it)
  const fetchReview = useCallback(async () => {
    if (!reviewId || !token) return;
    setLoading(true);

    try {
      const url = REVIEW_API.GET_REVIEW.replace(':id', reviewId);
      const response = await axiosWrapper('get', url, {}, token);
      let data = response.data;

      // ✅ Fetch related entity names
      if (data.reviewType === 'Product' && data.productId) {
        try {
          const productRes = await axiosWrapper(
            'get',
            `${PRODUCT_API.GET_PRODUCT.replace(':id', data.productId)}`,
            {},
            token
          );
          data.productName = productRes.data?.name || 'Unknown Product';
        } catch {
          data.productName = 'Unknown Product';
        }
      }

      if (data.reviewType === 'Brand' && data.brandId) {
        try {
          const brandRes = await axiosWrapper(
            'get',
            `${BRAND_API.GET_BRAND.replace(':id', data.brandId)}`,
            {},
            token
          );
          data.brandName = brandRes.data?.name || 'Unknown Brand';
        } catch {
          data.brandName = 'Unknown Brand';
        }
      }

      setReviewData(data);
    } catch (error) {
      showErrorNotification(error, 'Failed to fetch review details');
      router.push('/admin/reviews');
    } finally {
      setLoading(false);
    }
  }, [reviewId, token, router]);

  // ✅ Initial fetch
  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  // ✅ Delete and refetch
  const handleDelete = (review) => {
    modals.openConfirmModal({
      title: 'Delete Review',
      children: `Are you sure you want to delete review by ${review.name}? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setLoading(true);
        try {
          const url = REVIEW_API.DELETE_REVIEW.replace(':id', review._id);
          await axiosWrapper('delete', url, {}, token);

          notifications.show({
            title: 'Success',
            message: 'Review deleted successfully',
            color: 'green',
          });

          // ✅ Refetch to show updated state (instead of navigating)
          await fetchReview();
        } catch (error) {
          showErrorNotification(error, 'Failed to delete review');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEdit = (review) => router.push(`/admin/reviews/edit/${review._id}`);
  const handleBack = () => router.push('/admin/reviews');

  const reviewFields = [
    {
      name: 'reviewTitle',
      label: 'Review Title',
      type: 'text',
      section: 'Review Information',
      span: 12,
      icon: <IconMessage size={16} />,
    },
    {
      name: 'reviewBody',
      label: 'Review Content',
      type: 'textarea',
      section: 'Review Information',
      span: 12,
    },
    {
      name: 'name',
      label: 'Reviewer Name',
      type: 'text',
      section: 'Reviewer Details',
      span: 6,
      icon: <IconUser size={16} />,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      section: 'Reviewer Details',
      span: 6,
      icon: <IconMail size={16} />,
    },
    {
      name: 'phoneNumber',
      label: 'Phone',
      type: 'phone',
      section: 'Reviewer Details',
      span: 6,
      icon: <IconPhone size={16} />,
    },
    {
      name: 'reviewType',
      label: 'Review Type',
      type: 'badge',
      section: 'Review Information',
      span: 6,
      getColor: (value) => (value === 'Product' ? 'blue' : 'green'),
    },
    ...(reviewData?.reviewType === 'Product'
      ? [
          {
            name: 'productName',
            label: 'Product Name',
            type: 'text',
            section: 'Related Entities',
            span: 6,
            icon: <IconPackage size={16} />,
          },
          {
            name: 'shopifyProductId',
            label: 'Shopify Product ID',
            type: 'text',
            section: 'Related Entities',
            span: 6,
            icon: <IconPackage size={16} />,
          },
        ]
      : reviewData?.reviewType === 'Brand'
      ? [
          {
            name: 'brandName',
            label: 'Brand Name',
            type: 'text',
            section: 'Related Entities',
            span: 6,
            icon: <IconBuildingStore size={16} />,
          },
        ]
      : []),    
    {
      name: 'product_store_rating',
      label: 'Store Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'seller_rating',
      label: 'Seller Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'product_quality_rating',
      label: 'Product Quality Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'product_price_rating',
      label: 'Price Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'issue_handling_rating',
      label: 'Issue Handling Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'badge',
      section: 'Status',
      span: 6,
      getColor: (value) => {
        if (value === 'ACTIVE') return 'green';
        if (value === 'PENDING') return 'blue';
        if (value === 'INACTIVE') return 'gray';
        return 'gray';
      },
    },
    {
      name: 'createdAt',
      label: 'Created At',
      type: 'datetime',
      section: 'Metadata',
      span: 6,
      icon: <IconCalendar size={16} />,
    },
  ];

  // ✅ Show loader overlay during all async operations
  if (loading) return <LoadingOverlay visible={true} />;

  if (!reviewData) return null;

  return (
    <DynamicView
      title={`Review Details: ${reviewData.reviewTitle || reviewData._id}`}
      data={reviewData}
      fields={reviewFields}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}
