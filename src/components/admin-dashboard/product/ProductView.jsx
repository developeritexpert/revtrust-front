// pages/products.jsx
'use client';

import { useCallback } from 'react';
import { Avatar, Text, Group, Badge } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCategory, IconCurrencyDollar, IconPackage, IconStar } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { PRODUCT_API, BRAND_API } from '../../../utils/apiUrl';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';


export default function ProductsPage() {
  const router = useRouter();

  const tableRef = useRef();


  const fetchProducts = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();

    const response = await axiosWrapper(
      'get',
      `${PRODUCT_API.GET_ALL_PRODUCTS}?${queryString}`,
      {},
      token,
    );
    console.log('Fetched products with response:', response);
    return response.data;
  }, []);

  // Function to fetch brands with search
  const fetchBrands = useCallback(async (searchQuery = '') => {
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('limit', '20'); // Limit results for better performance
      
      const response = await axiosWrapper(
        'get',
        `${BRAND_API.GET_ALL_BRANDS}?${params.toString()}`,
        {},
        token
      );
      
      if (response.data && response.data.data) {
        return response.data.data.map(brand => ({
          value: brand._id,
          label: brand.name
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to load brands',
        color: 'red',
      });
      return [];
    }
  }, []);

  const handleDelete = async (product) => {
    console.log('🟡 Delete request triggered for product:', product);

    modals.openConfirmModal({
      title: 'Delete Product', // ✅ Changed title
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const token = useAuthStore.getState().token;
          // ✅ Changed to PRODUCT_API
          const URL = PRODUCT_API.DELETE_PRODUCT.replace(':id', product._id);
          console.log('🟢 DELETE URL:', URL);
          console.log('🔐 Token:', token ? 'Token present ✅' : '❌ Token missing');

          tableRef.current?.setLoading?.(true);

          const response = await axiosWrapper('delete', URL, {}, token);
          console.log('✅ Delete response:', response);

          notifications.show({
            title: 'Success',
            message: 'Product deleted successfully', // ✅ Changed message
            color: 'green',
          });

          await tableRef.current?.refresh?.();
        } catch (err) {
          console.error('❌ Delete product error:', err);
          notifications.show({
            title: 'Error',
            message: err.response?.data?.message || 'Failed to delete product',
            color: 'red',
          });
        } finally {
          tableRef.current?.setLoading?.(false);
        }
      },
    });
  };

  


  const handleAddProduct = () => {
    router.push('/admin/products/add');
  };

  const handleEditProduct = (product) => {
    router.push(`/admin/products/edit/${product._id}`);
  };

  const handleViewProduct = (product) => {
    router.push(`/admin/products/${product._id}`);
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Group gap="sm">
          <Avatar 
            src={item.images?.[0]} 
            radius="sm" 
            size="md"
            alt={item.name}
          >
            {item.name?.charAt(0)?.toUpperCase() || 'P'}
          </Avatar>
          <div>
            <Text fw={500} size="sm">{item.name}</Text>
            <Text size="xs" c="dimmed">HANDLE: {item.handle || 'N/A'}</Text>
          </div>
        </Group>
      )
    },
    {
      key: 'brand',
      header: 'Brand',
      accessor: 'brand',
      sortField: 'brand',
      render: (item) => (
        <Group gap={6}>
          <IconCategory size={14} opacity={0.6} />
          <Text size="sm">{item.brandId?.name || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'price',
      header: 'Price',
      accessor: 'price',
      sortField: 'price',
      render: (item) => (
        <Group gap={6}>
          <IconCurrencyDollar size={14} opacity={0.6} />
          <Text size="sm">${item.price?.toFixed(2) || '0.00'}</Text>
        </Group>
      )
    },
    // {
    //   key: 'stock',
    //   header: 'Stock',
    //   accessor: 'stock',
    //   sortField: 'stock',
    //   render: (item) => (
    //     <Group gap={6}>
    //       <IconPackage size={14} opacity={0.6} />
    //       <Badge 
    //         color={item.stockQuantity > 20 ? 'green' : item.stockQuantity > 5 ? 'yellow' : 'red'} 
    //         variant="light"
    //         size="sm"
    //       >
    //         {item.stockQuantity || 0} in stock
    //       </Badge>
    //     </Group>
    //   )
    // },
    {
      key: 'rating',
      header: 'Rating',
      accessor: 'rating',
      sortField: 'rating',
      render: (item) => {
        // ✅ USE averageRating (which is already rounded to 1 decimal)
        const rating = item.averageRating || 0;
        const reviewCount = item.totalReviews || 0;
        
        return (
          <Group gap={6}>
            <IconStar size={14} opacity={0.6} fill={rating > 0 ? '#ffc107' : 'none'} />
            <Text size="sm" fw={500}>
              {rating > 0 ? `${rating}/5` : 'No ratings'}
            </Text>
            {reviewCount > 0 && (
              <Text size="xs" c="dimmed">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </Text>
            )}
          </Group>
        );
      }
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
  ];

  const filters = [
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Search by product name...',
    },
    {
      key: 'handle',
      label: 'Handle',
      type: 'text',
      placeholder: 'Search by Handle...',
    },
    {
      key: 'brandId',
      label: 'Brand',
      type: 'select',
      placeholder: 'Search and select brand...',
      filterFunction: fetchBrands,
      loadOnMount: true, // Load initial brands when component mounts
    },
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
    {
      key: 'minPrice',
      label: 'Min Price',
      type: 'text',
      placeholder: 'Minimum price...',
    },
    {
      key: 'maxPrice',
      label: 'Max Price',
      type: 'text',
      placeholder: 'Maximum price...',
    }
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  const customExport = (data) => {
    // Custom CSV export for products
    const headers = ['Name', 'Handle', 'Brand', 'Price', 'Stock', 'Rating', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(product => [
        `"${(product.name || '').replace(/"/g, '""')}"`,
        `"${(product.handle || '').replace(/"/g, '""')}"`,
        `"${(product.brandId?.name || '').replace(/"/g, '""')}"`,
        product.price || 0,
        product.stock || 0,
        product.rating || 0,
        `"${(product.status || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `Exported ${data.length} products with custom format`,
      color: 'green',
    });
  };

  return (
    <DataTable
      ref={tableRef}
      title="Products Management"
      fetchFunction={fetchProducts}
      columns={columns}
      filters={filters}
      actions={actions}
      onAdd={handleAddProduct}
      onEdit={handleEditProduct}
      onView={handleViewProduct}
      onDelete={handleDelete}
      onExport={customExport}
      defaultLimit={25}
    />
  );
}