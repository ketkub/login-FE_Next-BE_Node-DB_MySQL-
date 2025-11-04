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
import { useCartStore } from "@/store/cartStore"; // 👈 1. Import มาจากไฟล์กลาง

const CartDialog = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // --- ⭐️ 2. ดึง state และ action ที่จำเป็น ⭐️ ---
  const setCartCount = useCartStore((state) => state.setCartCount);
  const version = useCartStore((state) => state.version); // 👈 ดึง 'version' มา
  const triggerRefetch = useCartStore((state) => state.triggerRefetch); // 👈 ดึง 'trigger' มา

  // --- ฟังก์ชันดึงข้อมูลตะกร้า ---
  const fetchCart = async () => {
    console.log("Fetching cart data (triggered by version change)...");
    const token = localStorage.getItem("token");
    if (!token) {
      // ถ้าเปิดตะกร้าโดยไม่ได้ login ให้เคลียร์ค่า
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
        // อาจจะ 401 (Token หมดอายุ) หรือ 404
        setCartItems([]);
        setTotalPrice(0);
        setCartCount(0);
        return;
      }

      const data = await res.json();
      console.log("Cart data fetched:", data);

      const items = data.cart?.items || [];
      setCartItems(items);

      if (items.length > 0) {
        const sum = items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.Product.price,
          0
        );
        setTotalPrice(sum);
        // นับจำนวน 'ชนิด' ของสินค้า ไม่ใช่จำนวนชิ้นทั้งหมด
        setCartCount(items.length); // อัปเดตตัวเลข (count) ที่ Navbar
      } else {
        setTotalPrice(0);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setTotalPrice(0);
      setCartCount(0);
    }
  };

  // --- ⭐️ 3. (สำคัญ) เปลี่ยน useEffect ให้ "ฟัง" version ⭐️ ---
  useEffect(() => {
    fetchCart();
  }, [version]); // 👈 เมื่อ 'version' เปลี่ยน -> fetchCart() จะทำงาน

  // --- ⭐️ 4. handle... ALL ⭐️ ---
  // ทุกฟังก์ชันที่ทำสำเร็จ จะเรียก 'triggerRefetch()'
  // เพื่อให้ useEffect จัดการ refetch เอง

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId); // (handleRemoveItem จะ trigger เอง)
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, newQuantity }),
      });
      if (res.ok) {
        console.log("Quantity updated");
        triggerRefetch(); // 👈 เรียก trigger
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        console.log("Item removed");
        triggerRefetch(); // 👈 เรียก trigger
      } else {
        console.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/cart/removeall", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        console.log("Cart cleared");
        triggerRefetch(); // 👈 เรียก trigger
      } else {
        console.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // ... (ส่วน JSX ที่เหลือเหมือนเดิมเป๊ะ) ...
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>ตะกร้าสินค้า</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex-1">
                <p className="font-medium">{item.Product.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      handleUpdateQuantity(item.Product.id, item.quantity - 1)
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      handleUpdateQuantity(item.Product.id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span>x {item.Product.price} บาท</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <p className="font-bold">
                  {item.quantity * item.Product.price} ฿
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.Product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">
            ยังไม่มีสินค้าในตะกร้า
          </p>
        )}
      </div>

      <div className="flex justify-between border-t pt-3 font-semibold">
        <p>รวมทั้งหมด:</p>
        <p>{totalPrice} ฿</p>
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
            ไปชำระเงิน
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default CartDialog;
