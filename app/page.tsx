import { InvoiceDashboard } from "@/components/InvoiceDashboard";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <InvoiceDashboard />
      </div>
    </main>
  );
}
