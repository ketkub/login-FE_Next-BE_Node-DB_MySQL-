"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('');
  // 💡 [แก้ไข] เปลี่ยนเป็น categoryId เพื่อให้ตรงกับ backend
  const [categoryId, setCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState<[number]>([50000]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // 💡 [เพิ่ม] State สำหรับเก็บรายการหมวดหมู่
  const [categoriesList, setCategoriesList] = useState<{ id: number; name: string }[]>([]);

  // 💡 [เพิ่ม] ซิงค์ state กับ URL query parameters เมื่อ component โหลด
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setBrand(searchParams.get('brand') || '');
    // 💡 [แก้ไข] อ่านค่า categoryId จาก URL
    setCategoryId(searchParams.get('categoryId') || '');
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      setPriceRange([parseInt(maxPrice, 10)]);
    }
  }, [searchParams]);

  // 💡 [เพิ่ม] ดึงข้อมูลหมวดหมู่ทั้งหมดเมื่อ Component โหลด
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 💡 [เพิ่ม] ดึง token และเพิ่ม Authorization header
        const token = localStorage.getItem("token");
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:5000/api/categories", {
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setCategoriesList(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []); // ทำงานครั้งเดียวเมื่อโหลด

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (brand) params.append('brand', brand);
    // 💡 [แก้ไข] ส่ง categoryId ไปใน URL
    if (categoryId && categoryId !== "all-categories") params.append('categoryId', categoryId);
    if (priceRange[0] > 0) params.append('maxPrice', priceRange[0].toString());

    // นำทางไปยังหน้าสินค้่าพร้อม query string
    router.push(`/shop-products?${params.toString()}`);
    setIsPopoverOpen(false); // 💡 [เพิ่ม] ปิด Popover หลังค้นหา
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchQuery(''); // 💡 [เพิ่ม] ล้างคำค้นหาด้วย
    setBrand('');
    setCategoryId('');
    setPriceRange([50000]);
    // 💡 [เพิ่ม] นำทางไปยังหน้าสินค้าหลักเพื่อแสดงสินค้าทั้งหมด
    router.push('/shop-products');
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full max-w-xs">
        <Input
          type='text'
          placeholder='ค้นหาสินค้า...'
          className='pr-10'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconSearch 
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
          onClick={handleSearch}
        />
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <IconAdjustmentsHorizontal className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">ค้นหาขั้นสูง</h4>
              <p className="text-sm text-muted-foreground">
                กรองผลลัพธ์เพื่อหาสินค้าที่ต้องการ
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">แบรนด์</Label>
              <Input
                id="brand"
                placeholder="ค้นหาตามแบรนด์..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              <Label htmlFor="categoryId">ประเภทสินค้า</Label>
              {/* 💡 [แก้ไข] ดึงข้อมูลประเภทมาจาก API */}
              <Select onValueChange={setCategoryId} value={categoryId}>
                <SelectTrigger className='w-full'><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                <SelectContent>
                  {/* วนลูปแสดงรายการหมวดหมู่ */}
                  <SelectItem value="all-categories">ทุกหมวดหมู่</SelectItem>
                  {categoriesList.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="price">ราคาสูงสุด: {priceRange[0].toLocaleString()} บาท</Label>
              <Slider value={priceRange} defaultValue={[50000]} max={100000} step={1000} onValueChange={(value: number[]) => setPriceRange(value as [number])} />
            </div>
            <div className='flex justify-between'>
                <Button variant="ghost" onClick={clearFilters}>ล้างค่า</Button>
                <Button onClick={handleSearch}>ค้นหา</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Search;
