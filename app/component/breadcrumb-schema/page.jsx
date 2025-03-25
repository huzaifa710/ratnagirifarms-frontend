"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const [breadcrumbJSON, setBreadcrumbJSON] = useState("");
  
  useEffect(() => {
    // Map of page paths to their display names
    const pathNames = {
      "/": "Home",
      "/terms-and-conditions": "Terms and Conditions",
      "/privacy": "Privacy Policy",
      "/refund-returns": "Refund and Returns",
      "/shipping": "Shipping Policy",
      "/about-us": "About Us",
      "/products": "Products",
      "/cart": "Cart",
      "/checkout": "Checkout",
      "/orders": "My Orders",
      "/bulk-order": "Bulk Order",
      "/partner-with-us": "Partner With Us",
      "/contact-us": "Contact Us",
    };

    // Generate breadcrumb items based on current path
    const generateBreadcrumbItems = () => {
      const items = [];
      
      // Always add home as first item
      items.push({
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ratnagirifarms.com"
      });
      
      // If not on home page, add the current page
      if (pathname !== "/") {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": pathNames[pathname] || pathname.substring(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          "item": `https://ratnagirifarms.com${pathname}`
        });
      }
      
      return items;
    };

    // Create the JSON-LD schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": generateBreadcrumbItems()
    };
    
    setBreadcrumbJSON(JSON.stringify(schema));
  }, [pathname]);

  return (
    <Script 
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: breadcrumbJSON }}
      strategy="afterInteractive"
    />
  );
}