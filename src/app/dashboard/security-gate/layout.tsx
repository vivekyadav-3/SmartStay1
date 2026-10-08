import { Suspense } from 'react';

export default function SecurityGateLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

