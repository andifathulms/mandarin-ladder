import { getAllSummaries } from '@/lib/content/load';
import { MeView } from '@/components/MeView';

export const metadata = { title: 'Saya' };

export default function MePage() {
  return <MeView lessons={getAllSummaries()} />;
}
