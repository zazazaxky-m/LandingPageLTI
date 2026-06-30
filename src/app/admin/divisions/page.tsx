import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { DivisionRowActions } from "@/components/admin/division-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminDivisions, parseAdminDivisionFilters } from "@/features/divisions/division-service";

type AdminDivisionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = [
  ["", "All statuses"],
  ["VISIBLE", "Visible"],
  ["HIDDEN", "Hidden"]
] as const;

export const dynamic = "force-dynamic";

export default async function AdminDivisionsPage({ searchParams }: AdminDivisionsPageProps) {
  const filters = parseAdminDivisionFilters(await searchParams);
  const content = await getAdminDivisions(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Divisions</p>
          <h1 className="mt-2 text-3xl font-black">Solutions / Divisions</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Manage public solution divisions, display order, visibility, member count, and related visual content.
          </p>
        </div>
        <Link className={buttonClasses("solid")} href="/admin/divisions/new">
          <Plus className="h-4 w-4" />
          Add division
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search division" />
          </label>
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
          <Link className={buttonClasses("ghost")} href="/admin/divisions">
            Reset
          </Link>
        </form>
      </Card>

      {content.divisions.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Division</Th>
              <Th>Status</Th>
              <Th>Members</Th>
              <Th>Related</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.divisions.map((division) => (
              <tr key={division.id}>
                <Td>
                  <div>
                    <p className="font-black text-white">{division.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">/{division.slug}</p>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-400">{division.shortDescription}</p>
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{division.status}</Badge>
                    {division.icon ? <Badge>{division.icon}</Badge> : null}
                  </div>
                </Td>
                <Td>{division.memberCount}</Td>
                <Td>
                  <div className="grid gap-1 text-xs text-zinc-400">
                    <span>{division.counts.products} products</span>
                    <span>{division.counts.employees} employees</span>
                    <span>{division.counts.careers} careers</span>
                  </div>
                </Td>
                <Td>{new Date(division.updatedAt).toLocaleDateString("en-GB")}</Td>
                <Td>
                  <DivisionRowActions divisionId={division.id} slug={division.slug} status={division.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No divisions found</h2>
          <p className="mt-3 text-zinc-400">Create a division or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
