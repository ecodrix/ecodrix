import { EmployeePage, employeeMetadata } from "@/components/platform/EmployeePage";

export const metadata = employeeMetadata();

export default function Page() {
  return <EmployeePage />;
}
