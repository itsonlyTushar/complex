import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";

export default function OrdersPage() {
  return (
    <>
      <section className="my-4 text-3xl">
        <h1>Orders</h1>
        <p className="text-sm mt-2 text-left">
          Orders for you restaurant will appear here
        </p>
      </section>

      {/* Map the orders cards here (only on-goings)  */}

      <section>
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>
              {" "}
              <span className="font-extrabold mr-1">#Order</span>2453
            </CardTitle>
            <CardDescription className="text-xs">23rd May 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p>LOAD THE ORDERS DETAILS HERE</p>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex gap-2">
            <Button>
              <X />
            </Button>
            <Button>
              <Check />
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
