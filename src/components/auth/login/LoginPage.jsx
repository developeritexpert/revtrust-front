'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Container,
  Text,
  Box,
  Group,
  Anchor,
  Stack,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLock, IconMail } from '@tabler/icons-react';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';

// Loading fallback component
function LoadingFallback() {
  return (
    <Container size={460} my={80}>
      <Box className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" />
          <Text c="dimmed" size="sm">
            Loading login page...
          </Text>
        </div>
      </Box>
    </Container>
  );
}

// Login content component
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuth = useAuthStore((state) => state.isAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuth()) {
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
    }
  }, [isAuth, router, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter both email and password',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosWrapper('post', API_URL.LOGIN_USER, { email, password });

      if (res.data.user.role !== 'ADMIN' && res.data.user.role !== 'SUPER_ADMIN') {
        notifications.show({
          title: 'Access Denied',
          message: 'You do not have permission to access the admin panel',
          color: 'red',
        });
        setLoading(false);
        return;
      }

      const expiry = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      setAuth(res.data.user, res.data.token, expiry);

      notifications.show({
        title: 'Success',
        message: `Welcome back, ${res.data.user.name}!`,
        color: 'green',
      });

      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
    } catch (err) {
      notifications.show({
        title: 'Login Failed',
        message: err?.message || 'Invalid credentials. Please try again.',
        color: 'red',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Container size={460} py={80}>
        <Box mb="xl">
          <Title ta="center" order={1} className="text-gray-900 dark:text-white">
            Welcome Back
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Sign in to access your admin dashboard
          </Text>
        </Box>

        <Paper withBorder shadow="lg" p={40} radius="md" className="border-gray-200 dark:border-gray-700">
          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={16} />}
                required
                disabled={loading}
                size="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                leftSection={<IconLock size={16} />}
                required
                disabled={loading}
                size="md"
              />

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  checked={remember}
                  onChange={(e) => setRemember(e.currentTarget.checked)}
                  disabled={loading}
                />
                <Anchor size="sm" href="/forgot-password" className="hover:underline">
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                type="submit"
                fullWidth
                size="md"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="xl">
            Don't have an account?{' '}
            <Anchor size="sm" href="/register" className="hover:underline">
              Create account
            </Anchor>
          </Text>
        </Paper>

        <Text c="dimmed" size="xs" ta="center" mt="xl">
          <Anchor size="xs" href="/" className="hover:underline">
            ← Back to Home
          </Anchor>
        </Text>
      </Container>
    </div>
  );
}

// Main export with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}