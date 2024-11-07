import { ColorModeProvider } from '@/components/ui/color-mode';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

// Server Component
export default async function ThemeProvider({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const theme = cookieStore.get('stacks-explorer-theme')?.value || 'light';

  return <ColorModeProvider forcedTheme={theme}>{children}</ColorModeProvider>;
}
