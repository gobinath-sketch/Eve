import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PageShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  fullscreen?: boolean; // For pages that should be 100vh like the hero
}

export default function PageShell({ children, hideFooter, fullscreen }: PageShellProps) {
  if (fullscreen) {
    return (
      <div className="relative flex h-screen flex-col overflow-hidden bg-[#000000]">
        {/* Spotlight and Premium Grid */}
        <div className="absolute inset-0 bg-spotlight-green pointer-events-none z-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-premium-masked pointer-events-none z-0" aria-hidden="true" />
        <Navbar />
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-2 md:px-6">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#000000]">
      {/* Premium Grid Background that fades out at the top of the subpage */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-grid-premium-masked pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-spotlight-green pointer-events-none z-0" aria-hidden="true" />

      <Navbar />
      <main className="relative z-10 pt-20">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
