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
      'Explore blocks, transactions, accounts, and smart contracts on the Stacks blockchain with real-time data.',
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
