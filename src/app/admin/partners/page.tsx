import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { PartnerRowActions } from "@/components/admin/partner-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminPartners, parseAdminPartnerFilters } from "@/features/partners/partner-service";

type AdminPartnersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const typeOptions = [
  ["", "All types"],
  ["CLIENT", "Client"],
  ["PARTNER", "Partner"],
  ["ACADEMIC", "Academic"],
  ["VENDOR", "Vendor"],
  ["COLLABORATION", "Collaboration"]
] as const;

const statusOptions = [
  ["", "All statuses"],
  ["VISIBLE", "Visible"],
  ["HIDDEN", "Hidden"]
] as const;

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage({ searchParams }: AdminPartnersPageProps) {
  const filters = parseAdminPartnerFilters(await searchParams);
  const content = await getAdminPartners(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Partners</p>
          <h1 className="mt-2 text-3xl font-black">Partners / Clients / Collaborations</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Manage partner logos, collaboration type, visibility, homepage feature flag, and website links.
          </p>
        </div>
        <Link className={buttonClasses("solid")} href="/admin/partners/new">
          <Plus className="h-4 w-4" />
          Add partner
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search partner" />
          </label>
          <Select defaultValue={filters.type} name="type">
            {typeOptions.map(([value, label]) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select defaultValue={filters.status} name="status">
            {statusOptions.map(([value, label]) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <button className={buttonClasses("solid")} type="submit">
            Filter
          </button>
          <Link className={buttonClasses("ghost")} href="/admin/partners">
            Reset
          </Link>
        </form>
      </Card>

      {content.partners.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Partner</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Featured</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.partners.map((partner) => (
              <tr key={partner.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 text-xs font-black text-lumen-400">
                      {partner.logoUrl ? <img alt={partner.name} className="max-h-9 max-w-14 object-contain" src={partner.logoUrl} /> : partner.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-white">{partner.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">/{partner.slug}</p>
                      {partner.websiteUrl ? <p className="mt-2 text-xs text-zinc-400">{partner.websiteUrl}</p> : null}
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge>{partner.type}</Badge>
                </Td>
                <Td>
                  <Badge>{partner.status}</Badge>
                </Td>
                <Td>{partner.featured ? "Yes" : "No"}</Td>
                <Td>{new Date(partner.updatedAt).toLocaleDateString("en-GB")}</Td>
                <Td>
                  <PartnerRowActions partnerId={partner.id} status={partner.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No partners found</h2>
          <p className="mt-3 text-zinc-400">Create a partner or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
