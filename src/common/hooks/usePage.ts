import { useRouter } from 'next/router';

export enum Page {
  AddressPage = 'address-page',
}

export function usePage() {
  const router = useRouter();
  const url = router.pathname;
  if (url.includes('address')) {
    return Page.AddressPage;
  } else {
    return null;
  }
}
