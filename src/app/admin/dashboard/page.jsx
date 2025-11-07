// app/dashboard/page.tsx or wherever your dashboard is
import { Metadata } from "next";
import DashboardPage from '../../../components/admin-dashboard/dashboard/DashboardView';

export default function Dashboard() {
  return (
    <DashboardPage />
  );
}

export const metadata = {
  title: 'Analytics Dashboard',
  description: 'View your brands, products, and reviews analytics.'
};