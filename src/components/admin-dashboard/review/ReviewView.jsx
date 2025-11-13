// components/admin-dashboard/review/ReviewsPage.jsx
'use client';

import { useCallback,useRef } from 'react';
import { useRouter,usePathname } from 'next/navigation';
import { Avatar, Text, Group, Badge, Rating, Stack, Box } from '@mantine/core';
import { 
  IconMessage, 
  IconUser, 
  IconMail, 
  IconPhone,
  IconShoppingCart,
  IconStar,
  IconBuildingStore,
  IconPackage,
  IconX,
  IconStarFilled,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { REVIEW_API, PRODUCT_API, BRAND_API } from '../../../utils/apiUrl';
import { useSearchParams } from 'next/navigation';


export default function ReviewsPage() {
  const router = useRouter();

  const pathname = usePathname();
  const tableRef = useRef();

  const searchParams = useSearchParams();
  const brandId = searchParams.get('brandId');
  const type = searchParams.get('type') || 'brand'



  // determine which type of review to show based on route
  const isPendingPage = pathname.includes('/pending');
  const isApprovedPage = pathname.includes('/approved');
  

const fetchReviews = useCallback(async (params) => {
  const token = useAuthStore.getState().token;
  const query = new URLSearchParams(params);

  if (isPendingPage) query.append('status', 'INACTIVE');
  else if (isApprovedPage) query.append('status', 'ACTIVE');

  if (brandId) query.append('brandId', brandId);

  // ✅ Only append `type` if not filtered by reviewType
// ✅ Only send type filter if explicitly selected
    if (params.reviewType === 'Product') {
      query.append('type', 'product');
    } else if (params.reviewType === 'Brand') {
      query.append('type', 'brand');
    }
// 👉 else (All Types) – don't append anything, show all reviews



  const response = await axiosWrapper(
    'get',
    `${REVIEW_API.GET_ALL_REVIEWS}?${query.toString()}`,
    {},
    token
  );

  return response.data;
}, [isPendingPage, isApprovedPage, brandId, type]);




  const handleDelete = async (review) => {
    modals.openConfirmModal({
      title: 'Delete Review',
      children: (
        <Text size="sm">
          Are you sure you want to delete the review by <strong>{review.name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const token = useAuthStore.getState().token;
          const URL = REVIEW_API.DELETE_REVIEW.replace(':id', review._id);
  
          // Show loader
          tableRef.current?.setLoading?.(true);
  
          await axiosWrapper('delete', URL, {}, token);
  
          notifications.show({
            title: 'Success',
            message: 'Review deleted successfully',
            color: 'green',
          });
  
          // ✅ Refresh table data after deletion
          await tableRef.current?.refresh?.();
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: err.response?.data?.message || 'Failed to delete review',
            color: 'red',
          });
        } finally {
          tableRef.current?.setLoading?.(false);
        }
      },
    });
  };
  

  const handleAddReview = () => {
    router.push('/admin/reviews/add');
  };


  const handleEdit = (review) => {
    router.push(`/admin/reviews/edit/${review._id}`);
  };

  const handleView = (review) => {
    router.push(`/admin/reviews/${review._id}`);
  };

  const handleStatusChange = async (review, newStatus) => {
    try {
      const token = useAuthStore.getState().token;
      const URL = REVIEW_API.STATUS_REVIEW.replace(':id', review._id);
      
      await axiosWrapper(
        'put',
        URL,
        { status: newStatus },
        token
      );
      
      notifications.show({
        title: 'Success',
        message: `Review ${newStatus.toLowerCase()} successfully`,
        color: 'green',
      });
      
      // Refresh the table
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update review status',
        color: 'red',
      });
    }
  };

  const columns = [
    {
      key: 'review',
      header: 'Review',
      accessor: 'reviewTitle',
      sortField: 'reviewTitle',
      render: (item) => (
        <Group gap="sm" align="flex-start" style={{ maxWidth: '350px' }}>
          <Avatar 
            radius="xl" 
            size="md"
            color={item.reviewType === 'Product' ? 'blue' : 'green'}
          >
            {item.reviewType === 'Product' ? 'P' : 'B'}
          </Avatar>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text 
              fw={500} 
              size="sm" 
              style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '280px'
              }}
              title={item.reviewTitle || 'No Title'}
            >
              {item.reviewTitle || 'No Title'}
            </Text>
            <Text 
              size="xs" 
              c="dimmed" 
              style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                maxWidth: '280px',
                wordBreak: 'break-word'
              }}
              title={item.reviewBody || 'No review content'}
            >
              {item.reviewBody || 'No review content'}
            </Text>
            <Group gap="xs" mt={4}>
              <Badge 
                size="xs" 
                color={item.reviewType === 'Product' ? 'blue' : 'green'}
                variant="light"
              >
                {item.reviewType}
              </Badge>
              {item.reviewType === 'Product' && item.productId && (
                <Badge size="xs" variant="outline">
                  Product
                </Badge>
              )}
              {item.reviewType === 'Brand' && item.brandId && (
                <Badge size="xs" variant="outline">
                  Brand
                </Badge>
              )}
            </Group>
          </Box>
        </Group>
      )
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Stack gap={2} style={{ minWidth: '180px' }}>
          <Group gap={6}>
            <IconUser size={14} opacity={0.6} />
            <Text 
              size="sm" 
              fw={500}
              style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }}
              title={item.name}
            >
              {item.name}
            </Text>
          </Group>
          <Group gap={6}>
            <IconMail size={12} opacity={0.6} />
            <Text 
              size="xs" 
              c="dimmed"
              style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }}
              title={item.email}
            >
              {item.email}
            </Text>
          </Group>
          {item.phoneNumber && (
            <Group gap={6}>
              <IconPhone size={12} opacity={0.6} />
              <Text size="xs" c="dimmed">{item.phoneNumber}</Text>
            </Group>
          )}
        </Stack>
      )
    },
    {
      key: 'ratings',
      header: 'Ratings',
      accessor: 'product_store_rating',
      sortField: 'product_store_rating',
      render: (item) => (
        <Stack gap={4} style={{ minWidth: '180px' }}>
          <Group gap={4} wrap="nowrap">
            <Text size="xs" c="dimmed" style={{ minWidth: '65px' }}>Store:</Text>
            <Rating value={item.product_store_rating} readOnly size="xs" />
            <Text size="xs" fw={500}>({item.product_store_rating})</Text>
          </Group>
          <Group gap={4} wrap="nowrap">
            <Text size="xs" c="dimmed" style={{ minWidth: '65px' }}>Seller:</Text>
            <Rating value={item.seller_rating} readOnly size="xs" />
            <Text size="xs" c="dimmed">({item.seller_rating})</Text>
          </Group>
          <Group gap={4} wrap="nowrap">
            <Text size="xs" c="dimmed" style={{ minWidth: '65px' }}>Quality:</Text>
            <Rating value={item.product_quality_rating} readOnly size="xs" />
            <Text size="xs" c="dimmed">({item.product_quality_rating})</Text>
          </Group>
          <Group gap={4} wrap="nowrap">
            <Text size="xs" c="dimmed" style={{ minWidth: '65px' }}>Price:</Text>
            <Rating value={item.product_price_rating} readOnly size="xs" />
            <Text size="xs" c="dimmed">({item.product_price_rating})</Text>
          </Group>
          {item.issue_handling_rating !== null && item.issue_handling_rating !== undefined && item.issue_handling_rating !== 0 && (
            <Group gap={4} wrap="nowrap">
              <Text size="xs" c="dimmed" style={{ minWidth: '65px' }}>Issue:</Text>
              <Rating value={item.issue_handling_rating} readOnly size="xs" />
              <Text size="xs" c="dimmed">({item.issue_handling_rating})</Text>
            </Group>
          )}

        </Stack>
      )
    },
    {
      key: 'target',
      header: 'Target',
      accessor: 'reviewType',
      render: (item) => {
        const isProduct = item.reviewType === 'Product';
        const isBrand = item.reviewType === 'Brand';
        const hasTarget =
          (isProduct && item.productId) ||
          (isBrand && item.brandId) ||
          (isProduct && item.shopifyProductId);
    
        return (
          <Stack gap={4} style={{ minWidth: '120px' }}>
            {hasTarget ? (
              <Group gap={6}>
                {isProduct ? (
                  <>
                    <IconPackage size={14} opacity={0.6} />
                    <Text size="sm">Product</Text>
                  </>
                ) : (
                  <>
                    <IconBuildingStore size={14} opacity={0.6} />
                    <Text size="sm">Brand</Text>
                  </>
                )}
              </Group>
            ) : (
              <Group gap={6}>
                <IconX size={14} color="gray" />
                <Text size="sm" c="dimmed">Not Found</Text>
              </Group>
            )}
            {item.orderId && (
              <Group gap={6}>
                <IconShoppingCart size={12} opacity={0.6} />
                <Text
                  size="xs"
                  c="dimmed"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100px'
                  }}
                  title={item.orderId}
                >
                  {item.orderId}
                </Text>
              </Group>
            )}
          </Stack>
        );
      },
    },
    
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortField: 'status',
      render: (item) => (
        <Badge 
          color={
            item.status === 'ACTIVE' ? 'green' : 
            item.status === 'INACTIVE' ? 'gray' : 'blue'
          } 
          variant="light"
          size="sm"
        >
          {item.status || 'UNKNOWN'}
        </Badge>
      )
    },
    {
      key: 'date',
      header: 'Date',
      accessor: 'createdAt',
      sortField: 'createdAt',
      render: (item) => (
        <Stack gap={2} style={{ minWidth: '100px' }}>
          <Text size="sm" fw={500}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(item.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </Stack>
      )
    },
  ];

  const filters = [
    {
      key: 'reviewTitle',
      label: 'Review Title',
      type: 'text',
      placeholder: 'Search by review title...',
      icon: <IconMessage size={16} />
    },
    {
      key: 'name',
      label: 'Reviewer Name',
      type: 'text',
      placeholder: 'Search by reviewer name...',
      icon: <IconUser size={16} />
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Search by email...',
      icon: <IconMail size={16} />
    },
    {
      key: 'reviewType',
      label: 'Review Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'Product', label: 'Product Review' },
        { value: 'Brand', label: 'Brand Review' },
      ]
    },
  // ✅ hide Status filter on pending or approved pages
  ...(!isPendingPage && !isApprovedPage
    ? [
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: '', label: 'All Statuses' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]
        },
      ]
    : []),
  // ✅ Ratings Section
  {
    key: 'minRating',
    label: 'Store Rating',
    type: 'select',
    options: [
      { value: '', label: 'Any Rating' },
      { value: '1', label: '1+ Stars' },
      { value: '2', label: '2+ Stars' },
      { value: '3', label: '3+ Stars' },
      { value: '4', label: '4+ Stars' },
      { value: '5', label: '5 Stars' },
    ]
  },
  {
    key: 'sellerRating',
    label: 'Seller Rating',
    type: 'select',
    options: [
      { value: '', label: 'Any Rating' },
      { value: '1', label: '1+ Stars' },
      { value: '2', label: '2+ Stars' },
      { value: '3', label: '3+ Stars' },
      { value: '4', label: '4+ Stars' },
      { value: '5', label: '5 Stars' },
    ]
  },
  {
    key: 'qualityRating',
    label: 'Quality Rating',
    type: 'select',
    options: [
      { value: '', label: 'Any Rating' },
      { value: '1', label: '1+ Stars' },
      { value: '2', label: '2+ Stars' },
      { value: '3', label: '3+ Stars' },
      { value: '4', label: '4+ Stars' },
      { value: '5', label: '5 Stars' },
    ]
  },
  {
    key: 'priceRating',
    label: 'Price Rating',
    type: 'select',
    options: [
      { value: '', label: 'Any Rating' },
      { value: '1', label: '1+ Stars' },
      { value: '2', label: '2+ Stars' },
      { value: '3', label: '3+ Stars' },
      { value: '4', label: '4+ Stars' },
      { value: '5', label: '5 Stars' },
    ]
  },
  {
    key: 'issueRating',
    label: 'Issue Rating',
    type: 'select',
    options: [
      { value: '', label: 'Any Rating' },
      { value: '1', label: '1+ Stars' },
      { value: '2', label: '2+ Stars' },
      { value: '3', label: '3+ Stars' },
      { value: '4', label: '4+ Stars' },
      { value: '5', label: '5 Stars' },
    ]
  },
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
    custom: isPendingPage
    ? [
        {
          tooltip: 'Activate Review',
          color: 'green',
          icon: <IconStarFilled size={16} />,
          onClick: (review) => handleStatusChange(review, 'ACTIVE'),
        },
      ]
    : isApprovedPage
    ? [
        {
          tooltip: 'Deactivate Review',
          color: 'orange',
          icon: <IconX size={16} />,
          onClick: (review) => handleStatusChange(review, 'INACTIVE'),
        },
      ]
    : [
        {
          tooltip: 'Activate Review',
          color: 'green',
          icon: <IconStarFilled size={16} />,
          onClick: (review) => handleStatusChange(review, 'ACTIVE'),
          showCondition: (r) => r.status === 'INACTIVE',
        },
        {
          tooltip: 'Deactivate Review',
          color: 'orange',
          icon: <IconX size={16} />,
          onClick: (review) => handleStatusChange(review, 'INACTIVE'),
          showCondition: (r) => r.status === 'ACTIVE',
        },
      ],

  };

  const customExport = (data) => {
    const headers = [
      'Review Title', 
      'Review Body', 
      'Reviewer Name', 
      'Email', 
      'Review Type', 
      'Status',
      'Store Rating',
      'Seller Rating',
      'Quality Rating',
      'Price Rating',
      'Issue Handling Rating',
      'Order ID',
      'Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(review => [
        `"${(review.reviewTitle || '').replace(/"/g, '""')}"`,
        `"${(review.reviewBody || '').replace(/"/g, '""')}"`,
        `"${(review.name || '').replace(/"/g, '""')}"`,
        `"${(review.email || '').replace(/"/g, '""')}"`,
        `"${(review.reviewType || '').replace(/"/g, '""')}"`,
        `"${(review.status || '').replace(/"/g, '""')}"`,
        review.product_store_rating || 0,
        review.seller_rating || 0,
        review.product_quality_rating || 0,
        review.product_price_rating || 0,
        review.issue_handling_rating || '',
        `"${(review.orderId || '').replace(/"/g, '""')}"`,
        `"${new Date(review.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `Exported ${data.length} reviews`,
      color: 'green',
    });
  };

  return (
    <DataTable
      ref={tableRef} 
      title={isPendingPage ? 'Pending Reviews' : isApprovedPage ? 'Approved Reviews' : 'All Reviews'}
      fetchFunction={fetchReviews}
      columns={columns}
      filters={filters}
      actions={actions}
      onAdd={handleAddReview}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onExport={customExport}
      defaultLimit={25}

    />
  );
}