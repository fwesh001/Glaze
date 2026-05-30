'use client';

import ComingSoonModal from '../../components/synthesis/ComingSoonModal';
import Footer from '../../components/Footer';

export default function SynthesisPage() {
  // Coming Soon: Synthesis Engine is locked for production deployment
  // Full multi-turn workspace will be enabled in v1.0 release
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <ComingSoonModal />
      </div>
      <div className="px-6 py-8 sm:px-10 lg:px-12">
        <Footer />
      </div>
    </div>
  );
}
