import React from "react";
import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard — Catalogue, Orders & Party Bookings",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
      <AdminDashboardClient />
    </div>
  );
}

