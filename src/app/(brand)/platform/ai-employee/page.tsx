import { EmployeePage, employeeMetadata } from "@/components/platform/ai-employee/EmployeePage";

export const metadata = employeeMetadata();

// Desk states follow the catalog, which the fetch caches for 300 s.
export const revalidate = 300;

export default function Page() {
  return <EmployeePage />;
}
