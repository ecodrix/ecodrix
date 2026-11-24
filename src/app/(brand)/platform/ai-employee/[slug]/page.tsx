import { notFound } from "next/navigation";
import { EmployeePage, employeeMetadata, employeeParams } from "@/components/platform/EmployeePage";
import { getEmployeePage } from "@/lib/employee-pages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = employeeParams;

export async function generateMetadata({ params }: Props) {
  return employeeMetadata(getEmployeePage((await params).slug));
}

export default async function Page({ params }: Props) {
  const page = getEmployeePage((await params).slug);
  if (!page) notFound();
  return <EmployeePage page={page} />;
}
