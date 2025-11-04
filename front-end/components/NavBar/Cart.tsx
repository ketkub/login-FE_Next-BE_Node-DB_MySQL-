"use client";

import { ShoppingCart } from "lucide-react";
import CartDialog from "@/components/Dialogs/CartDialog";
import { useCartStore } from "@/store/cartStore";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const cartCount = useCartStore((state) => state.cartCount);

  return (
    <Dialog>
      {/* ปุ่มกดเปิดตะกร้า */}
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
              w-5 h-5 rounded-full flex items-center justify-center"
            >
              {cartCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      {/* เนื้อหา Dialog */}
      <CartDialog />
    </Dialog>
  );
};

export default Cart;
