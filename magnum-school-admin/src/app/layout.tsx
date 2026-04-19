import './globals.css';
import { Toaster } from 'sonner';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Loading from '@/components/loading';
import { Suspense } from 'react';
import NextTopbar from '@/components/NextTopbar';

// Lato font configurations
const lato = localFont({
  src: [
    {
      path: '../../public/fonts/Lato-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Lato-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Lato-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Lato-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Lato-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
  ],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: {
    default: 'Magnum School Admin',
    template: '%s | Magnum School Admin',
  },
  description:
    'Magnum School Admin dashboard — manage students, vendors, and school settings securely.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  applicationName: 'Magnum School Admin',
  authors: [{ name: 'Magnum' }],
  keywords: [
    'Magnum',
    'Magnum School Admin',
    'school admin',
    'school dashboard',
    'student management',
    'vendor management',
    'school analytics',
  ],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/assets/images/MAIN_LOGO.webp',
  },
  openGraph: {
    type: 'website',
    siteName: 'Magnum School Admin',
    title: 'Magnum School Admin',
    description:
      'Magnum School Admin dashboard — manage students, vendors, and school settings securely.',
    images: [
      {
        url: '/assets/images/MAIN_LOGO.webp',
        width: 512,
        height: 512,
        alt: 'Magnum Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magnum School Admin',
    description:
      'Magnum School Admin dashboard — manage students, vendors, and school settings securely.',
    images: ['/assets/images/MAIN_LOGO.webp'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased overflow-hidden`}>
        <NextTopbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
