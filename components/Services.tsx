import ServicesClient from '@/components/ServicesClient';
import { getContent } from '@/lib/content';

export default async function Services() {
  const content = await getContent('services');
  return <ServicesClient items={content.items.slice(0, 4)} />;
}
