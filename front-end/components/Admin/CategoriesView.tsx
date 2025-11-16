"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { CategoryFormModal } from "./CategoryFormModal";

interface Category {
    id: number;
    name: string;
}

export function CategoriesView() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Session not found. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setCategories(data || []);
            } else {
                setError(data.message || "Failed to fetch categories");
                setCategories([]);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("ยืนยันการลบหมวดหมู่นี้?")) return;
        const token = localStorage.getItem("token");
        if (!token) return alert("Session expired");

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("✅ ลบหมวดหมู่เรียบร้อย");
                fetchCategories();
            } else {
                const err = await res.json();
                alert(`❌ ${err.message || 'ลบไม่สำเร็จ'}`);
            }
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        }
    };

    const handleEdit = (category: Category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        fetchCategories();
    };

    return (
        <>
            <Card className="dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="dark:text-white text-xl">จัดการหมวดหมู่ ({categories.length})</CardTitle>
                    <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                        เพิ่มหมวดหมู่
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}
                    {error && <div className="text-center py-6 text-red-500 dark:text-red-400"><p>{error}</p></div>}
                    {!isLoading && !error && (
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                    <p className="font-semibold dark:text-white">{cat.name}</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(cat)} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 rounded bg-red-600 hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSaveSuccess={handleSaveSuccess}
                categoryToEdit={categoryToEdit}
            />
        </>
    );
}