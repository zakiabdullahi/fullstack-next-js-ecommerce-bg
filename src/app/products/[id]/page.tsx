import { prisma } from "@/app/lib/db/prisma";
import NotFound from "@/app/not-found";
import PriceTag from "@/components/PriceTag";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import incrementProductQuantity from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return NotFound();

  return product;
});
export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

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
  const product = await getProduct(id);
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