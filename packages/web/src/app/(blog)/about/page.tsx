import { getPublicSettings } from '@/lib/api-server';
import { AboutClient } from './about-client';
import { notFound } from 'next/navigation';

export const metadata = {
  title: '关于',
  description: '关于本站',
};

export default async function AboutPage() {
  const settings = await getPublicSettings();

  if (settings?.aboutPageEnabled === 'false') {
    notFound();
  }

  return (
    <AboutClient
      content={settings?.aboutPageContent || ''}
      template={settings?.aboutPageTemplate || 'standard'}
    />
  );
}
