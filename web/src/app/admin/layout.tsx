import { Suspense } from "react";

import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <Suspense fallback={<div className="mb-8 h-10 border-b" />}>
        <AdminNav />
      </Suspense>
      {children}
    </main>
  );
}
