import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { CareerRowActions } from "@/components/admin/career-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminCareers, parseAdminCareerFilters } from "@/features/careers/career-service";

type AdminCareersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = [
  ["", "All statuses"],
  ["DRAFT", "Draft"],
  ["OPEN", "Open"],
  ["CLOSED", "Closed"]
] as const;

const workTypeOptions = [
  ["", "All work types"],
  ["REMOTE", "Remote"],
  ["HYBRID", "Hybrid"],
  ["ONSITE", "Onsite"]
] as const;

export const dynamic = "force-dynamic";

export default async function AdminCareersPage({ searchParams }: AdminCareersPageProps) {
  const filters = parseAdminCareerFilters(await searchParams);
  const content = await getAdminCareers(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Careers</p>
          <h1 className="mt-2 text-3xl font-black">Career / Job Vacancies</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Manage job vacancies, division assignment, work type, employment type, application route, and open/closed status.
          </p>
        </div>
        <Link className={buttonClasses("solid")} href="/admin/careers/new">
          <Plus className="h-4 w-4" />
          Add career
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search career" />
          </label>
          <Select defaultValue={filters.division} name="division">
            <option value="">All divisions</option>
            {content.divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
          <Select defaultValue={filters.workType} name="workType">
            {workTypeOptions.map(([value, label]) => (
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
          <Link className={buttonClasses("ghost")} href="/admin/careers">
            Reset
          </Link>
        </form>
      </Card>

      {content.careers.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Role</Th>
              <Th>Division</Th>
              <Th>Work</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.careers.map((career) => (
              <tr key={career.id}>
                <Td>
                  <div>
                    <p className="font-black text-white">{career.jobTitle}</p>
                    <p className="mt-1 text-xs text-zinc-500">/{career.slug}</p>
                    <p className="mt-2 text-xs text-zinc-400">{career.location || "-"}</p>
                  </div>
                </Td>
                <Td>{career.divisionName || "-"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{career.workType}</Badge>
                    <Badge>{career.employmentType}</Badge>
                  </div>
                </Td>
                <Td>
                  <Badge>{career.status}</Badge>
                </Td>
                <Td>{new Date(career.updatedAt).toLocaleDateString("en-GB")}</Td>
                <Td>
                  <CareerRowActions careerId={career.id} status={career.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No careers found</h2>
          <p className="mt-3 text-zinc-400">Create a career or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
