import JsonLd from '@/app/component/JsonLd';
import HomePage from "@/app/home/page";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ratnagiri Farms",
            url: "https://ratnagirifarms.com",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://ratnagirifarms.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
        strategy="afterInteractive"
      />

      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Ratnagiri Farms",
            url: "https://ratnagirifarms.com",
            logo: "https://ratnagirifarms.com/home/ratnagiri1.png",
            description:
              "Premium Alphonso mangoes direct from Ratnagiri orchards",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bankot, Tal. Mandangad",
              addressRegion: "Ratnagiri, Maharashtra",
              postalCode: "415208",
              addressCountry: "IN",
            },
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@ratnagirifarms.com",
              contactType: "customer service",
            },
            sameAs: [
              "https://www.instagram.com/ratnagirifarms",
              // "https://www.facebook.com/ratnagirifarms",
            ],
          }),
        }}
        strategy="afterInteractive"
      />

      <HomePage />
    </>
  );
}
