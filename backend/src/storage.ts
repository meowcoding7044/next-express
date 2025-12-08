import prisma from "./prismaClient";
import { Product } from "./types";

export async function readProducts(): Promise<Product[]> {
  const items = await prisma.product.findMany();
  // Prisma returns items matching the Product type shape
  return items as Product[];
}

export async function writeProducts(products: Product[]): Promise<void> {
  // Replace all products in DB with the provided array.
  // Use a transaction: delete all, then createMany.
  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany();
    if (products.length > 0) {
      // createMany for bulk insert
      await tx.product.createMany({ data: products as any[] });
    }
  });
}
