import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <p>©2025 LinePrep</p>
      </footer>
    </div>
  );
}