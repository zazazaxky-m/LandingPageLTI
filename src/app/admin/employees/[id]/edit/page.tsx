import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EmployeeForm } from "@/components/admin/employee-form";
import { buttonClasses } from "@/components/ui/button";
import { getEmployeeForEdit, getEmployeeFormOptions } from "@/features/employees/employee-service";

type EditEmployeePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = await params;
  const [employee, options] = await Promise.all([getEmployeeForEdit(id), getEmployeeFormOptions()]);

  if (!employee) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/employees">
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Employee</p>
        <h1 className="mt-2 text-3xl font-black">{employee.name}</h1>
      </div>

      <EmployeeForm employeeId={id} initialValues={employee} mode="edit" options={options} />
    </div>
  );
}
