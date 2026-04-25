import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Our Story & Values',
  description: 'Learn about our journey, mission, and dedication to providing premium luxury cosmetics and makeup products.',
  openGraph: {
    title: 'About Us | الْمُلْكُ للهِ',
    description: 'Learn about our journey, mission, and dedication to providing premium luxury cosmetics and makeup products.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
