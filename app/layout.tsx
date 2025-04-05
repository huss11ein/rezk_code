import './globals.css';

export const metadata = {
  title: 'Subscription Tracker',
  description: 'Track all your subscriptions in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 