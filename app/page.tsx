import { ReleaseNotesClient } from '@/components/release-notes-client';

export const metadata = {
  title: 'Release Notes - QuantCopier',
  description: 'Latest updates and features for QuantCopier MT5 Signal Copier',
};

export default function Page() {
  return <ReleaseNotesClient />;
}
