// components/admin-dashboard/brand/BrandView.jsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Avatar, 
  Text, 
  Group, 
  Badge, 
  Rating, 
  ActionIcon, 
  Tooltip,
  Code,
  CopyButton,
  Box,
  Stack,
  Modal,
  Button,
  Textarea,
} from '@mantine/core';
import { 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconMessage, 
  IconCode, 
  IconCopy, 
  IconCheck 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';
import { useRef, useState } from 'react';

export default function BrandsPage() {
  const router = useRouter();
  const tableRef = useRef();
  const [embedModalOpened, { open: openEmbedModal, close: closeEmbedModal }] = useDisclosure(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const fetchBrands = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosWrapper(
      'get',
      `${BRAND_API.GET_ALL_BRANDS}?${queryString}`,
      {},
      token,
    );
    return response.data;
  }, []);

  const handleDelete = async (brand) => {
    modals.openConfirmModal({
      title: 'Delete Brand',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{brand.name}</strong>? 
          This will also delete all associated products and reviews. This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const token = useAuthStore.getState().token;
          const URL = BRAND_API.DELETE_BRAND.replace(':id', brand._id);
  
          tableRef.current?.setLoading?.(true);
  
          await axiosWrapper('delete', URL, {}, token);
  
          notifications.show({
            title: 'Success',
            message: 'Brand, products, and reviews deleted successfully',
            color: 'green',
          });
  
          await tableRef.current?.refresh?.();
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: err.response?.data?.message || 'Failed to delete brand',
            color: 'red',
          });
        } finally {
          tableRef.current?.setLoading?.(false);
        }
      },
    });
  };

  const handleShowEmbedCode = (brand) => {
    setSelectedBrand(brand);
    openEmbedModal();
  };

  const generateEmbedCode = (brandId) => {
    return `<div class="review-widget-container" 
    data-brandid="${brandId}" 
    data-brand="{{ shop.name }}" 
    data-product-id="{{ product.id }}" 
    data-product-title="{{ product.title }}" 
    data-product-handle="{{ product.handle }}" 
    data-price="{{ product.price }}" 
    data-product-image="{{ product.selected_or_first_available_variant.featured_image | img_url: 'master' }}">
  </div>
  <script src="https://revtrust-front.onrender.com/review-widget.js" defer></script>`;
  };
  
  const handleAdd = () => {
    router.push('/admin/brands/add');
  };

  const handleEdit = (brand) => {
    router.push(`/admin/brands/edit/${brand._id}`);
  };

  const handleView = (brand) => {
    router.push(`/admin/brands/${brand._id}`);
  };

  const columns = [
    {
      key: 'brand',
      header: 'Brand',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Group gap="sm">
          <Avatar 
            src={item.logoUrl} 
            radius="xl" 
            size="md"
            alt={item.name}
          >
            {item.name?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <Text fw={500} size="sm">{item.name || 'Unnamed Brand'}</Text>
            <Text size="xs" c="dimmed">
              {item.description ? `${item.description.substring(0, 30)}...` : 'No description'}
            </Text>
          </div>
        </Group>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      accessor: 'averageRating',
      sortField: 'averageRating',
      render: (item) => {
        const avgRating = item.averageRating ? parseFloat(item.averageRating) : 0;
        return (
          <Group gap="xs">
            <Rating value={parseFloat(avgRating)} readOnly size="sm" />
            <Text size="sm" fw={500}>
              {avgRating.toFixed(1)}
            </Text>
          </Group>
        );
      }
    },
    {
      key: 'reviews',
      header: 'Reviews',
      accessor: 'totalReviews',
      sortField: 'totalReviews',
      render: (item) => (
        <Group gap={6}>
          <IconMessage size={14} opacity={0.6} />
          <Text size="sm" fw={500}>
            {item.totalReviews || 0}
          </Text>
        </Group>
      )
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      render: (item) => (
        <Group gap={6}>
          <IconMail size={14} opacity={0.6} />
          <Text size="sm">{item.email || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      accessor: 'phoneNumber',
      render: (item) => (
        <Group gap={6}>
          <IconPhone size={14} opacity={0.6} />
          <Text size="sm">{item.phoneNumber || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'postcode',
      header: 'Postcode',
      accessor: 'postcode',
      render: (item) => (
        <Group gap={6}>
          <IconMapPin size={14} opacity={0.6} />
          <Text size="sm">{item.postcode || '-'}</Text>
        </Group>
      )
    },
    // ✅ NEW: Embed Code Column
    {
      key: 'embedCode',
      header: 'Embed Code',
      accessor: '_id',
      sortable: false,
      render: (item) => (
        <Tooltip label="View & Copy Embed Code">
          <ActionIcon 
            variant="light" 
            color="violet"
            onClick={() => handleShowEmbedCode(item)}
          >
            <IconCode size={18} />
          </ActionIcon>
        </Tooltip>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge 
          color={item.status === 'ACTIVE' ? 'green' : item.status === 'INACTIVE' ? 'gray' : 'blue'} 
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
      label: 'Brand Name',
      type: 'text',
      placeholder: 'Search by brand name...',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Search by email...',
      icon: <IconMail size={16} />
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      type: 'text',
      placeholder: 'Search by phone...',
      icon: <IconPhone size={16} />
    },
    {
      key: 'postcode',
      label: 'Postcode',
      type: 'text',
      placeholder: 'Search by postcode...',
      icon: <IconMapPin size={16} />
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
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  return (
    <>
      <DataTable
        ref={tableRef}
        title="Brands Management"
        fetchFunction={fetchBrands}
        columns={columns}
        filters={filters}
        actions={actions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* ✅ Embed Code Modal */}
      <Modal
        opened={embedModalOpened}
        onClose={closeEmbedModal}
        title={
          <Group>
            <IconCode size={20} />
            <Text fw={600}>Shopify Embed Code</Text>
          </Group>
        }
        size="lg"
      >
        {selectedBrand && (
          <Stack gap="md">
            <Box>
              <Text size="sm" fw={500} mb="xs">Brand:</Text>
              <Group gap="sm">
                <Avatar src={selectedBrand.logoUrl} size="sm" radius="xl">
                  {selectedBrand.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Text size="sm">{selectedBrand.name}</Text>
              </Group>
            </Box>

            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Embed Code:</Text>
                <CopyButton value={generateEmbedCode(selectedBrand._id)} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="xs"
                      variant="light"
                      color={copied ? 'teal' : 'blue'}
                      leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      onClick={copy}
                    >
                      {copied ? 'Copied!' : 'Copy Code'}
                    </Button>
                  )}
                </CopyButton>
              </Group>

              <Code block p="md" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                {generateEmbedCode(selectedBrand._id)}
              </Code>
            </Box>

            <Box>
              <Text size="sm" fw={500} mb="xs">Brand ID:</Text>
              <Group gap="xs">
                <Code>{selectedBrand._id}</Code>
                <CopyButton value={selectedBrand._id} timeout={2000}>
                  {({ copied, copy }) => (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color={copied ? 'teal' : 'gray'}
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    </ActionIcon>
                  )}
                </CopyButton>
              </Group>
            </Box>

            <Box>
              <Text size="sm" c="dimmed">
                <strong>Instructions:</strong>
                <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Copy the embed code above</li>
                  <li>Go to your Shopify product page template</li>
                  <li>Paste this code where you want the review widget to appear</li>
                  <li>Save and publish your changes</li>
                </ol>
              </Text>
            </Box>
          </Stack>
        )}
      </Modal>
    </>
  );
}