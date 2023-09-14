"use client";
import Image from "next/image";
import { CartItemWithProduct } from "../lib/db/carts";
import Link from "next/link";
import { formatPrice } from "../lib/db/format";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (id: string, quantity: number) => Promise<void>;
}
export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>,
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          height={200}
          width={200}
        />
        <div>
          <Link href={"/products" + product.id}>{product.name}</Link>
          <div>Price:{formatPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className="select select-bordered w-full max-w-[80px]"
              defaultValue={quantity}
              onChange={(e) => {
                const newVal = parseInt(e.currentTarget.value);

                startTransition(() => {
                  setProductQuantity(product.id, newVal);
                });
              }}
            >
              <option value={0}>0 (Remove)</option>
              {quantityOptions}
            </select>
          </div>
          <div>
            Total:{formatPrice(quantity * product.price)}
            {isPending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
}
