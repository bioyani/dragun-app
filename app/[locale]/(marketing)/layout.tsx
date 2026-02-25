import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1b2b] text-white selection:bg-[#d4af37] selection:text-[#0b1b2b]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
