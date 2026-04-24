import { Payment } from "@/types";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "4334WE",
      amount: 450.00,
      status: "success",
      email: "alex@example.com",
      orderId: "ORD001",
    },
    {
      id: "7892TY",
      amount: 120.50,
      status: "pending",
      email: "sarah@example.com",
      orderId: "ORD002",
    },
    {
      id: "1234AB",
      amount: 99.99,
      status: "failed",
      email: "mike@example.com",
      orderId: "ORD003",
    },
    {
      id: "5678CD",
      amount: 1200.00,
      status: "processing",
      email: "jane@example.com",
      orderId: "ORD004",
    },
  ];
}

export default async function AdminPaymentsPage() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-6 py-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">
          Complete breakdown of your platform's payments and payouts.
        </p>
      </section>

      <section>
        <DataTable data={data} />
      </section>
    </div>
  );
}
