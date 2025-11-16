"use client"
import React, { useState, useEffect, useRef } from 'react'
import { IconBrandLine, IconBuildingStore, IconHome, IconTruckDelivery, IconHeadset, IconShieldCheck, IconPackage } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { motion, Variants, useInView } from "framer-motion";

const HomePage = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const text = "..................................................................";

  // ตรวจจับ scroll สำหรับ navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Refs สำหรับทุก section
  const navbarRef = useRef(null);
  const bannerRef = useRef(null);
  const whyRef = useRef(null);
  const servicesRef = useRef(null);

  // InView detection
  const navbarInView = useInView(navbarRef, { amount: 0.2 });
  const bannerInView = useInView(bannerRef, { amount: 0.2 });
  const whyInView = useInView(whyRef, { amount: 0.2 });
  const servicesInView = useInView(servicesRef, { amount: 0.2 });

  return (
    <div>
      {/* Navbar */}
      <motion.div
        ref={navbarRef}
        variants={container}
        initial="hidden"
        animate={navbarInView ? "show" : "hidden"}
        className={`flex flex-row sm:justify-center mt-10 mb-5 gap-4 justify-center w-full sticky top-0 z-50 transition-colors duration-500
          ${scrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}
        `}
      >
        <motion.div variants={item} className='p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-500 w-32 flex flex-col justify-center gap-1 items-center' onClick={() => router.push("/")}>
          <IconHome stroke={2} className='w-10 h-10 rounded-full bg-gray-200 p-2' />
          <span>เกี่ยวกับเรา</span>
        </motion.div>
        <motion.div variants={item} className='p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-500 w-32 flex flex-col justify-center gap-1 items-center' onClick={() => router.push("/shop-products")}>
          <IconBuildingStore stroke={2} className='w-10 h-10 rounded-full bg-gray-200 p-2' />
          <span>สินค้าทั้งหมด</span>
        </motion.div>
        <motion.div variants={item} className='p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-500 w-32 flex flex-col justify-center gap-1 items-center' onClick={() => router.push("/contact-us")}>
          <IconBrandLine stroke={2} className='w-10 h-10 rounded-full bg-gray-200 p-2' />
          <span>ติดต่อเรา</span>
        </motion.div>
      </motion.div>

      {/* Banner */}
      <motion.div
        ref={bannerRef}
        variants={container}
        initial="hidden"
        animate={bannerInView ? "show" : "hidden"}
        className='h-full gap-5 container mt-20 mb-10 flex flex-col justify-center items-center sm:flex-col'
      >
        <motion.div variants={item} className='relative w-72 h-72 font-bold text-5xl'>
          <div className='absolute inset-0 rounded-full border-t-red-500 dark:border-t-white border-4 border-transparent dark:border-4 animate-spin transition duration-1500' />
          <div className='absolute inset-0 rounded-full border-b-blue-500 dark:border-b-purple-800 border-4 border-transparent dark:border-4 animate-spin' />
          <div className='relative w-full h-full flex items-center justify-center text-center'>
            LOGO
          </div>
        </motion.div>

        <motion.div variants={item} className='text-center text-sm align-middle mt-4'>
          {["ยินดีต้อนรับสู่ Demo Shop", 
            "ร้านค้านี้เป็นโครงการที่จัดทำขึ้นเพื่อการสัมภาษณ์งานในตำแหน่ง (Programmer) โดยมีวัตถุประสงค์เพื่อนำเสนอทักษะและความเข้าใจในการพัฒนาเว็บแอปพลิเคชัน", 
            "โปรเจกต์นี้แสดงให้เห็นถึงการประยุกต์ใช้เทคโนโลยี (Backend: Node.js Frontend: Next.js) เพื่อสร้างประสบการณ์การใช้งาน E-commerce ที่สมบูรณ์"
          ].map((line, idx) => (
            <motion.p key={idx} variants={item} className="mb-2">{line}</motion.p>
          ))}

          {/* Animate ตัวอักษรแบบ stagger */}
          <div className='mt-5 flex justify-center items-center gap-1 dark:text-purple-500'>
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={item}
                className='text-center justify-center items-center flex'
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ทำไมต้องเลือกเรา */}
      <motion.div
        ref={whyRef}
        variants={container}
        initial="hidden"
        animate={whyInView ? "show" : "hidden"}
        className='bg-gray-100 dark:bg-gray-800 justify-center items-center mx-auto w-full py-16'
      >
        <div className='container flex flex-col md:flex-row justify-center items-center gap-12 text-center md:text-left'>
          <motion.div variants={item} className='w-full md:w-1/2'>
            <motion.h2 variants={item} className='text-3xl font-bold mb-4'>ทำไมต้องเลือกเรา?</motion.h2>
            <motion.p variants={item} className='mb-6 text-gray-600 dark:text-gray-300'>
              เรามุ่งมั่นที่จะมอบประสบการณ์การช็อปปิ้งออนไลน์ที่ดีที่สุดให้กับคุณ ด้วยสินค้าคุณภาพสูง การบริการที่เป็นเลิศ และความน่าเชื่อถือที่คุณวางใจได้
            </motion.p>
            <motion.ul variants={container} className='space-y-4'>
              {[ 
                {icon: <IconPackage className='w-6 h-6 text-purple-500 mt-1 shrink-0' />, text: "สินค้าคุณภาพ: คัดสรรมาเพื่อคุณโดยเฉพาะ จากแบรนด์ชั้นนำ"},
                {icon: <IconTruckDelivery className='w-6 h-6 text-purple-500 mt-1 shrink-0' />, text: "จัดส่งรวดเร็ว: บริการจัดส่งที่รวดเร็วและปลอดภัย ถึงมือคุณในเวลาที่กำหนด"},
                {icon: <IconHeadset className='w-6 h-6 text-purple-500 mt-1 shrink-0' />, text: "บริการลูกค้า 24/7: ทีมงานพร้อมให้ความช่วยเหลือและตอบทุกข้อสงสัย"},
                {icon: <IconShieldCheck className='w-6 h-6 text-purple-500 mt-1 shrink-0' />, text: "รับประกันความพอใจ: สามารถคืนสินค้าได้หากไม่พอใจในคุณภาพ"}
              ].map((li, idx) => (
                <motion.li key={idx} variants={item} className='flex items-start gap-3'>
                  {li.icon}<span>{li.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div variants={item} className='w-full md:w-1/2 mx-auto'>
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="รูปสำนักงาน" className='rounded-lg shadow-lg' />
          </motion.div>
        </div>
      </motion.div>

      {/* บริการของเรา */}
      <motion.div
        ref={servicesRef}
        variants={container}
        initial="hidden"
        animate={servicesInView ? "show" : "hidden"}
        className="w-full py-16"
      >
        <div className="container mx-auto text-center">
          <motion.h2 variants={item} className="text-3xl font-bold mb-4">บริการของเรา</motion.h2>
          <motion.p variants={item} className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            เรามีบริการครบวงจรเพื่อตอบสนองทุกความต้องการของคุณ ตั้งแต่การเลือกซื้อไปจนถึงบริการหลังการขาย
          </motion.p>
          <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {icon: <IconTruckDelivery className="w-12 h-12 text-purple-500 mx-auto mb-4" stroke={1.5} />, title: "จัดส่งทั่วประเทศ", desc: "ไม่ว่าคุณจะอยู่ที่ไหน เราพร้อมจัดส่งสินค้าให้ถึงหน้าบ้านคุณอย่างปลอดภัย"},
              {icon: <IconHeadset className="w-12 h-12 text-purple-500 mx-auto mb-4" stroke={1.5} />, title: "ให้คำปรึกษา", desc: "ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำ เพื่อให้คุณได้สินค้าที่ตรงใจที่สุด"},
              {icon: <IconShieldCheck className="w-12 h-12 text-purple-500 mx-auto mb-4" stroke={1.5} />, title: "รับประกันของแท้", desc: "มั่นใจได้กับสินค้าทุกชิ้นจากร้านเราว่าเป็นของแท้ 100% พร้อมการรับประกัน"}
            ].map((service, idx) => (
              <motion.div key={idx} variants={item} className="p-6 border dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default HomePage;
