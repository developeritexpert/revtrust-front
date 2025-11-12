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
import { BRAND_API ,REVIEW_API} from '../../../utils/apiUrl';
import { useRef, useState } from 'react';

export default function BrandsPage() {
  const router = useRouter();
  const tableRef = useRef();
  const [embedModalOpened, { open: openEmbedModal, close: closeEmbedModal }] = useDisclosure(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

    // ✅ NEW state for review modal
  const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
  const [selectedReviewBrand, setSelectedReviewBrand] = useState(null);


  const fetchReviewCountForBrand = async (brandId) => {
    try {
      const token = useAuthStore.getState().token;
  
      // We'll hit the same /reviews endpoint with ?brandId and type=all
      const response = await axiosWrapper(
        'get',
        `${REVIEW_API.GET_ALL_REVIEWS}?brandId=${brandId}&type=all`,
        {},
        token
      );
  
      // Assuming response.data.data contains reviews array
      return response?.data?.data?.length || 0;
    } catch (err) {
      console.error('Error fetching review count for brand:', err);
      return 0;
    }
  };
  

  const fetchBrands = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();
  
    const response = await axiosWrapper(
      'get',
      `${BRAND_API.GET_ALL_BRANDS}?${queryString}`,
      {},
      token
    );
  
    let brands = response.data.data || [];
  
    // ✅ Fetch accurate review counts
    const updatedBrands = await Promise.all(
      brands.map(async (brand) => {
        const accurateCount = await fetchReviewCountForBrand(brand._id);
        return {
          ...brand,
          totalReviews: accurateCount, // Replace mismatched count
        };
      })
    );
  
    return { ...response.data, data: updatedBrands };
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
    return `<div class="revs-review-widget-container" 
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

    // ✅ Open review type modal
  const handleShowReviewOptions = (brand) => {
    setSelectedReviewBrand(brand);
    openReviewModal();
  };

  const handleRedirectToReviews = (type) => {
    if (!selectedReviewBrand) return;
    closeReviewModal();
    router.push(`/admin/reviews?brandId=${selectedReviewBrand._id}&type=${type}`);
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
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleShowReviewOptions(item)}
            title="View Reviews"
          >
            <IconMessage size={14} opacity={0.6} />
          </ActionIcon>
          <Text
            size="sm"
            fw={500}
            style={{ cursor: 'pointer' }}
            onClick={() => handleShowReviewOptions(item)}
          >
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

            {/* ✅ Review Selection Modal */}
      <Modal
        opened={reviewModalOpened}
        onClose={closeReviewModal}
        centered
        title={
          <Group>
            <IconMessage size={20} />
            <Text fw={600}>
              {selectedReviewBrand
                ? `View Reviews for ${selectedReviewBrand.name}`
                : 'View Reviews'}
            </Text>
          </Group>
        }
      >
        <Stack gap="md">
          <Button
            color="blue"
            fullWidth
            onClick={() => handleRedirectToReviews('brand')}
          >
            🔹 Only Brand Reviews
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleRedirectToReviews('all')}
          >
            🔸 Brand + Product Reviews
          </Button>
        </Stack>
      </Modal>

      {/* ✅ Embed Code Modal */}
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

      {/* Existing Shopify Embed Code Section */}
      <Box>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>Product Page Widget:</Text>
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

      {/* ✅ NEW: Product Page Widget Section */}
      <Box mt="md" pt="md" style={{ borderTop: '1px solid #eee' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={600}>Review Page Widget</Text>
          <CopyButton
            value={`<div id="revsBrandReviewWidget" data-brandid="${selectedBrand._id}"></div>\n<script src="https://revtrust-front.onrender.com/review-page-widget.js" defer></script>`}
            timeout={2000}
          >
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
{`<div id="revsBrandReviewWidget" data-brandid="${selectedBrand._id}"></div>
<script src="https://revtrust-front.onrender.com/review-page-widget.js" defer></script>`}
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
            <li>Copy either embed code above</li>
            <li>Paste it into your Shopify or product page where you want the review widget to appear</li>
            <li>Ensure the <code>data-brandid</code> matches your brand’s ID</li>
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