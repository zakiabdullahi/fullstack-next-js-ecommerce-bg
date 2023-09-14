import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/logo.png";
import { redirect } from "next/navigation";
import { getCart } from "../lib/db/carts";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
async function searchProduct(formData: FormData) {
  "use server";
  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}
export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();
  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col  gap-2 sm:flex-row">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl normal-case" href="/">
            <Image src={logo} height={40} width={40} alt="floMazon" />
            flowMazon
          </Link>
        </div>
        <div className="flex-none gap-2 ">
          <form action={searchProduct}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}
