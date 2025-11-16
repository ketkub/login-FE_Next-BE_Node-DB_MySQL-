"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

interface ProductForm {
    name: string;
    description: string;
    price: string;
    categoryId: string; // 💡 [แก้ไข] เปลี่ยนเป็น categoryId
    brand: string;
    InStock: string;
}

// 💡 [เพิ่ม] Interface สำหรับ Category
interface Category {
    id: number;
    name: string;
}
const initialFormState = {
    name: "",
    description: "",
    price: "",
    categoryId: "", // 💡 [แก้ไข] เปลี่ยนเป็น categoryId
    brand: "",
    InStock: "",
};

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    productToEdit: any | null;
}

export function ProductFormModal({
    isOpen,
    onClose,
    onSaveSuccess,
    productToEdit,
}: ProductFormModalProps) {
    const [productForm, setProductForm] = useState<ProductForm>(initialFormState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [addingProduct, setAddingProduct] = useState(false);
    // 💡 [เพิ่ม] State สำหรับเก็บรายการหมวดหมู่
    const [categories, setCategories] = useState<Category[]>([]);
    const editingProductId = productToEdit?.id || null;

    useEffect(() => {
        if (isOpen) {
            // 💡 [เพิ่ม] Fetch categories เมื่อ modal เปิด
            const fetchCategories = async () => {
                const token = localStorage.getItem("token");
                if (!token) return;
                try {
                    const res = await fetch("http://localhost:5000/api/categories", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCategories(data || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch categories for form", error);
                }
            };
            fetchCategories();

            if (productToEdit) {
                setProductForm({
                    name: productToEdit.name || "",
                    description: productToEdit.description || "",
                    price: String(productToEdit.price ?? "0"),
                    categoryId: String(productToEdit.categoryId ?? ""), // 💡 [แก้ไข]
                    brand: productToEdit.brand || "",
                    InStock: String(productToEdit.InStock ?? 0),
                });
                const imgUrl = productToEdit.image?.startsWith('http') ? productToEdit.image : productToEdit.image ? `http://localhost:5000${productToEdit.image}` : "";
                setImagePreview(imgUrl);
                setImageFile(null);
            } else {
                setProductForm(initialFormState);
                setImagePreview("");
                setImageFile(null);
            }
        }
    }, [isOpen, productToEdit]);

    const handleProductInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setProductForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingProduct(true);
        const token = localStorage.getItem("token");
        if (!token) return alert("Session expired");

        try {
            if (editingProductId) {
                if (imageFile) {
                    // หากมีการเปลี่ยนรูปภาพ ใช้ FormData
                    const formData = new FormData();
                    formData.append("name", productForm.name);
                    formData.append("description", productForm.description);
                    formData.append("price", productForm.price);
                    formData.append("categoryId", productForm.categoryId); // 💡 [แก้ไข]
                    formData.append("brand", productForm.brand);
                    formData.append("InStock", productForm.InStock);
                    formData.append("image", imageFile);

                    const res = await fetch(`http://localhost:5000/api/products/${editingProductId}`, {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    });
                    if (res.ok) {
                        alert("✅ อัปเดตสินค้าสำเร็จ");
                        onSaveSuccess();
                    } else {
                        try {
                            const err = await res.json();
                            alert(`❌ ${err.message || 'อัปเดตไม่สำเร็จ'}`);
                        } catch {
                            alert(`❌ เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
                        }
                    }
                } else {
                    // หากไม่มีการเปลี่ยนรูปภาพ ใช้ JSON
                    const body = {
                        name: productForm.name,
                        description: productForm.description,
                        price: parseFloat(productForm.price || "0"),
                        categoryId: productForm.categoryId && productForm.categoryId !== "null-value" ? parseInt(productForm.categoryId, 10) : null,
                        brand: productForm.brand,
                        InStock: parseInt(productForm.InStock || '0', 10),
                    };
                    const res = await fetch(`http://localhost:5000/api/products/${editingProductId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify(body),
                    });
                    if (res.ok) {
                        alert("✅ อัปเดตสินค้าสำเร็จ");
                        onSaveSuccess();
                    } else {
                        try {
                            const err = await res.json();
                            alert(`❌ ${err.message || 'อัปเดตไม่สำเร็จ'}`);
                        } catch {
                            alert(`❌ เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
                        }
                    }
                }
            } else {
                if (!imageFile) {
                    alert("❌ กรุณาเลือกรูปภาพ");
                    setAddingProduct(false);
                    return;
                }
                const formData = new FormData();
                formData.append("name", productForm.name);
                formData.append("description", productForm.description);
                formData.append("price", productForm.price);
                formData.append("categoryId", productForm.categoryId); // 💡 [แก้ไข]
                formData.append("brand", productForm.brand);
                formData.append("InStock", productForm.InStock);
                formData.append("image", imageFile);

                const res = await fetch("http://localhost:5000/api/products", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                if (res.ok) {
                    alert("✅ สินค้าถูกเพิ่มสำเร็จ");
                    onSaveSuccess();
                } else {
                    try {
                        const err = await res.json();
                        alert(`❌ ${err.message || 'เพิ่มไม่สำเร็จ'}`);
                    } catch {
                        alert(`❌ เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
                    }
                }
            }
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        } finally {
            setAddingProduct(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-3xl mx-4">
                <Card className="dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="dark:text-white text-lg">{editingProductId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="dark:text-white font-semibold">ชื่อสินค้า *</Label>
                                    <Input id="name" value={productForm.name} onChange={handleProductInputChange} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand" className="dark:text-white font-semibold">แบรนด์ *</Label>
                                    <Input id="brand" value={productForm.brand} onChange={handleProductInputChange} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="dark:text-white font-semibold">รายละเอียด *</Label>
                                <textarea id="description" value={productForm.description} onChange={handleProductInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" rows={4} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="dark:text-white font-semibold">ราคา (฿) *</Label>
                                    <Input id="price" type="number" step="0.01" min="0" value={productForm.price} onChange={handleProductInputChange} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId" className="dark:text-white font-semibold">หมวดหมู่ *</Label>
                                    {/* 💡 [แก้ไข] เปลี่ยนเป็น Select */}
                                    <Select value={productForm.categoryId} onValueChange={(value) => setProductForm(prev => ({ ...prev, categoryId: value }))}>
                                        <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                                            <SelectValue placeholder="— เลือกหมวดหมู่ —" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null-value">— ไม่มีหมวดหมู่ —</SelectItem>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="InStock" className="dark:text-white font-semibold">จำนวนในสต็อก *</Label>
                                    <Input id="InStock" type="number" min="0" value={productForm.InStock} onChange={handleProductInputChange} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="dark:text-white font-semibold">รูปภาพสินค้า {editingProductId ? "(เลือกเพื่อเปลี่ยนรูปภาพ)" : "*"}</Label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md mx-auto" />
                                )}
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                                    <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{imageFile ? imageFile.name : 'คลิกหรือลากรูปภาพมาวาง'}</p>
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" disabled={addingProduct} className="w-full bg-blue-600">
                                {addingProduct ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                {editingProductId ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มสินค้า'}
                            </Button>
                            <Button type="button" onClick={onClose} className="w-full bg-gray-500">
                                ยกเลิก
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}