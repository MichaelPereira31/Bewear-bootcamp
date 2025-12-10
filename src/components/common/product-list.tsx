"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import { Button } from "../ui/button";
import ProductItem from "./product-item";

interface ProductsListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ products, title }: ProductsListProps) => {
  const [showAll, setShowAll] = useState(false);

  // Limites para cada breakpoint
  const mobileLimit = 8; // 4 linhas × 2 colunas = 8 produtos
  const lgLimit = 8; // 2 linhas × 4 colunas = 8 produtos

  // Mostrar todos ou limitar os produtos
  const displayedProducts = showAll
    ? products
    : products.slice(0, Math.max(mobileLimit, lgLimit));

  return (
    <div className="mx-auto space-y-6 lg:max-w-[1024px]">
      <div className="mb-8 flex items-center justify-center">
        <div className="to-accent mr-4 h-1 w-16 bg-gradient-to-r from-transparent" />
        <h2 className="animate-pulse-subtle from-accent to-primary inline-block bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
          {title}
        </h2>
        <div className="from-accent ml-4 h-1 w-16 bg-gradient-to-r to-transparent" />
      </div>

      {/* Grid responsiva com limites */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}
        </div>

        {/* Botão Ver Mais/Menos - só aparece se houver mais produtos */}
        {products.length > mobileLimit && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="group hover:border-primary hover:bg-primary/5 gap-2 border-2 px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105"
            >
              {showAll ? (
                <>
                  Ver menos
                  <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                </>
              ) : (
                <>
                  Ver mais produtos
                  <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
