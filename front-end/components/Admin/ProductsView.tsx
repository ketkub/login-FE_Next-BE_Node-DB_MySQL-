"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { ProductFormModal } from "./ProductFormModal";

// --- 1. (แนะนำ) สร้าง Interface สำหรับ Product ---
interface Product {
    id: number;
    name: string;
    price: number;
    InStock: number;
    image?: string;
    Category?: {
        name: string;
    }

}

// --- 2. สร้างตัวจัดรูปแบบไว้ด้านนอก ---
// สำหรับสกุลเงิน (มีทศนิยม 2 ตำแหน่ง)
const currencyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// สำหรับตัวเลขทั่วไป (เช่น สต็อก, ไม่มีทศนิยม)
const numberFormatter = new Intl.NumberFormat('en-US');


export function ProductsView() {
    // --- 1. (ต่อ) ใช้ Interface กับ State ---
    const [products, setProducts] = useState<Product[]>([]); 
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);

    // State สำหรับ Modal
    const [showProductForm, setShowProductForm] = useState(false);
    // --- 1. (ต่อ) ใช้ Interface กับ State ---
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        setProductError(null);
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json().catch(() => null);
            if (res.ok) {
                // 💡 [แก้ไข] ดึงข้อมูลจาก data.data ซึ่งเป็นโครงสร้างที่ API ส่งกลับมา
                setProducts(data?.data || []);
            } else {
                const msg = (data && data.message) || `Server returned ${res.status}`;
                setProductError(msg);
                setProducts([]);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setProductError(String(err));
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("ยืนยันการลบสินค้านี้?")) return;
        const token = localStorage.getItem("token");
        if (!token) return alert("Session expired");
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("✅ ลบสินค้าเรียบร้อย");
                fetchProducts();
            } else {
                const err = await res.json();
                alert(`❌ ${err.message || 'ลบไม่สำเร็จ'}`);
            }
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        }
    };

    // --- 1. (ต่อ) ใช้ Interface กับ Function ---
    const handleEditInit = (product: Product) => { 
        setProductToEdit(product);
        setShowProductForm(true);
    };

    const handleAddInit = () => {
        setProductToEdit(null);
        setShowProductForm(true);
    };

    const handleSaveSuccess = () => {
        setShowProductForm(false);
        setProductToEdit(null);
        fetchProducts();
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="dark:text-white text-xl">รายการสินค้า ({products.length})</CardTitle>
                    <Button onClick={handleAddInit} className="bg-blue-600 hover:bg-blue-700">
                        เพิ่มสินค้า
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingProducts ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : productError ? (
                        <div className="text-center py-6 text-red-600 dark:text-red-400">
                            <p>เกิดข้อผิดพลาด: {productError}</p>
                            <Button onClick={fetchProducts} className="mt-3">ลองอีกครั้ง</Button>
                        </div>
                    ) : products.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">ไม่มีสินค้า</p>
                    ) : (
                        <div className="space-y-4">
                            {products.map((p) => (
                                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={p.image?.startsWith("http") ? p.image : p.image ? `http://localhost:5000${p.image}` : "/placeholder.png"}
                                            alt={p.name}
                                            className="w-16 h-16 object-cover rounded-md border dark:border-slate-600"
                                        />
                                        <div>
                                            <p className="font-semibold dark:text-white">{p.name}</p>
                                            
                                            {/* --- 3. อัปเดตการแสดงผล Price --- */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ฿{currencyFormatter.format(p.price)}
                                            </p>
                                            
                                            {/* --- 3. อัปเดตการแสดงผล Stock --- */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                สต็อก: {numberFormatter.format(p.InStock ?? 0)}
                                            </p>
                                            {/* 💡 [เพิ่ม] แสดงชื่อหมวดหมู่ */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">
                                                หมวดหมู่: {p.Category?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditInit(p)} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-white">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded bg-red-600 hover:bg-red-500 text-white">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Render Modal ที่นี่ */}
            <ProductFormModal
                isOpen={showProductForm}
                onClose={() => setShowProductForm(false)}
                onSaveSuccess={handleSaveSuccess}
                productToEdit={productToEdit}
            />
        </div>
    );
}