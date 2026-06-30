import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardStats } from "@/features/products/product-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getAdminDashboardStats();
  const cards = [
    ["Total products", stats.totalProducts],
    ["Published products", stats.publishedProducts],
    ["Total employees", stats.totalEmployees],
    ["Open careers", stats.openCareers],
    ["New contact submissions", stats.newContactSubmissions],
    ["Total partners", stats.totalPartners]
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card className="p-5" key={label}>
            <p className="text-sm font-bold text-zinc-400">{label}</p>
            <strong className="mt-3 block text-3xl font-black">{value}</strong>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-black">Product module is active</h2>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          Manage product catalog entries, gallery images, feature lists, specifications, tech stack, publishing status, and preview public product pages.
        </p>
        <Link className={buttonClasses("solid", "mt-6")} href="/admin/products">
          Manage products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}
