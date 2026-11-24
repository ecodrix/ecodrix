import { EmployeePage, employeeMetadata } from "@/components/platform/ai-employee/EmployeePage";

export const metadata = employeeMetadata();

export default function Page() {
  return <EmployeePage />;
}
