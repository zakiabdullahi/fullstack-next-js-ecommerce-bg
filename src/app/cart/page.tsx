import { getCart } from "../lib/db/carts";
import { formatPrice } from "../lib/db/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";

export const metadata = {
  title: "Your Cart - flowmazon",
};
export default async function CartPage() {
  const cart = await getCart();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          key={cartItem.id}
          cartItem={cartItem}
          setProductQuantity={setProductQuantity}
        />
      ))}

      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subTotal || 0)}
        </p>
        <button className="btn btn-primary sm:w-[200px]">Checkout</button>
      </div>
    </div>
  );
}
