import Link from "next/link";
import { Eye, Search } from "lucide-react";

import { ContactStatusActions } from "@/components/admin/contact-status-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminContactSubmissions, parseAdminContactFilters } from "@/features/contact/contact-service";
import { formatEnumLabel } from "@/lib/translations";

type AdminContactSubmissionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function AdminContactSubmissionsPage({ searchParams }: AdminContactSubmissionsPageProps) {
  const filters = parseAdminContactFilters(await searchParams);
  const content = await getAdminContactSubmissions(filters);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Contact Submissions</p>
        <h1 className="mt-2 text-3xl font-black">Incoming inquiries</h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          View contact form submissions, search inquiries, and move each message through new, read, replied, or archived status.
        </p>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search name, email, subject, message" />
          </label>
          <Select defaultValue={filters.status} name="status">
            <option value="">All statuses</option>
            {content.statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status, "en")}
              </option>
            ))}
          </Select>
          <Select defaultValue={filters.interest} name="interest">
            <option value="">All interests</option>
            {content.interestOptions.map((interest) => (
              <option key={interest} value={interest}>
                {formatEnumLabel(interest, "en")}
              </option>
            ))}
          </Select>
          <button className={buttonClasses("solid")} type="submit">
            Filter
          </button>
          <Link className={buttonClasses("ghost")} href="/admin/contact-submissions">
            Reset
          </Link>
        </form>
      </Card>

      {content.submissions.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Contact</Th>
              <Th>Subject</Th>
              <Th>Interest</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.submissions.map((submission) => (
              <tr key={submission.id}>
                <Td>
                  <div>
                    <p className="font-black text-white">{submission.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{submission.email}</p>
                    {submission.company ? <p className="mt-2 text-xs text-zinc-400">{submission.company}</p> : null}
                  </div>
                </Td>
                <Td>
                  <div className="max-w-sm">
                    <p className="font-bold text-white">{submission.subject}</p>
                    {submission.phone ? <p className="mt-2 text-xs text-zinc-500">{submission.phone}</p> : null}
                  </div>
                </Td>
                <Td>
                  <Badge>{formatEnumLabel(submission.interestCategory, "en")}</Badge>
                </Td>
                <Td>
                  <Badge>{formatEnumLabel(submission.status, "en")}</Badge>
                </Td>
                <Td>{new Date(submission.createdAt).toLocaleString("en-GB")}</Td>
                <Td>
                  <div className="grid gap-3">
                    <Link className={buttonClasses("outline", "min-h-9 px-3 text-xs")} href={`/admin/contact-submissions/${submission.id}`}>
                      <Eye className="h-4 w-4" />
                      Detail
                    </Link>
                    <ContactStatusActions currentStatus={submission.status} submissionId={submission.id} />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No contact submissions found</h2>
          <p className="mt-3 text-zinc-400">Clear the filters or submit the public contact form to add one.</p>
        </Card>
      )}
    </div>
  );
}
