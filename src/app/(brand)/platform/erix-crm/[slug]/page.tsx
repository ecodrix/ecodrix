import { SubPageLayout, subPageMetadata, subPageParams } from "@/components/platform/shared/SubPageLayout";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return subPageParams("erix-crm");
}

export async function generateMetadata({ params }: Props) {
  return subPageMetadata("erix-crm", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SubPageLayout module="erix-crm" slug={(await params).slug} />;
}
