"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isSignedIn, user } = useUser();
  const router = useRouter(); // <-- Added this

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Promo Bar */}
      <motion.div
        className="bg-blue-600 text-white text-sm text-center py-2 font-semibold"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Next 5 to order get extra free stickers
      </motion.div>

      {/* Navbar */}
      <motion.nav
        className="relative flex items-center justify-between px-4 md:px-6 py-3 border-b h-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a
            href="#"
            onClick={() => router.push("/shop")}
            className="relative group"
          >
            Shop All
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="relative group">
            Hoodies
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="relative group">
            T-Shirts
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="relative group">
            Caps
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            onClick={() => router.push("/contact")}
            className="relative group"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div className="md:hidden">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          onClick={() => router.push("/")}
        >
          <Image
            src="/urb.png"
            alt="logo"
            width={100}
            height={30}
            className="animate-pulse"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-800 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <UserIcon
                className="h-5 w-5 text-gray-800 cursor-pointer"
                onClick={() => router.push("/authentication/signin")}
              />
            )}
            <ShoppingBagIcon
              onClick={() => router.push("/cart")}
              className="h-5 w-5 text-gray-800 cursor-pointer"
            />
          </div>
        </div>
      </motion.nav>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center px-4 py-6 bg-white border-b"
          >
            <div className="flex items-center w-full max-w-3xl border rounded-full px-4 py-2 shadow-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="flex-grow outline-none px-2"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
            </div>
            <button onClick={() => setShowSearch(false)} className="ml-4">
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
