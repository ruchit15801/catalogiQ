import type { Metadata } from 'next';
import "./globals.css";
import ClientLayout from "./ClientLayout";

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'CatalogIQ';

export const metadata: Metadata = {
  title: `${appName} - AI E-commerce Catalog & Shipping Optimizer`,
  description: 'Scale your e-commerce margins instantly. CatalogIQ uses advanced AI to reduce shipping volumetric weight by up to 30%, generate high-converting Ads, and auto-write SEO/AEO optimized product listings for top marketplace rankings.',
  keywords: 'e-commerce shipping optimizer, meesho shipping calculator, ai product catalog, volumetric weight reduction, ai ads generator, product image optimizer, aeo, geo, ecommerce seo, marketplace rankings',
  authors: [{ name: 'CatalogIQ Team' }],
  creator: 'CatalogIQ',
  publisher: 'CatalogIQ',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: `${appName} - AI E-commerce Catalog & Shipping Optimizer`,
    description: 'Scale your e-commerce margins instantly. CatalogIQ uses advanced AI to reduce shipping volumetric weight by up to 30%.',
    type: 'website',
    url: 'https://catalogiq.com',
    siteName: appName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} - AI E-commerce Catalog & Shipping Optimizer`,
    description: 'Scale your e-commerce margins instantly. CatalogIQ uses advanced AI to reduce shipping volumetric weight by up to 30%.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Rich Results JSON-LD for GEO / AEO
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appName,
      operatingSystem: 'Any',
      applicationCategory: 'BusinessApplication',
      description: 'The AI Operating System for Modern E-commerce Sellers. Reduce shipping costs, generate high-converting SEO content, and scale your margins instantly.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12400',
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: appName,
      url: 'https://catalogiq.com',
      logo: 'https://catalogiq.com/logo.png',
      sameAs: [
        'https://twitter.com/catalogiq',
        'https://linkedin.com/company/catalogiq'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: appName,
      url: 'https://catalogiq.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://catalogiq.com/tools?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ClientLayout appName={appName}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
