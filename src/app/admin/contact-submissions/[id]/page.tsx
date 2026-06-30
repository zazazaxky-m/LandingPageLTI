import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import { ContactStatusActions } from "@/components/admin/contact-status-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getContactSubmissionDetail } from "@/features/contact/contact-service";
import { formatEnumLabel } from "@/lib/translations";

type ContactSubmissionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ContactSubmissionDetailPage({ params }: ContactSubmissionDetailPageProps) {
  const { id } = await params;
  const submission = await getContactSubmissionDetail(id);

  if (!submission) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/contact-submissions">
          <ArrowLeft className="h-4 w-4" />
          Back to submissions
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Contact Detail</p>
        <h1 className="mt-2 text-3xl font-black">{submission.subject}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{formatEnumLabel(submission.status, "en")}</Badge>
          <Badge>{formatEnumLabel(submission.interestCategory, "en")}</Badge>
          <Badge>{new Date(submission.createdAt).toLocaleString("en-GB")}</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">{submission.name}</h2>
            {submission.company ? <p className="mt-2 text-zinc-400">{submission.company}</p> : null}
          </div>
          <div className="grid gap-3 text-sm text-zinc-300">
            <a className="inline-flex items-center gap-3 transition hover:text-lumen-400" href={`mailto:${submission.email}`}>
              <Mail className="h-4 w-4" />
              {submission.email}
            </a>
            {submission.phone ? (
              <a className="inline-flex items-center gap-3 transition hover:text-lumen-400" href={`tel:${submission.phone.replace(/[^\d+]/g, "")}`}>
                <Phone className="h-4 w-4" />
                {submission.phone}
              </a>
            ) : null}
          </div>
          <ContactStatusActions currentStatus={submission.status} submissionId={submission.id} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-black text-white">Message</h2>
          <p className="mt-5 whitespace-pre-line leading-8 text-zinc-300">{submission.message}</p>
        </Card>
      </div>
    </div>
  );
}
