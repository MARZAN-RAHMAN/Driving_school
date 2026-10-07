import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BusinessSettings, FAQItem, Instructor, LessonPackage, LocationArea, LocalTestCentre } from "@/types";

export const BASE_PRODUCTION_URL = "https://nextdrive.uk";

/**
 * Dynamically resolves Next.js Metadata from admin-controlled PageSEO records in the Database.
 * This ensures that when an admin edits Title, Description, Robots, OG Image or Canonical in the SEO Manager,
 * it immediately reflects in the server-rendered HTML.
 */
export async function getPageMetadata(
  urlPath: string,
  fallback?: {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string[];
  }
): Promise<Metadata> {
  const [globalSettings, businessSettings, pageSeo] = await Promise.all([
    db.getGlobalSEOSettings(),
    db.getBusinessSettings(),
    db.getPageSEO(urlPath),
  ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    globalSettings.canonicalBaseUrl ||
    BASE_PRODUCTION_URL;

  const resolvedTitle =
    pageSeo?.title ||
    fallback?.title ||
    `${businessSettings.businessName} | Manchester Driving Academy`;

  const resolvedDescription =
    pageSeo?.metaDescription ||
    fallback?.description ||
    globalSettings.defaultMetaDescription ||
    `DVSA-approved driving tuition across Manchester with ${businessSettings.businessName}. High pass rates, modern dual-control automatic & manual fleet.`;

  const resolvedCanonical =
    pageSeo?.canonicalUrl ||
    fallback?.canonical ||
    `${baseUrl}${urlPath === "/" ? "" : urlPath}`;

  const resolvedOgImage =
    pageSeo?.ogImage ||
    businessSettings.ogImageUrl ||
    globalSettings.defaultOgImage ||
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop";

  const isNoIndex = pageSeo?.indexStatus === "NOINDEX";
  const isNoFollow = pageSeo?.followStatus === "NOFOLLOW";

  const resolvedKeywords =
    pageSeo?.secondaryKeywords && pageSeo.secondaryKeywords.length > 0
      ? pageSeo.secondaryKeywords
      : fallback?.keywords || [
          "driving lessons manchester",
          "driving school manchester",
          "dvsa driving instructor",
        ];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: resolvedCanonical,
    },
    robots: {
      index: !isNoIndex && (globalSettings.defaultRobots?.index ?? true),
      follow: !isNoFollow && (globalSettings.defaultRobots?.follow ?? true),
      nocache: false,
      googleBot: {
        index: !isNoIndex && (globalSettings.defaultRobots?.index ?? true),
        follow: !isNoFollow && (globalSettings.defaultRobots?.follow ?? true),
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    authors: [{ name: businessSettings.businessName }],
    keywords: resolvedKeywords,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: resolvedCanonical,
      siteName: businessSettings.businessName,
      type: (pageSeo?.ogType as "website" | "article") || "website",
      locale: "en_GB",
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedOgImage],
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${BASE_PRODUCTION_URL}${item.url}`,
    })),
  };
}

/**
 * Generates Schema.org Course / Service JSON-LD
 */
export function getCourseSchema(pkg: LessonPackage, settings: BusinessSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": pkg.title,
    "description": pkg.description,
    "provider": {
      "@type": "Organization",
      "name": settings.businessName,
      "sameAs": BASE_PRODUCTION_URL,
    },
    "offers": {
      "@type": "Offer",
      "price": pkg.price,
      "priceCurrency": "GBP",
      "category": pkg.transmission,
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-01-01",
    },
  };
}

/**
 * Generates Schema.org LocalBusiness / DrivingSchool JSON-LD for Location Pages
 */
export function getLocalBusinessSchema(
  location: LocationArea,
  settings: BusinessSettings,
  testCentres: LocalTestCentre[] = []
) {
  const primaryPostcode = location.postcodes[0] || "M1 5AN";
  const relatedTestCentre = testCentres.find(
    (tc) => tc.associatedLocationSlug === location.slug || tc.name === location.testCenterName
  );

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "DrivingSchool"],
    "@id": `${BASE_PRODUCTION_URL}/locations/${location.slug || "manchester"}#localbusiness`,
    "name": `${settings.businessName} - ${location.name}`,
    "url": `${BASE_PRODUCTION_URL}/locations/${location.slug || ""}`,
    "telephone": settings.phone,
    "email": settings.email,
    "priceRange": "££",
    "description":
      location.description ||
      `Professional driving lessons across ${location.name} with certified DVSA Grade A driving instructors.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.headOfficeAddress,
      "addressLocality": location.name,
      "addressRegion": "Greater Manchester",
      "postalCode": primaryPostcode,
      "addressCountry": "GB",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.latitude || 53.4808,
      "longitude": location.longitude || -2.2426,
    },
    "areaServed": location.postcodes.map((pc) => ({
      "@type": "AdministrativeArea",
      "name": pc,
    })),
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": settings.weekdayOpeningTime || "07:00",
        "closes": settings.weekdayClosingTime || "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": settings.weekendOpeningTime || "08:00",
        "closes": settings.weekendClosingTime || "18:00",
      },
    ],
    ...(relatedTestCentre && {
      "knowsAbout": [
        `${relatedTestCentre.name} Practical Driving Test Routes`,
        "DVSA Driving Test Standards",
        "Manual and Automatic Tuition",
      ],
    }),
  };
}

/**
 * Generates Schema.org FAQPage JSON-LD
 */
export function getFaqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org Person JSON-LD for Driving Instructors
 */
export function getInstructorSchema(instructor: Instructor, settings: BusinessSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": instructor.name,
    "jobTitle": "DVSA Grade A Driving Instructor",
    "worksFor": {
      "@type": "DrivingSchool",
      "name": settings.businessName,
      "url": BASE_PRODUCTION_URL,
    },
    "image": instructor.avatar,
    "description": instructor.bio,
    "knowsAbout": [
      `${instructor.transmission} Driving Tuition`,
      "DVSA Practical Driving Test",
      ...(instructor.areasCovered || instructor.areas || []),
    ],
  };
}
