import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Sans_Kannada } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const kannada = Noto_Sans_Kannada({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-kannada',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GauBharath — ಗೋಭಾರತ್ | Gau Seva, Gau Preethi',
  description:
    'A sacred endeavour in Gau Seva and Gau Preethi — handmade dhoop, herbal oils, soaps and more from the GauBharath shala.',
  openGraph: {
    title: 'GauBharath — Gau Seva, Gau Preethi',
    description: 'Traditional gau-seva products from our shala in Mangaluru.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${kannada.variable}`}>
      <body className="bg-ink text-cream-100 font-sans antialiased">
        <SmoothScroll>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
