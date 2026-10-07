import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BookingModalProvider } from "@/context/BookingModalContext";
import { ConfigurableWebsitePopup } from "@/components/booking/ConfigurableWebsitePopup";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, globalSeo, homePageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getGlobalSEOSettings(),
    db.getPageSEO("/"),
  ]);

  const title =
    homePageSeo?.title ||
    settings.metaTitle ||
    `${settings.businessName} | Manchester Driving Academy`;
  const description =
    homePageSeo?.metaDescription ||
    settings.metaDescription ||
    `DVSA-approved driving tuition across Manchester with ${settings.businessName}. Modern dual-control vehicles and certified Grade A ADI instructors.`;

  const baseUrl = globalSeo.canonicalBaseUrl || "https://nextdrive.uk";
  const ogImg = homePageSeo?.ogImage || settings.ogImageUrl || globalSeo.defaultOgImage;

  return {
    title: {
      default: title,
      template: globalSeo.titleTemplate || `%s | ${settings.businessName}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: homePageSeo?.canonicalUrl || baseUrl,
    },
    robots: {
      index: globalSeo.defaultRobots?.index ?? true,
      follow: globalSeo.defaultRobots?.follow ?? true,
    },
    verification: {
      google: globalSeo.googleVerificationCode,
      other: globalSeo.bingVerificationCode
        ? { "msvalidate.01": globalSeo.bingVerificationCode }
        : undefined,
    },
    authors: [{ name: settings.businessName }],
    keywords: homePageSeo?.secondaryKeywords || settings.metaKeywords || [
      "driving lessons manchester",
      "learn to drive manchester",
      "automatic driving lessons",
      "manual driving lessons",
    ],
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: settings.businessName,
      type: "website",
      images: ogImg ? [{ url: ogImg }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await db.getBusinessSettings();
  const postcodeMatch = settings.headOfficeAddress?.match(/[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i);
  const postalCode = postcodeMatch ? postcodeMatch[0] : "M1 5AN";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": "https://nextdrive.uk/#organization",
    "name": settings.businessName,
    "alternateName": settings.tradingName,
    "url": "https://nextdrive.uk",
    "logo": settings.logoUrl || "https://nextdrive.uk/favicon.ico",
    "telephone": settings.phone,
    "email": settings.email,
    "priceRange": "££",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.headOfficeAddress,
      "addressLocality": "Manchester",
      "addressRegion": "Greater Manchester",
      "postalCode": postalCode,
      "addressCountry": "GB",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.4808,
      "longitude": -2.2426,
    },
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": settings.googleRating || "4.9",
      "reviewCount": settings.totalPassesCount || "480",
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-200"
        suppressHydrationWarning
      >
        <BookingModalProvider>
          {children}
          <ConfigurableWebsitePopup />
        </BookingModalProvider>
      </body>
    </html>
  );
}
