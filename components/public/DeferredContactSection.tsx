'use client';

import dynamic from 'next/dynamic';

const ContactSectionClient = dynamic(
  () => import('@/components/public/ContactSectionClient'),
  { ssr: false, loading: () => null }
);

export default function DeferredContactSection() {
  return <ContactSectionClient />;
}