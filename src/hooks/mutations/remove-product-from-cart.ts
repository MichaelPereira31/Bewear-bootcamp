import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProductFromCart } from "@/actions/cart/remove-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseRemoveProductFromCartQueryKey = (cartItemId: string) => ["remove-product-from-cart", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseRemoveProductFromCartQueryKey(cartItemId),
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};