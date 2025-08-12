import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  variants: (typeof productVariantTable.$inferSelect)[]; // Adjust the type based on your actual variant structure
  selectedVariant?: string; // Optional slug for highlighting the selected variant
}

const VariantSelector = ({ variants, selectedVariant }: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link key={variant.id} href={`/product-variant/${variant.slug}`}
        className={selectedVariant === variant.slug ? "border-2 border-blue-500 rounded-xl" : ""}
        >
          <Image
            src={variant.imageUrl.match(/https?:\/\/[^"]+/)?.[0] as string}
            alt={variant.name}
            width={68}
            height={68}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
