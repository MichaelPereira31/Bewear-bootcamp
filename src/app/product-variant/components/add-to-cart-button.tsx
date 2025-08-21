"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { addProductToCart } from "@/actions/cart/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-to-cart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
  return (
    <Button
      className="rounded-full border"
      size={"lg"}
      variant={"ghost"}
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="anumate-spin" />}
      Adicionar a sacola
    </Button>
  );
};

export default AddToCartButton;
