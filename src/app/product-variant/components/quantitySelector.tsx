"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const QuantitySelector = () => {
  const initialQuantity = 30;
  const [quantity, setQuantity] = useState(initialQuantity);
  return (
    <div className="space-y-4">
      <h3>Quantidade</h3>
      <div className="item-center flex w-[100px] justify-between rounded-xl border">
        <Button
          disabled={quantity <= initialQuantity}
          onClick={() =>
            setQuantity((prev) => Math.max(prev - 1, initialQuantity))
          }
          variant={"ghost"}
        >
          <MinusIcon />
        </Button>
        <span className="text-lg">{quantity}</span>
        <Button
          onClick={() => setQuantity((prev) => prev + 1)}
          variant={"ghost"}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
