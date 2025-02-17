import { Helmet } from 'react-helmet-async';

interface SchemaOrgProps {
  path: string;
  data?: any;
}

export function SchemaOrg({ path, data }: SchemaOrgProps) {
  // Load base schema
  const baseSchema = require('/public/schema.org.json');

  // Add page-specific schema based on path
  let pageSchema = {};
  
  if (path.startsWith('/article/')) {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data?.title,
      "image": data?.image_url,
      "author": {
        "@type": "Person",
        "name": data?.author
      },
      "publisher": {
        "@id": "https://technikaz.com/#organization"
      },
      "datePublished": data?.created_at,
      "dateModified": data?.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://technikaz.com${path}`
      }
    };
  } else if (path.startsWith('/product/')) {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data?.name,
      "image": data?.image_url,
      "description": `${data?.name} - Full Specification and Review`,
      "brand": {
        "@type": "Brand",
        "name": data?.brand
      },
      "offers": {
        "@type": "Offer",
        "price": data?.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    };
  }

  return (
    <Helmet>
      {/* Base Schema */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>

      {/* Page-specific Schema */}
      {Object.keys(pageSchema).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(pageSchema)}
        </script>
      )}
    </Helmet>
  );
}