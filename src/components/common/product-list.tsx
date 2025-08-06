"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductsListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ products, title }: ProductsListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="p-5 font-semibold">{title}</h3>
      <div className="[&::-webkit] flex w-full gap-4 overflow-x-auto px-5">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
