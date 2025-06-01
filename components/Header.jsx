"use client";
import React, { useState, useEffect } from "react";
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
import { getAllProducts } from "../components/getAllProducts";
import { PackageIcon } from "@sanity/icons";
import { client } from "../utils/sanityClient";
import Cookies from "js-cookie";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "category"]{
            name,
            slug
          }`
        );
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setAllProducts(data);
    };
    fetchProducts();
  }, []);

  // Filter search results
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, allProducts]);

  // Fetch cart items from cookies
  useEffect(() => {
    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      try {
        const cart = JSON.parse(cartCookie);
        const itemCount = cart.reduce(
          (total, item) => total + (item.quantity || 1),
          0
        );
        setCartItemCount(itemCount);
      } catch (err) {
        console.error("Error parsing cart cookie:", err);
      }
    } else {
      setCartItemCount(0);
    }
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Banner */}
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
        {/* Mobile Hamburger + Logo */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
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
          </button>
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              src="/urban.jpg"
              alt="logo"
              width={100}
              height={30}
              className="animate-pulse"
            />
          </div>
        </div>

        {/* Centered Logo */}
        <div
          className="hidden md:block absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/urban.jpg"
            alt="logo"
            width={100}
            height={30}
            className="animate-pulse"
          />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a
            onClick={() => router.push("/shop")}
            className="relative group cursor-pointer"
          >
            Shop All
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          {categories.map((cat) => (
            <a
              key={cat.slug.current}
              onClick={() => router.push(`/shop/${cat.slug.current}`)}
              className="relative group cursor-pointer"
            >
              {cat.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            onClick={() => router.push("/contact")}
            className="relative group cursor-pointer"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 relative">
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
          <div
            onClick={() => router.push("/cart")}
            className="relative cursor-pointer"
          >
            <ShoppingBagIcon className="h-5 w-5 text-gray-800" />
            {cartItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </div>
            )}
          </div>
          {isSignedIn && (
            <PackageIcon
              onClick={() => router.push("/order")}
              className="h-5 w-5 text-gray-800 cursor-pointer"
            />
          )}
        </div>
      </motion.nav>

      {/* Mobile Nav */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b shadow px-4 py-4 flex flex-col gap-4">
          <a onClick={() => router.push("/shop")}>Shop All</a>
          {categories.map((cat) => (
            <a
              key={cat.slug.current}
              onClick={() => router.push(`/shop/${cat.slug.current}`)}
            >
              {cat.name}
            </a>
          ))}
          <a onClick={() => router.push("/contact")}>Contact</a>
        </div>
      )}

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center px-4 py-6 bg-white border-b z-50 relative"
          >
            <div className="flex items-center w-full max-w-3xl border rounded-full px-4 py-2 shadow-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="flex-grow outline-none px-2"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 cursor-pointer mr-2" />
              <XMarkIcon
                className="h-5 w-5 text-gray-800 cursor-pointer"
                onClick={() => setShowSearch(false)}
              />
            </div>
            {filteredProducts.length > 0 && (
              <div className="bg-white shadow-md rounded-lg mt-4 w-full max-w-3xl border">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm("");
                      router.push(`/product/${product.slug.current}`);
                    }}
                  >
                    {product.title}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
