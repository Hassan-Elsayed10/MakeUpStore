import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.almulklillah.com';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const url = `${siteUrl}/${params.locale}/about`;
  return {
    title: 'About Us | Our Story & Values',
    description: 'Learn about our journey, mission, and dedication to providing premium luxury cosmetics and makeup products.',
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteUrl}/en/about`,
        'ar': `${siteUrl}/ar/about`,
      },
    },
    openGraph: {
      title: 'About Us | الْمُلْكُ للهِ',
      description: 'Learn about our journey, mission, and dedication to providing premium luxury cosmetics and makeup products.',
      url,
      type: 'website',
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
