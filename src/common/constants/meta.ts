import { Metadata } from 'next';

export const meta: Metadata = {
  metadataBase: new URL('https://explorer.hiro.so/'),
  title: 'Stacks Explorer by Hiro',
  description:
    'Explore Stacks, the leading Bitcoin L2. See your transactions, wallet, and network info in real time',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Stacks Explorer by Hiro',
    type: 'website',
    siteName: 'explorer.hiro.so',
    description:
      'Explore transactions and accounts on the Stacks blockchain. Clone any contract and experiment in your browser with the Explorer sandbox.',
    images: '/meta/og.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@stacks',
    creator: '@stacks',
    images: '/meta/og.jpg',
  },
  icons: {
    icon: {
      type: 'image/svg+xml',
      url: '/meta/favicon.svg',
    },
  },
};
