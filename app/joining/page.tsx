import type { Metadata } from 'next';
import { JoiningSheet } from '@/components/ar/JoiningSheet';

// A reference sheet for the visual joining test (CLAUDE.md §9). Not linked from the app.
export const metadata: Metadata = { title: 'Joining sheet', robots: { index: false } };

export default function JoiningPage() {
  return <JoiningSheet />;
}
