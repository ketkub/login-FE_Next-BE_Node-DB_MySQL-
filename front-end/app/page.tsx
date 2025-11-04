"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCartStore } from "@/store/cartStore"; // 👈 1. Import store กลาง

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
}

interface ApiResponse {
  totalItems: { products: Product[] };
  totalPages: number;
}

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  // --- ⭐️ 2. เปลี่ยนจาก incrementCart เป็น triggerRefetch ⭐️ ---
  const triggerRefetch = useCartStore((state) => state.triggerRefetch);

  const handleAddToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const user = decodeToken(token);
      if (!user) {
        alert("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // --- ⭐️ 3. เรียก triggerRefetch() แทน ⭐️ ---
        // นี่จะไปสั่งให้ CartDialog (ถ้าเปิดอยู่) และ Navbar (ผ่าน fetchCart)
        // อัปเดตตัวเอง
        triggerRefetch();
        alert("Product added to cart!"); // (เพิ่มการแจ้งเตือน)
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart (server error):", errorData);
        alert(`Failed to add to cart: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Add to cart failed (network error):", error);
      alert("An error occurred while adding to the cart.");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?page=${page}&limit=5`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setProducts(data.totalItems.products);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, [page]);

  return (
    <div className="min-h-screen bg-linear-to-br ">
      <div className="container mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Products</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 right-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-900 shadow-md">
                  {product.brand}
                </Badge>
              </div>

              <CardContent className="p-4 h-24 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-auto">
                  {product.price} ฿
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors group/btn"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : undefined}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    aria-disabled={page === totalPages}
                    tabIndex={page === totalPages ? -1 : undefined}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
