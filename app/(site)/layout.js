import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink dark:bg-night dark:text-paper">
      <Header />
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
