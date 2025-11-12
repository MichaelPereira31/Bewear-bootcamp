import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { useState } from "react";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../identification/helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  return (
    <div>
      <Header />
      <div className="mx-auto w-full space-y-4 px-5 sm:max-w-[540px] sm:px-4 sm:py-6 md:max-w-[768px] md:px-4 md:py-6 lg:flex lg:max-w-[1024px] lg:gap-8 lg:px-4 lg:py-8 xl:max-w-[1280px]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CardContent className="space-y-6">
              <Card>
                <CardContent>
                  <p className="text-sm">
                    {formatAddress(cart.shippingAddress)}
                  </p>
                </CardContent>
              </Card>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 md:p-5 lg:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 md:h-7 md:w-7">
                    <span className="text-sm text-blue-600 md:text-base">
                      💬
                    </span>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm font-semibold text-blue-900 md:text-base lg:text-lg">
                      Ao finalizar o pedido, leia as informações abaixo:
                    </p>
                    <p className="text-xs leading-relaxed text-blue-800 md:text-sm lg:text-base">
                      Nosso consultor entrará em contato para confirmar seu
                      pedido,
                      <strong> analisar o valor do frete</strong> de acordo com
                      sua localização e <strong>finalizar o pagamento</strong>.
                    </p>
                    <p className="text-xs text-blue-700 italic md:text-sm">
                      Você será contactado em até 24 horas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox de termos e condições */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms-accepted"
                      name="terms-accepted"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="terms-accepted"
                      className="cursor-pointer text-sm font-medium text-gray-900"
                    >
                      Aceito os termos e condições
                    </label>
                    <p className="text-xs leading-relaxed text-gray-600">
                      Confirmo que estou ciente de que o{" "}
                      <strong>valor final do frete será calculado</strong>
                      {" "}pelo nosso consultor com base na minha localização e que
                      serei contactado para confirmação do pedido e finalização
                      do pagamento.
                    </p>
                  </div>
                </div>
              </div>

              <FinishOrderButton/>
            </CardContent>
          </CardContent>
        </Card>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default ConfirmationPage;
