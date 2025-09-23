import React from 'react';
import LeafletAssetMap from '@/components/LeafletAssetMap';

const AssetsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">AI-based Asset Mapping</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          Layers include Agriculture, Forest Cover, Water Bodies, and Homesteads. Restricted to Madhya Pradesh, Tripura, Odisha, and Telangana.
        </p>
        <LeafletAssetMap />
      </div>
    </div>
  );
};

export default AssetsPage;
