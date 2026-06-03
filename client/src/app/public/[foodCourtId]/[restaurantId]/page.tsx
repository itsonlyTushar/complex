import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

async function Restaurant({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  return (
    <>
      <div className="rounded-b-[2rem] px-2 py-4 h-34 rounded-b bg-accent flex flex-col justify-between">
        <section className="w-full flex justify-between items-center">
          <h1 className="text-4xl font-semibold">{restaurantId}</h1>
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex gap-2 items-center bg-primary text-black px-2 py-1 rounded-lg cursor-pointer">
                <ShoppingCart size={20} />
                <span>1</span>
              </div>
            </SheetTrigger>
            <SheetContent></SheetContent>
          </Sheet>
        </section>

        <section className="w-full">
          <div className="flex w-full items-center gap-2 border border-border/40 px-3 py-3 rounded-xl bg-black/20">
            <Search size={18} className="text-muted-foreground" />
            <input
              className="flex-1 border-none bg-transparent shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-white placeholder:text-muted-foreground"
              placeholder="Search the menu.."
            />
          </div>
        </section>
      </div>

      <section className="my-10 mx-2">
        <Accordion type="single" defaultValue="food" collapsible>
          <AccordionItem value="food">
            <AccordionTrigger className="text-xl font-extrabold uppercase">
              Fast Food
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-stretch p-3 rounded-3xl bg-card border border-border/40 shadow-sm gap-4 transition-all hover:shadow-md">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight tracking-tight">Classic Beef Burger</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      Juicy beef patty with fresh lettuce, tomatoes, and our signature sauce.
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg">$30</span>
                    <div className="flex items-center gap-2 bg-accent rounded-full p-1 border border-border/50">
                      <Button variant="ghost" size="icon">
                        -
                      </Button>
                      <span className="w-4 text-center font-medium text-sm">1</span>
                      <Button variant="ghost" size="icon" className="">
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative w-[110px] shrink-0">
                  <Image
                    fill
                    className="object-cover rounded-2xl"
                    alt="burger"
                    src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <Separator />
      </section>
    </>
  );
}

export default Restaurant;
