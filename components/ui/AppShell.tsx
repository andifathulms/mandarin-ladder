'use client';

import { AppHeader } from './AppHeader';
import { AppNav } from './AppNav';

/** Frame for the four tab places: phone header + content + tab bar, or sidebar + content. */
export function AppShell({ children, headerAside }: { children: React.ReactNode; headerAside?: React.ReactNode }) {
  return (
    <>
      <div className="shell">
        <AppHeader aside={headerAside} />
        {children}
      </div>
      <AppNav />
    </>
  );
}
