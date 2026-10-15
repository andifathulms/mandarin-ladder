import { notFound } from 'next/navigation';
import { getAllSummaries, getCurriculum, getPlacement } from '@/lib/content/load';
import { PlacementRunner } from '@/components/check/PlacementRunner';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { visualData } from '@/lib/content/visualData';

export const metadata = { title: 'Cek dasar' };

export default function PlacementPage() {
  const placement = getPlacement();
  if (!placement) notFound();
  return (
    <VisualDataProvider value={visualData()}>
      <PlacementRunner placement={placement} rungs={getCurriculum()} lessons={getAllSummaries()} />
    </VisualDataProvider>
  );
}
