import Head from 'next/head';
import React from 'react';

interface Props {
  title: string;
  description: string;
  keywords?: string;
  imageUrl: string;
  url: string;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords = 'interact, collaborate, connect, events, projects, users',
  imageUrl,
  url,
  structuredData,
}: Props) => {
  url = 'https://interactnow.in' + url;
  return (
    <Head>
      {/* Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="Interact" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={`${title} | Interact`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Interact" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | Interact`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Head>
  );
};

export default SEO;
