"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Save } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    categoryToEdit: Category | null;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSaveSuccess,
    categoryToEdit,
}: CategoryFormModalProps) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const editingCategoryId = categoryToEdit?.id || null;

    useEffect(() => {
        if (isOpen) {
            setName(categoryToEdit?.name || "");
        }
    }, [isOpen, categoryToEdit]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please log in again.");
            setIsLoading(false);
            return;
        }

        const url = editingCategoryId
            ? `http://localhost:5000/api/categories/${editingCategoryId}`
            : "http://localhost:5000/api/categories";

        const method = editingCategoryId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                alert(`✅ ${editingCategoryId ? "อัปเดต" : "เพิ่ม"}หมวดหมู่สำเร็จ`);
                onSaveSuccess();
            } else {
                const err = await res.json();
                alert(`❌ ${err.message || "เกิดข้อผิดพลาด"}`);
            }
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-md mx-4">
                <Card className="dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="dark:text-white text-lg">
                            {editingCategoryId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="dark:text-white font-semibold">ชื่อหมวดหมู่ *</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingCategoryId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                    {editingCategoryId ? 'บันทึก' : 'เพิ่ม'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}