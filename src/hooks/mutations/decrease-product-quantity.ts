import { useMutation, useQueryClient } from "@tanstack/react-query";

import { decreaseCartProductQuantity } from "@/actions/cart/decrease-cart-product-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseDecreaseProductQuantityQueryKey = (cartItemId: string) => ["decrease-cart-product-quantity", cartItemId] as const;
export const useDecreaseProductQuantity = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseDecreaseProductQuantityQueryKey(cartItemId),
    mutationFn: () => decreaseCartProductQuantity({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey });
    },
  });
};