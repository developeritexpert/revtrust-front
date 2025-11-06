'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconPackage,
  IconBuildingStore,
  IconCurrencyDollar,
  IconStack,
  IconStar,
  IconCalendar,
  IconStatusChange,
} from '@tabler/icons-react';
import DynamicView from '../../../components/DynamicView/DynamicView';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { PRODUCT_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = PRODUCT_API.GET_PRODUCT.replace(':id', productId);
        const response = await axiosWrapper('get', url, {}, token);
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        showErrorNotification(error, 'Failed to fetch product details');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, token, router]);

  const handleEdit = (product) => router.push(`/admin/products/edit/${product._id}`);

  const handleDelete = (product) => {
    modals.openConfirmModal({
      title: 'Delete Product',
      children: `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const url = PRODUCT_API.DELETE_PRODUCT.replace(':id', product._id);
          await axiosWrapper('delete', url, {}, token);
          notifications.show({
            title: 'Success',
            message: 'Product deleted successfully',
            color: 'green',
          });
          router.push('/admin/products');
        } catch (error) {
          showErrorNotification(error, 'Failed to delete product');
        }
      },
    });
  };

  const handleBack = () => router.push('/admin/products');

  const productFields = [
    {
      name: 'image',
      label: 'Product Image',
      type: 'image',
      section: 'Product Information',
      span: 12,
    },
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      section: 'Product Information',
      span: 6,
      icon: <IconPackage size={16} />,
    },
    {
      name: 'handle',
      label: 'Handle (Slug)',
      type: 'text',
      section: 'Product Information',
      span: 6,
    },
    {
      accessor: 'brandId.name',
      label: 'Brand Name',
      type: 'text',
      section: 'Brand Information',
      span: 6,
      icon: <IconBuildingStore size={16} />,
    },
    {
      accessor: 'brandId.email',
      label: 'Brand Email',
      type: 'email',
      section: 'Brand Information',
      span: 6,
    },
    {
      accessor: 'brandId.logoUrl',
      label: 'Brand Logo',
      type: 'image',
      section: 'Brand Information',
      span: 6,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'currency',
      section: 'Product Details',
      span: 6,
      icon: <IconCurrencyDollar size={16} />,
    },
    // {
    //   name: 'stockQuantity',
    //   label: 'Stock Quantity',
    //   type: 'number',
    //   section: 'Product Details',
    //   span: 6,
    //   icon: <IconStack size={16} />,
    // },
    {
      name: 'averageRating',
      label: 'Average Rating',
      type: 'rating',
      section: 'Ratings',
      span: 6,
      icon: <IconStar size={16} />,
    },
    {
      name: 'totalReviews',
      label: 'Total Reviews',
      type: 'number',
      section: 'Ratings',
      span: 6,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'badge',
      section: 'Status',
      span: 6,
      getColor: (value) => {
        if (value === 'ACTIVE') return 'green';
        if (value === 'INACTIVE') return 'gray';
        return 'blue';
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
    {
      name: 'updatedAt',
      label: 'Updated At',
      type: 'datetime',
      section: 'Metadata',
      span: 6,
      icon: <IconCalendar size={16} />,
    },
  ];

  if (loading) return <LoadingOverlay visible={true} />;
  if (!productData) return null;

  return (
    <DynamicView
      title={`Product Details: ${productData.name}`}
      data={productData}
      fields={productFields}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}
