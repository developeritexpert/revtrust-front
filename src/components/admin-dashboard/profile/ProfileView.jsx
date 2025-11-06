'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  TextInput, 
  Button, 
  Avatar, 
  Group, 
  Stack, 
  PasswordInput,
  Tabs,
  FileButton,
  Text,
  Loader,
  Center,
  Box,
  Divider,
  Badge,
  Alert
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  IconUser, 
  IconLock, 
  IconUpload, 
  IconCheck, 
  IconX,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconInfoCircle
} from '@tabler/icons-react';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { PROFILE_API } from '../../../utils/apiUrl';

export default function ProfileView() {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const token = useAuthStore((state) => state.token);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    role: '',
    isEmailVerified: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        notifications.show({
          title: 'Authentication Required',
          message: 'Please log in to view your profile',
          color: 'red',
          icon: <IconX size={16} />
        });
        return;
      }
      console.log(token)
      const response = await axiosWrapper(
        'get',
        PROFILE_API.GET_PROFILE,
        {},
        token
      );
      
      console.log(PROFILE_API.GET_PROFILE);
      const userData = response.data;
      
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        avatar: userData.avatar || '',
        role: userData.role || 'USER',
        isEmailVerified: userData.isEmailVerified || false
      });
      
      setPreviewUrl(userData.avatar || '');
    } catch (error) {
      console.error('Fetch profile error:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to load profile',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notifications.show({
          title: 'File Too Large',
          message: 'Please select an image smaller than 5MB',
          color: 'red',
          icon: <IconX size={16} />
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        notifications.show({
          title: 'Invalid File Type',
          message: 'Please select an image file',
          color: 'red',
          icon: <IconX size={16} />
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProfileUpdate = async () => {
    // Validation
    if (!profileData.name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Name is required',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    if (!profileData.email.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Email is required',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', profileData.name.trim());
      formData.append('email', profileData.email.trim());
      
      if (profileData.phoneNumber) {
        formData.append('phoneNumber', profileData.phoneNumber.trim());
      }
      
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const response = await axiosWrapper(
        'put',
        PROFILE_API.UPDATE_PROFILE,
        formData,
        token,
        { 'Content-Type': 'multipart/form-data' }
      );

      const updatedData = response.data;
      
      setProfileData({
        name: updatedData.name || '',
        email: updatedData.email || '',
        phoneNumber: updatedData.phoneNumber || '',
        avatar: updatedData.avatar || '',
        role: updatedData.role || 'USER',
        isEmailVerified: updatedData.isEmailVerified || false
      });
      
      setPreviewUrl(updatedData.avatar || '');
      setSelectedFile(null);
      
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      console.error('Update profile error:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to update profile',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      notifications.show({
        title: 'Validation Error',
        message: 'Current password is required',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    if (!passwordData.newPassword) {
      notifications.show({
        title: 'Validation Error',
        message: 'New password is required',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      notifications.show({
        title: 'Validation Error',
        message: 'Password must be at least 6 characters',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifications.show({
        title: 'Validation Error',
        message: 'New passwords do not match',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      notifications.show({
        title: 'Validation Error',
        message: 'New password must be different from current password',
        color: 'yellow',
        icon: <IconInfoCircle size={16} />
      });
      return;
    }

    try {
      setLoading(true);
      
      await axiosWrapper(
        'put',
        PROFILE_API.CHANGE_PASSWORD,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        token
      );

      notifications.show({
        title: 'Success',
        message: 'Password changed successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to change password',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <Center style={{ height: '400px' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading profile...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Profile Settings</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Manage your account information and security
            </Text>
          </div>
          {/* <Badge 
            size="lg" 
            variant="light" 
            color={profileData.isEmailVerified ? 'green' : 'yellow'}
            leftSection={<IconShieldCheck size={14} />}
          >
            {profileData.isEmailVerified ? 'Verified' : 'Unverified'}
          </Badge> */}
        </Group>

        <Tabs defaultValue="profile" variant="pills">
          <Tabs.List mb="xl">
            <Tabs.Tab 
              value="profile" 
              leftSection={<IconUser size={18} />}
            >
              Profile Information
            </Tabs.Tab>
            <Tabs.Tab 
              value="password" 
              leftSection={<IconLock size={18} />}
            >
              Change Password
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <Stack gap="xl">
              <Box>
                <Text size="sm" fw={500} mb="md" c="dimmed">
                  PROFILE PHOTO
                </Text>
                <Group>
                  <Avatar 
                    src={previewUrl} 
                    size={120} 
                    radius={120}
                    alt={profileData.name}
                  >
                    {profileData.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack gap="xs">
                    <FileButton
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/jpg"
                    >
                      {(props) => (
                        <Button 
                          {...props} 
                          variant="light" 
                          leftSection={<IconUpload size={16} />}
                          size="sm"
                          disabled={loading}
                        >
                          Upload New Photo
                        </Button>
                      )}
                    </FileButton>
                    {selectedFile && (
                      <Text size="xs" c="dimmed">
                        Selected: {selectedFile.name}
                      </Text>
                    )}
                    <Text size="xs" c="dimmed">
                      JPG, PNG or JPEG. Max size 5MB.
                    </Text>
                  </Stack>
                </Group>
              </Box>

              <Divider />

              <Box>
                <Text size="sm" fw={500} mb="md" c="dimmed">
                  PERSONAL INFORMATION
                </Text>
                <Stack gap="md">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    leftSection={<IconUser size={16} />}
                    required
                    disabled={loading}
                  />

                  <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    leftSection={<IconMail size={16} />}
                    required
                    disabled={loading}
                    rightSection={
                      profileData.isEmailVerified && (
                        <IconCheck size={16} color="green" />
                      )
                    }
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number (optional)"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    leftSection={<IconPhone size={16} />}
                    disabled={loading}
                  />

                  <TextInput
                    label="Role"
                    value={profileData.role}
                    leftSection={<IconShieldCheck size={16} />}
                    disabled
                    description="Your account role"
                  />
                </Stack>
              </Box>

              {/* {!profileData.isEmailVerified && (
                <Alert 
                  icon={<IconInfoCircle size={16} />} 
                  title="Email Not Verified" 
                  color="yellow"
                  variant="light"
                >
                  Your email address is not verified. Please check your inbox for a verification link.
                </Alert>
              )} */}

              <Group justify="flex-end" mt="md">
                <Button 
                  onClick={handleProfileUpdate}
                  loading={loading}
                  leftSection={<IconCheck size={16} />}
                  size="md"
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="password">
            <Stack gap="xl">
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                title="Password Requirements" 
                color="blue"
                variant="light"
              >
                Your password must be at least 6 characters long and different from your current password.
              </Alert>

              <Stack gap="md">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  disabled={loading}
                />

                <PasswordInput
                  label="New Password"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  disabled={loading}
                  description="Minimum 6 characters"
                />

                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  error={
                    passwordData.confirmPassword && 
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "Passwords don't match"
                      : null
                  }
                />
              </Stack>

              <Group justify="flex-end" mt="md">
                <Button 
                  onClick={handlePasswordChange}
                  loading={loading}
                  leftSection={<IconLock size={16} />}
                  size="md"
                  color="red"
                >
                  Change Password
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}