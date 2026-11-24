import HeroClient from '@/components/HeroClient';
import { getContent } from '@/lib/content';

export default async function Hero() {
  const content = await getContent('hero');
  return <HeroClient content={content} />;
}
