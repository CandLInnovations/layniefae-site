import type { Metadata } from 'next'
import { Inter, Crimson_Text, Dancing_Script } from 'next/font/google'
import './globals.css'
import HeaderWrapper from '@/components/Layout/HeaderWrapper'
import { CartProvider } from '@/components/CartProvider'

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
  display: 'swap',
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Laynie Fae - Sacred Blooms & Pagan Wedding Ceremonies',
    template: '%s | Laynie Fae'
  },
  description: 'Beautiful pagan wedding ceremonies and sacred floral arrangements that honor nature and celebrate your unique love story.',
  keywords: [
    'pagan wedding',
    'handfasting ceremony', 
    'sacred flowers',
    'nature ceremony',
    'spiritual wedding',
    'botanical arrangements',
    'wiccan wedding',
    'earth-based ceremony',
    'ritual florals',
    'sacred union'
  ],
  authors: [{ name: 'Laynie Fae' }],
  creator: 'Laynie Fae',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://layniefae.com',
    siteName: 'Laynie Fae - Sacred Blooms & Ceremonies',
    title: 'Laynie Fae - Sacred Blooms & Pagan Wedding Ceremonies',
    description: 'Beautiful pagan wedding ceremonies and sacred floral arrangements that honor nature and celebrate your unique love story.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laynie Fae - Sacred Blooms & Pagan Wedding Ceremonies',
    description: 'Beautiful pagan wedding ceremonies and sacred floral arrangements that honor nature and celebrate your unique love story.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable} ${dancingScript.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0d192a" />
        <meta name="msapplication-TileColor" content="#0d192a" />
        
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`antialiased bg-midnight-900 text-mist-100 font-sans`}>
        <CartProvider>
          {/* Skip to main content for accessibility */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-plum-600 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>

          {/* Header */}
          <HeaderWrapper />

          {/* Main content wrapper */}
          <div className="flex flex-col min-h-screen pt-20">
            <main id="main" className="flex-grow">
              {children}
            </main>
          </div>
        </CartProvider>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Laynie Fae - Sacred Blooms & Ceremonies",
              "description": "Beautiful pagan wedding ceremonies and sacred floral arrangements that honor nature and celebrate your unique love story.",
              "url": "https://layniefae.com",
              "telephone": "+1-XXX-XXX-XXXX", // Replace with actual phone
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Your City", // Replace with actual city
                "addressRegion": "Your State", // Replace with actual state
                "addressCountry": "US"
              },
              "serviceType": ["Wedding Ceremonies", "Floral Design", "Spiritual Services"],
              "areaServed": "Your Service Area", // Replace with actual area
              "priceRange": "$$"
            })
          }}
        />
      </body>
    </html>
  )
}