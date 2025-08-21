import { useQuery } from "@tanstack/react-query";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/cart/get-cart";
import { formatCentsToBRL } from "@/app/helpers/money";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader><SheetTitle>Meu carrinho</SheetTitle></SheetHeader>
        <div>
          {cartIsLoading && <p>Carregando...</p>}
          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={item.productVariant.imageUrl.match(/https?:\/\/[^"]+/)?.[0] as string}
                alt={item.productVariant.product.name}
                width={50}
                height={50}
              />
              <div>
                <h3>{item.productVariant.product.name}</h3>
                <p>Quantidade: {item.quantity}</p>
                <p>
                  Preço: {formatCentsToBRL(item.productVariant.priceInCents)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
