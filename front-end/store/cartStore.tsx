import { create } from "zustand";

interface CartState {
  cartCount: number; // 👈 สำหรับแสดงตัวเลขบน Navbar
  setCartCount: (count: number) => void;
  version: number; // 👈 ตัวกระตุ้น (Trigger)
  triggerRefetch: () => void; // 👈 ฟังก์ชันสำหรับกระตุ้น
}

// ⭐️ นี่คือ Store กลางที่ทุกคนจะใช้ ⭐️
export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  version: 0,
  // เมื่อถูกเรียก จะบวก version 1
  triggerRefetch: () => set((state) => ({ version: state.version + 1 })),
}));
