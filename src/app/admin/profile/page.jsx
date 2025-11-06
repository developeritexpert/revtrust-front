import { Metadata } from "next";
import ProfileView from '../../../components/admin-dashboard/profile/ProfileView';

export default function ProfilePage() {
  return (
    <>
      <ProfileView />
    </>
  );
}

export const metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile information and security settings.'
};