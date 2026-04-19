import { Menu } from "@/types";
import { DataTable } from "../payments/data-table";
import { columns } from "./columns";

async function getData(): Promise<Menu[]> {
  return [
    {
      id: "4334WE",
      price: 100,
      cost: 20,
      category: "Snacks",
      name: "Pav Bhaji",
      stock: 15,
    },
  ];
}

export default async function AdminMenuPage() {
  const data = await getData();
  return (
    <>
      <section className="my-4 text-3xl">
        <h1>Menu</h1>
        <p className="text-sm mt-2 text-left">
          Manage Menu and Stock from here
        </p>
      </section>

      <section>
        <DataTable columns={columns} data={data} />
      </section>
    </>
  );
}
