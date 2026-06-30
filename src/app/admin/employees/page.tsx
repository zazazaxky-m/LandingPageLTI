import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { EmployeeRowActions } from "@/components/admin/employee-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminEmployees, parseAdminEmployeeFilters } from "@/features/employees/employee-service";

type AdminEmployeesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = [
  ["", "All statuses"],
  ["ACTIVE", "Active"],
  ["INACTIVE", "Inactive"]
] as const;

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage({ searchParams }: AdminEmployeesPageProps) {
  const filters = parseAdminEmployeeFilters(await searchParams);
  const content = await getAdminEmployees(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Employees</p>
          <h1 className="mt-2 text-3xl font-black">Employee / Team</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Manage team profiles, division assignment, skills, experience, social links, active status, and public ordering.
          </p>
        </div>
        <Link className={buttonClasses("solid")} href="/admin/employees/new">
          <Plus className="h-4 w-4" />
          Add employee
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search employee, role, skill" />
          </label>
          <Select defaultValue={filters.status} name="status">
            {statusOptions.map(([value, label]) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select defaultValue={filters.division} name="division">
            <option value="">All divisions</option>
            {content.divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
          <button className={buttonClasses("solid")} type="submit">
            Filter
          </button>
          <Link className={buttonClasses("ghost")} href="/admin/employees">
            Reset
          </Link>
        </form>
      </Card>

      {content.employees.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Division</Th>
              <Th>Status</Th>
              <Th>Skills</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.employees.map((employee) => (
              <tr key={employee.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 text-xs font-black text-lumen-400">
                      {employee.photoUrl ? <img alt={employee.name} className="h-full w-full object-cover" src={employee.photoUrl} /> : employee.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-white">{employee.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">/{employee.slug}</p>
                      <p className="mt-2 text-xs text-zinc-400">{employee.role}</p>
                    </div>
                  </div>
                </Td>
                <Td>{employee.divisionName || "-"}</Td>
                <Td>
                  <Badge>{employee.status}</Badge>
                </Td>
                <Td>
                  <div className="flex max-w-sm flex-wrap gap-2">
                    {employee.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                    {employee.skillCount > 5 ? <Badge>+{employee.skillCount - 5}</Badge> : null}
                  </div>
                </Td>
                <Td>{new Date(employee.updatedAt).toLocaleDateString("en-GB")}</Td>
                <Td>
                  <EmployeeRowActions employeeId={employee.id} status={employee.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No employees found</h2>
          <p className="mt-3 text-zinc-400">Create an employee or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
