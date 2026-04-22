import { DataTable } from "@/app/admin/payments/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { columns } from "./columns";
import { Restaurants } from "@/types";

async function getData(): Promise<Restaurants[]> {
  return [
    {
      id: "4334WE",
      date: "20-3-2026",
      status: true,
      email: "@gmail.com",
      owner: "Tushar",
    },
  ];
}

async function RestaurantsPage() {
  const data = await getData();
  return (
    <>
      <section className="flex justify-between gap-2 py-6 px-5">
        <h1 className="text-3xl">Restaurants</h1>

        <div className="flex items-center gap-2">
          {/* TODO: IMPLEMENT THE FUNCTION THAT OPENS THE MODEL/ROUTE OF ONBOARIDNG FORM  */}
          <Button className="font-bold">
            {" "}
            <Plus size={12} /> Onboard
          </Button>
        </div>
      </section>

      <section className="mx-2">
        <DataTable columns={columns} data={data} />
      </section>
    </>
  );
}

export default RestaurantsPage;