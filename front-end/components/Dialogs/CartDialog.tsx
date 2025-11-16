"use client";
import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const CartDialog = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Zustand store
  const setCartCount = useCartStore((state) => state.setCartCount);
  const version = useCartStore((state) => state.version);
  const triggerRefetch = useCartStore((state) => state.triggerRefetch);

  // --- ดึงข้อมูลตะกร้า ---
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      setTotalPrice(0);
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setCartItems([]);
        setTotalPrice(0);
        setCartCount(0);
        return;
      }

      const data = await res.json();
      const items = data.cart?.items || [];
      setCartItems(items);

      const sum = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.Product.price,
        0
      );
      setTotalPrice(sum);
      setCartCount(items.length);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setTotalPrice(0);
      setCartCount(0);
    }
  };

  // Fetch cart ทุกครั้งที่ 'version' เปลี่ยน
  useEffect(() => {
    fetchCart();
  }, [version]);

  // --- เพิ่ม/ลดจำนวน ---
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }

    // --- 💡 [เพิ่ม] Optimistic Update: อัปเดต UI ทันที ---
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // --- คำนวณราคารวมใหม่จาก State ที่เพิ่งอัปเดต ---
    const updatedItems = cartItems.map((item) =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    const newTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);
    setTotalPrice(newTotal);
    // --- สิ้นสุดส่วนที่เพิ่ม ---

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId, newQuantity }),
      });

      if (res.ok) {
        // 💡 [แก้ไข] ไม่ต้อง refetch ทั้งหมดแล้ว เพราะ UI อัปเดตไปแล้ว
        // triggerRefetch(); // เราจะ refetch เฉพาะตอนเปิด Dialog ใหม่
      } else {
        console.error("Failed to update quantity");
        fetchCart(); // 💡 [เพิ่ม] หากล้มเหลว ให้ดึงข้อมูลจริงกลับมา
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // --- ลบ item ทีละชิ้น ---
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/item/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        triggerRefetch();
      } else {
        const data = await res.json();
        console.error("Failed to remove item:", data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // --- ลบทั้งหมด ---
  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart/removeall", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        triggerRefetch();
      } else {
        console.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>ตะกร้าสินค้า</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <p className="font-medium">{item.Product.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span>x {Number(item.Product.price).toLocaleString("en-US")} บาท</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <p className="font-bold">
                  {(item.quantity * Number(item.Product.price)).toLocaleString("en-US")} ฿
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">ยังไม่มีสินค้าในตะกร้า</p>
        )}
      </div>

      <div className="flex justify-between border-t pt-3 font-semibold">
        <p>รวมทั้งหมด:</p>
        <p>{totalPrice.toLocaleString("en-US")} ฿</p>
      </div>

      <DialogFooter className="mt-2 sm:justify-between">
        <Button
          variant="outline"
          className="text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
        >
          ลบทั้งหมด
        </Button>
        <div className="flex space-x-2">
          <DialogClose asChild>
            <Button variant="secondary">ปิด</Button>
          </DialogClose>
          <Button
            onClick={() => (window.location.href = "/checkout")}
            disabled={cartItems.length === 0}
          >
            ชำระเงิน
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default CartDialog;
