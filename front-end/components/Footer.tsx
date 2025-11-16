"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from '@tabler/icons-react';

const Footer = () => {
  const pathname = usePathname();

  // ซ่อน Footer ถ้าอยู่ในหน้าของ Admin
  if (pathname.startsWith('/for-admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-t dark:border-slate-700 mt-16">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demo Shop</h3>
            <p className="text-sm">
              ร้านค้าสาธิตสำหรับนำเสนอทักษะการพัฒนาเว็บแอปพลิเคชันด้วย Next.js, Node.js, และ MySQL
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-purple-500 transition-colors">เกี่ยวกับเรา</Link></li>
              <li><Link href="/shop-products" className="hover:text-purple-500 transition-colors">สินค้าทั้งหมด</Link></li>
              <li><Link href="/contact-us" className="hover:text-purple-500 transition-colors">ติดต่อเรา</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ติดตามเรา</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-purple-500 transition-colors"><IconBrandFacebook /></a>
              <a href="#" aria-label="Twitter" className="hover:text-purple-500 transition-colors"><IconBrandTwitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-purple-500 transition-colors"><IconBrandInstagram /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Demo Shop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
