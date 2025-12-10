import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import { formatCentsToBRL } from "@/app/helpers/money";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

import ProductActions from "../components/product-actions";
import VariantSelector from "../components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) notFound();

  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: { variants: true },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6 py-5">
        <div className="relative h-[300px] w-full rounded-3xl lg:max-w-[1024px] lg:mx-auto lg:min-h-[500px]">
          <Image
            src={
              productVariant.imageUrl.match(/https?:\/\/[^"]+/)?.[0] as string
            }
            alt={productVariant.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 px-5 w-full lg:max-w-[1024px] lg:mx-auto">
          <VariantSelector
            variants={productVariant.product.variants}
            selectedVariant={productVariant.slug}
          />
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>

          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
          <ProductActions productVariantId={productVariant.id} />
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>
        <div>
          <ProductList products={products} title="Talvez voce goste" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
