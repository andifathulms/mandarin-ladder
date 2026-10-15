import { getAllSummaries, getCurriculum, getPlacement, getTestPool } from '@/lib/content/load';
import { HomeView } from '@/components/ladder/HomeView';

export default function Home() {
  const rungs = getCurriculum();
  return (
    <HomeView
      rungs={rungs}
      lessons={getAllSummaries()}
      testRungs={rungs.filter((r) => getTestPool(r.id)).map((r) => r.id)}
      hasPlacement={!!getPlacement()}
    />
  );
}
