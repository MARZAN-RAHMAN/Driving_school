import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BookingModalProvider } from "@/context/BookingModalContext";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getBusinessSettings();

  const title = settings.metaTitle || `${settings.businessName} | London Driving Academy`;
  const description =
    settings.metaDescription ||
    `DVSA-approved driving tuition across London with ${settings.businessName}. Industry-leading pass rates, dual-control modern vehicles, and certified Grade A ADI instructors.`;

  return {
    title: {
      default: title,
      template: `%s | ${settings.businessName}`,
    },
    description,
    metadataBase: new URL("https://nextdrive.uk"),
    authors: [{ name: settings.businessName }],
    keywords: settings.metaKeywords || [
      "driving lessons london",
      "learn to drive",
      "automatic driving lessons",
      "manual driving lessons",
    ],
    openGraph: {
      title,
      description,
      url: "https://nextdrive.uk",
      siteName: settings.businessName,
      type: "website",
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
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
        <BookingModalProvider>{children}</BookingModalProvider>
      </body>
    </html>
  );
}
