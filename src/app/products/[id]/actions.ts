"use server";

import createCart, { getCart } from "@/app/lib/db/carts";
import { prisma } from "@/app/lib/db/prisma";
import { revalidatePath } from "next/cache";

export default async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart());
  const articleCart = cart.items.find((item) => item.productId === productId);

  if (articleCart) {
    await prisma.cartItem.update({
      where: { id: articleCart.id },
      data: {
        quantity: { increment: 1 },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/products/[id]");
}
