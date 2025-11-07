'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Card,
  Text,
  Group,
  RingProgress,
  SimpleGrid,
  Paper,
  Title,
  Box,
  Progress,
  Badge,
  Stack,
  Loader,
  Center,
  ThemeIcon,
  rem,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBrandProducthunt,
  IconStar,
  IconTags,
  IconActivity,
} from '@tabler/icons-react';

// Import your actual axiosWrapper
import { axiosWrapper } from '../../../utils/api';
import useAuthStore from '../../../store/useAuthStore';
import { BRAND_API, PRODUCT_API, REVIEW_API } from '../../../utils/apiUrl';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    brands: { total: 0, change: 0 },
    products: { total: 0, change: 0 },
    reviews: { total: 0, change: 0, avgRating: 0 },
    activeProducts: { total: 0, change: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [brandDistribution, setBrandDistribution] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    approved: 0,
    rejected: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = useAuthStore.getState().token;

      // Fetch all data
      const [brandsRes, productsRes, reviewsRes] = await Promise.all([
        axiosWrapper('get', BRAND_API.GET_ALL_BRANDS, {}, token),
        axiosWrapper('get', PRODUCT_API.GET_ALL_PRODUCTS, {}, token),
        axiosWrapper('get', REVIEW_API.GET_ALL_REVIEWS, {}, token),
      ]);

      // Handle nested data structure: response.data.data
      const brands = brandsRes.data?.data || brandsRes.data || brandsRes || [];
      const products = productsRes.data?.data || productsRes.data || productsRes || [];
      const reviews = reviewsRes.data?.data || reviewsRes.data || reviewsRes || [];

      // Ensure they are arrays
      const brandsArray = Array.isArray(brands) ? brands : [];
      const productsArray = Array.isArray(products) ? products : [];
      const reviewsArray = Array.isArray(reviews) ? reviews : [];

      // Calculate stats
      const totalBrands = brandsArray.length;
      const totalProducts = productsArray.length;
      const totalReviews = reviewsArray.length;

      // Calculate average rating from reviews
      const avgRating = totalReviews > 0
        ? (reviewsArray.reduce((sum, review) => {
            const ratingSum = (
              (review.product_store_rating || 0) +
              (review.seller_rating || 0) +
              (review.product_quality_rating || 0) +
              (review.product_price_rating || 0) +
              (review.issue_handling_rating || 0)
            ) / 5;
            return sum + ratingSum;
          }, 0) / totalReviews).toFixed(1)
        : 0;

      // Calculate active products
      const activeProducts = productsArray.filter(p => 
        p.status === 'ACTIVE' || p.isActive
      ).length;

      // Review status distribution
      const approved = reviewsArray.filter(r => r.status === 'ACTIVE').length;
      const rejected = reviewsArray.filter(r => r.status === 'INACTIVE').length;

      setStats({
        brands: { total: totalBrands, change: 12 },
        products: { total: totalProducts, change: 8 },
        reviews: { total: totalReviews, change: 15, avgRating: parseFloat(avgRating) },
        activeProducts: { total: activeProducts, change: 5 },
      });

      setReviewStats({ approved, rejected });

      // Brand distribution for ring progress
      const brandProductCount = {};
      productsArray.forEach(product => {
        const brandName = product.brandId?.name || 'Unknown';
        brandProductCount[brandName] = (brandProductCount[brandName] || 0) + 1;
      });

      const brandDist = Object.entries(brandProductCount)
        .slice(0, 5)
        .map(([name, count]) => ({
          name,
          count,
          percentage: ((count / totalProducts) * 100).toFixed(1),
        }));

      setBrandDistribution(brandDist);

      // Recent activity (last 5 reviews)
      const recent = reviewsArray
        .slice(0, 5)
        .map(review => {
          const avgReviewRating = (
            (review.product_store_rating || 0) +
            (review.seller_rating || 0) +
            (review.product_quality_rating || 0) +
            (review.product_price_rating || 0) +
            (review.issue_handling_rating || 0)
          ) / 5;
          
          return {
            user: review.name || 'Anonymous',
            action: `Left a ${avgReviewRating.toFixed(1)}-star review`,
            time: new Date(review.createdAt).toLocaleString(),
            status: review.status?.toLowerCase() || 'pending',
            product: review.productId?.name || review.brandId?.name || 'Item',
          };
        });

      setRecentActivity(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  const statCards = [
    {
      title: 'Total Brands',
      value: stats.brands.total.toString(),
      diff: stats.brands.change,
      icon: IconTags,
      color: 'blue',
    },
    {
      title: 'Total Products',
      value: stats.products.total.toString(),
      diff: stats.products.change,
      icon: IconBrandProducthunt,
      color: 'teal',
    },
    {
      title: 'Total Reviews',
      value: stats.reviews.total.toString(),
      diff: stats.reviews.change,
      icon: IconStar,
      color: 'yellow',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts.total.toString(),
      diff: stats.activeProducts.change,
      icon: IconActivity,
      color: 'grape',
    },
  ];

  const colors = ['blue', 'teal', 'yellow', 'grape', 'pink'];

  return (
    <Box>
      <Title order={2} mb="lg">
        Dashboard Overview
      </Title>

      {/* Stats Cards Section */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="lg">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;
          
          return (
            <Card key={stat.title} padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl" mt="xs">
                    {stat.value}
                  </Text>
                </Box>
                <ThemeIcon size={50} radius="md" variant="light" color={stat.color}>
                  <Icon size={28} stroke={1.5} />
                </ThemeIcon>
              </Group>
              <Group gap="xs">
                <Text c={stat.diff > 0 ? 'teal' : 'red'} fw={700} size="sm">
                  {stat.diff > 0 ? '+' : ''}{stat.diff}%
                </Text>
                <DiffIcon size={16} stroke={2} />
                <Text c="dimmed" size="sm">
                  vs last month
                </Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Main Grid Section */}
      <Grid>
        {/* Performance Metrics - Progress Bars (Restored Original) */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={4}>Performance Overview</Title>
            </Group>
            
            <Stack gap="lg">
              {/* Brand Coverage */}
              <Box>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                      <IconTags style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>Brand Coverage</Text>
                  </Group>
                  <Badge size="md" variant="light" color="blue">
                    {stats.brands.total > 0 ? 100 : 0}%
                  </Badge>
                </Group>
                <Progress 
                  value={stats.brands.total > 0 ? 100 : 0} 
                  color="blue" 
                  size="md"
                  radius="xl"
                />
              </Box>

              {/* Product Catalog */}
              <Box>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
                      <IconBrandProducthunt style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>Product Catalog</Text>
                  </Group>
                  <Badge size="md" variant="light" color="teal">
                    {stats.products.total > 0 ? Math.min(100, (stats.products.total / 100) * 100).toFixed(0) : 0}%
                  </Badge>
                </Group>
                <Progress 
                  value={stats.products.total > 0 ? Math.min(100, (stats.products.total / 100) * 100) : 0} 
                  color="teal" 
                  size="md"
                  radius="xl"
                />
              </Box>

              {/* Average Rating */}
              <Box>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="yellow" variant="light">
                      <IconStar style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>Average Rating</Text>
                  </Group>
                  <Badge size="md" variant="light" color="yellow">
                    {stats.reviews.avgRating}/5 ({((stats.reviews.avgRating / 5) * 100).toFixed(0)}%)
                  </Badge>
                </Group>
                <Progress 
                  value={(stats.reviews.avgRating / 5) * 100} 
                  color="yellow" 
                  size="md"
                  radius="xl"
                />
              </Box>

              {/* Active Products */}
              <Box>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="grape" variant="light">
                      <IconActivity style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>Active Products</Text>
                  </Group>
                  <Badge size="md" variant="light" color="grape">
                    {stats.products.total > 0 
                      ? ((stats.activeProducts.total / stats.products.total) * 100).toFixed(0) 
                      : 0}%
                  </Badge>
                </Group>
                <Progress 
                  value={stats.products.total > 0 
                    ? (stats.activeProducts.total / stats.products.total) * 100 
                    : 0} 
                  color="grape" 
                  size="md"
                  radius="xl"
                />
              </Box>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Review Status - Ring Progress */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Review Status
            </Title>
            <Group justify="center" mb="md">
              <RingProgress
                size={180}
                thickness={16}
                roundCaps
                sections={[
                  { 
                    value: stats.reviews.total > 0 ? (reviewStats.approved / stats.reviews.total) * 100 : 0, 
                    color: 'green', 
                    tooltip: `Approved - ${reviewStats.approved}` 
                  },
                  { 
                    value: stats.reviews.total > 0 ? (reviewStats.rejected / stats.reviews.total) * 100 : 0, 
                    color: 'red', 
                    tooltip: `Pending - ${reviewStats.rejected}` 
                  },
                ]}
                label={
                  <Stack gap={0} align="center">
                    <Text size="xl" fw={700}>
                      {stats.reviews.total}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Total
                    </Text>
                  </Stack>
                }
              />
            </Group>
            <Stack gap="xs">
              <Paper p="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Group gap="xs">
                    <Box w={12} h={12} bg="green" style={{ borderRadius: '50%' }} />
                    <Text size="sm" fw={500}>Approved</Text>
                  </Group>
                  <Badge variant="light" color="green">
                    {reviewStats.approved}
                  </Badge>
                </Group>
              </Paper>
              <Paper p="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Group gap="xs">
                    <Box w={12} h={12} bg="red" style={{ borderRadius: '50%' }} />
                    <Text size="sm" fw={500}>Pending</Text>
                  </Group>
                  <Badge variant="light" color="red">
                    {reviewStats.rejected}
                  </Badge>
                </Group>
              </Paper>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Top Brands */}
        {brandDistribution.length > 0 && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Top Brands by Products
              </Title>
              <Stack gap="md">
                {brandDistribution.map((brand, index) => (
                  <Box key={index}>
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <ThemeIcon 
                          size="sm" 
                          radius="md" 
                          variant="light" 
                          color={colors[index % colors.length]}
                        >
                          <Text size="xs" fw={700}>
                            {index + 1}
                          </Text>
                        </ThemeIcon>
                        <Text size="sm" fw={500}>{brand.name}</Text>
                      </Group>
                      <Badge variant="light" color={colors[index % colors.length]}>
                        {brand.count} ({brand.percentage}%)
                      </Badge>
                    </Group>
                    <Progress 
                      value={parseFloat(brand.percentage)} 
                      color={colors[index % colors.length]} 
                      size="md"
                      radius="xl"
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        )}

        {/* Recent Reviews */}
        <Grid.Col span={{ base: 12, md: brandDistribution.length > 0 ? 6 : 12 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Recent Reviews
            </Title>
            <Stack gap="md">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <Paper key={index} p="md" withBorder radius="md">
                    <Group justify="space-between" mb="xs">
                      <Box style={{ flex: 1 }}>
                        <Group gap="xs" mb={4}>
                          <ThemeIcon size="sm" radius="xl" variant="light">
                            <IconStar style={{ width: rem(12), height: rem(12) }} />
                          </ThemeIcon>
                          <Text fw={600} size="sm">
                            {activity.user}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {activity.action}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          <strong>Product:</strong> {activity.product}
                        </Text>
                      </Box>
                      <Badge
                        color={
                          activity.status === 'active'
                            ? 'green'
                            : activity.status === 'inactive'
                            ? 'red'
                            : 'yellow'
                        }
                        variant="light"
                      >
                        {activity.status}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed" mt="xs">
                      {activity.time}
                    </Text>
                  </Paper>
                ))
              ) : (
                <Paper p="xl" radius="md" withBorder>
                  <Text c="dimmed" ta="center" size="sm">
                    No recent reviews available
                  </Text>
                </Paper>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}