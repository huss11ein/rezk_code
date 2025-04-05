import dynamic from 'next/dynamic';

// Import the SubscriptionDashboard component with no SSR
const SubscriptionDashboard = dynamic(
  () => import('./components/SubscriptionDashboard'),
  { ssr: false }
);

export default function Home() {
  return <SubscriptionDashboard />;
} 