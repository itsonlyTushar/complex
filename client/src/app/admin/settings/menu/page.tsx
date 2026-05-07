import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Menu = () => {
  return (
    <>
      <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Menu</h1>
        <form className="flex gap-2 items-center">
          <Label htmlFor="category-input">Categories</Label>
          <Input id="category-input" placeholder="Enter Value" />
          <Button type="submit">Add</Button>
        </form>

        <div className="flex gap-2 my-4">
          <Label>Existing Categories</Label>
          <div className="border w-full">
            <span>TODO:FETCH AND DISPLAY THE CATEGORIES HERE</span>
          </div>
        </div>
        <Separator className="my-4" />
      </section>
    </>
  );
};

export default Menu;
