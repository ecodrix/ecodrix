import { SubPageLayout, subPageMetadata, subPageParams } from "@/components/platform/shared/SubPageLayout";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return subPageParams("erix-connect");
}

export async function generateMetadata({ params }: Props) {
  return subPageMetadata("erix-connect", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SubPageLayout module="erix-connect" slug={(await params).slug} />;
}
