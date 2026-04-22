import { Payment } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "4334WE",
      amount: 100,
      status: "pending",
      email: "@gmail.com",
      orderId: "ORD001",
    },
  ];
}
export default async function AdminPaymentsPage() {
  const data = await getData();

  return (
    <>
      <section className="my-4 text-3xl">
        <h1>Payments</h1>
        <p className="text-sm mt-2 text-left">
          Complete breakdown payments and payouts
        </p>
      </section>

      {/* Data table seems approprtie here to show the complete payments details  */}
      <section>
        <DataTable columns={columns} data={data} />
      </section>
    </>
  );
}
