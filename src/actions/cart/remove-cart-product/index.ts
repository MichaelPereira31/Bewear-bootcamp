"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { RemoveProductFromCartSchema, removeProductFromCartSchema } from "./schema";


export const removeProductFromCart = async (data: RemoveProductFromCartSchema) => {
  removeProductFromCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.id, data.cartItemId),
    with: {
      cart: true
    }
  });
  if (cartItem?.cart.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await db
    .delete(cartItemTable)
    .where(eq(cartItemTable.id, cartItem.id))
    .returning();
};