import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatCentsToBRL } from "@/app/helpers/money";
import { productTable, productVariantTable } from "@/db/schema";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}
const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants?.[0];
  const [imageError, setImageError] = useState(false);
  //Tem que corrigir
  // Don't render if no variant available
  if (!firstVariant) {
    return null;
  }

  // Ensure imageUrl is a valid string and not empty
  let imageUrl = "/placeholder-image.svg"; // default fallback

  if (firstVariant?.imageUrl) {
    // Handle case where imageUrl might be an object or malformed
    try {
      let rawUrl = firstVariant.imageUrl;

      // If it's not a string, try to convert it
      if (typeof rawUrl !== "string") {
        rawUrl = String(rawUrl);
      }

      // If it looks like JSON, try to parse it
      if (rawUrl.includes("{") || rawUrl.includes('"')) {
        try {
          const parsed = JSON.parse(rawUrl);
          if (typeof parsed === "string") {
            rawUrl = parsed;
          }
        } catch {
          // If JSON parsing fails, clean up the string
          rawUrl = rawUrl.replace(/["{}\[\]]/g, "").trim();
        }
      }

      if (rawUrl && rawUrl.trim() !== "") {
        // Clean the URL - remove any extra quotes or formatting
        const cleanUrl = rawUrl
          .replace(/^["'{]/, "")
          .replace(/["'}]$/, "")
          .trim();
        if (
          cleanUrl.startsWith("http://") ||
          cleanUrl.startsWith("https://") ||
          cleanUrl.startsWith("/")
        ) {
          imageUrl = cleanUrl;
        }
      }
    } catch (error) {
      console.warn("Error processing image URL:", error);
    }
  }

  // Use placeholder if original image failed to load
  const finalImageUrl = imageError ? "/placeholder-image.svg" : imageUrl;

  return (
    <Link href={"/"} className="flex flex-col gap-4">
      <Image
        src={finalImageUrl}
        alt={firstVariant.name || "Product image"}
        width={200}
        height={200}
        className="h-auto w-full rounded-3xl"
        onError={() => setImageError(true)}
        priority={false}
      />
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
