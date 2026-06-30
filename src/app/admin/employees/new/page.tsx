import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EmployeeForm } from "@/components/admin/employee-form";
import { buttonClasses } from "@/components/ui/button";
import { getEmployeeFormOptions } from "@/features/employees/employee-service";
import { emptyEmployeeFormValues } from "@/lib/validations/employee";

export const dynamic = "force-dynamic";

export default async function NewEmployeePage() {
  const options = await getEmployeeFormOptions();

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/employees">
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Employee</p>
        <h1 className="mt-2 text-3xl font-black">Create employee</h1>
      </div>

      <EmployeeForm initialValues={emptyEmployeeFormValues()} mode="create" options={options} />
    </div>
  );
}
