import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-black text-white/60">
        Loading...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
