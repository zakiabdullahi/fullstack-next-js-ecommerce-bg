import { prisma } from "@/app/lib/db/prisma";
import NotFound from "@/app/not-found";
import PriceTag from "@/components/PriceTag";
import { Metadata } from "next";
import Image from "next/image";
import { ReactElement, cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";
import { type } from "os";

interface ProductPageProps {
  params: {
    id: string;
  };
}
type Product = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  imageUrl: string;
  price: number;
};

const getProduct = cache(async (id: string): Promise<JSX.Element | Product> => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return NotFound();

  return product;
});
export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  // @ts-ignore

  const product: Product = await getProduct(id);
  console.log(product);

  return {
    title: product.name + " - Flowmazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  // @ts-ignore

  const product: Product = await getProduct(id);
  // console.log("now", product);
  return (
    <div className="flex  flex-col  gap-4 lg:flex-row lg:items-center">
      <Image
        width={500}
        height={500}
        alt={product.name}
        src={product.imageUrl}
        className="rounded-lg"
        priority
      />

      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p>{product.description}</p>
        <AddToCartButton
          productId={product.id}
          incrementProductQuantity={incrementProductQuantity}
        />
      </div>
    </div>
  );
}
