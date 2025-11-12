import Image from "next/image";
import React from "react";

import { formatCentsToBRL } from "@/app/helpers/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

const getSafeImageUrl = (url: string) => {
  try {
    // Decodifica a URL primeiro para lidar com caracteres especiais
    const decodedUrl = decodeURIComponent(url);
    // Verifica se é uma URL válida
    new URL(decodedUrl);
    return decodedUrl;
  } catch {
    return null;
  }
};

const CartSummary = ({
  subtotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card className=" w-full">
      <CardHeader className="pb-4 md:pb-6 lg:pb-7">
        <CardTitle className="text-lg md:text-xl lg:text-2xl">
          Resumo do pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumo de valores */}
        <div className="space-y-3 md:space-y-4 lg:space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
              Subtotal
            </p>
            <p className="text-sm font-medium md:text-base lg:text-lg">
              {formatCentsToBRL(subtotalInCents)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
              Frete
            </p>
            <p className="text-sm font-medium text-green-600 md:text-base lg:text-lg">
              GRÁTIS
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold md:text-lg lg:text-xl">
              Total
            </p>
            <p className="text-base font-bold md:text-lg lg:text-xl">
              {formatCentsToBRL(totalInCents)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Lista de produtos */}
        <div className="space-y-4 md:space-y-6 lg:space-y-7">
          <p className="text-sm font-semibold md:text-base lg:text-lg">
            Produtos ({products.length})
          </p>

          {products.map((product) => (
            <div
              className="flex items-center gap-3 md:gap-4 lg:gap-5"
              key={product.id}
            >
              {/* Imagem do produto */}
              <div className="flex-shrink-0">
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg md:h-16 md:w-16 md:rounded-xl lg:h-20 lg:w-20">
                  <span className="text-muted-foreground text-xs md:text-sm">
                    {product.imageUrl && getSafeImageUrl(product.imageUrl) ? (
                      <Image
                        src={getSafeImageUrl(product.imageUrl) as string}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-12 w-12 rounded-lg object-cover md:h-16 md:w-16 md:rounded-xl lg:h-20 lg:w-20"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-12 w-12 rounded-lg object-cover md:h-16 md:w-16 md:rounded-xl lg:h-20 lg:w-20"
                      > </svg>)}

                  </span>
                </div>
              </div>

              {/* Informações do produto */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4 lg:gap-5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold md:text-base lg:text-lg">
                      {product.name}
                    </p>
                    <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
                      {product.variantName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 md:hidden">
                      <span className="text-muted-foreground text-xs">
                        Qtd: {product.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Preço e quantidade - Desktop */}
                  <div className="hidden md:flex md:flex-col md:items-end md:gap-1 lg:gap-2">
                    <p className="text-base font-bold lg:text-lg">
                      {formatCentsToBRL(product.priceInCents)}
                    </p>
                    <p className="text-muted-foreground text-sm lg:text-base">
                      Qtd: {product.quantity}
                    </p>
                    <p className="text-muted-foreground text-sm font-semibold lg:text-base">
                      {formatCentsToBRL(
                        product.priceInCents * product.quantity,
                      )}
                    </p>
                  </div>
                </div>

                {/* Preço - Mobile */}
                <div className="mt-2 flex items-center justify-between md:hidden">
                  <p className="text-sm font-bold">
                    {formatCentsToBRL(product.priceInCents)}
                  </p>
                  <p className="text-muted-foreground text-sm font-semibold">
                    {formatCentsToBRL(product.priceInCents * product.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefícios */}
        <div className="pt-2 md:pt-4 lg:pt-5">
          <div className="bg-muted/30 space-y-2 rounded-lg p-3 md:space-y-3 md:p-4 lg:space-y-4 lg:p-5">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              {/* <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 md:h-6 md:w-6 lg:h-7 lg:w-7">
                <span className="text-xs text-green-600 md:text-sm">✓</span>
              </div> */}
              {/* <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
                Frete grátis para todo Brasil
              </p> */}
            </div>
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              {/* <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 md:h-6 md:w-6 lg:h-7 lg:w-7">
                <span className="text-xs text-green-600 md:text-sm">✓</span>
              </div> */}
              {/* <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
                Entrega em até 7 dias úteis
              </p> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
