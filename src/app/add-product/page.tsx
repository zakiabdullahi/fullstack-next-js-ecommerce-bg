import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import FormSubmitButton from "@/components/FormSubmitButton";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Add Product FlowMazon",
};

async function addProduct(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect("/");
}
export default async function AddProduct() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <div className="">
      <h1 className="mb-2 text-2xl   font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          name="name"
          placeholder="Name"
          className="input  input-bordered mb-2 w-full"
          type="text"
        />
        <textarea
          className=" textarea textarea-bordered mb-3 w-full  "
          name="description"
          placeholder="description"
        />
        <input
          name="imageUrl"
          placeholder="imageUrl"
          className="input  input-bordered mb-2 w-full"
          type="url"
        />
        <input
          name="price"
          placeholder="price"
          className="input  input-bordered mb-2 w-full"
          type="number"
        />
        <FormSubmitButton className=" btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
