import { getFriendLinks, getPublicSettings } from '@/lib/api-server';
import { FriendsClient } from './friends-client';
import { notFound } from 'next/navigation';

export const metadata = {
  title: '友情链接',
  description: '友情链接',
};

export default async function FriendsPage() {
  const [links, settings] = await Promise.all([
    getFriendLinks(),
    getPublicSettings(),
  ]);

  if (settings?.friendsPageEnabled === 'false') {
    notFound();
  }

  return (
    <FriendsClient
      links={links || []}
      template={settings?.friendsPageTemplate || 'standard'}
    />
  );
}
