import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/cart/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseIncrementProductQuantityQueryKey = (productVariantId: string) => ["increment-cart-product-quantity", productVariantId] as const;
export const useIncrementProductQuantity = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseIncrementProductQuantityQueryKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey });
    },
  });
};