import { ShoppingBagIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>asd</SheetContent>
    </Sheet>
  );
};
