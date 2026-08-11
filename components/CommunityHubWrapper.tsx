import React, { Suspense } from 'react';
import { CommunityProvider } from '../contexts/CommunityContext';

const CommunityHub = React.lazy(() => import('./CommunityHub'));

export const CommunityHubWrapper: React.FC = () => (
  <CommunityProvider>
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 animate-spin text-jade-500" /></div>}>
      <CommunityHub />
    </Suspense>
  </CommunityProvider>
);