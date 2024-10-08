import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@styles/globals.scss';

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
  title: 'Magnum Admin panel',
  description: 'Magnum School Admin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
