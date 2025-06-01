"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie"; // 🍪 import cookies
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import {
  PhoneIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { client } from "../../../utils/sanityClient";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ProductViewer({ product }) {
  const [mainImage, setMainImage] = useState(product.images?.[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Print the cart cookie every time the component mounts
    const cart = Cookies.get("cart");
    if (cart) {
      // console.log("🛒 Cart Cookie:", JSON.parse(cart));
    } else {
      // console.log("🛒 Cart is empty.");
    }
  }, []);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Choose a size before adding to cart!");
      return;
    }
  
    const cart = Cookies.get("cart");
    const currentCart = cart ? JSON.parse(cart) : [];
  
    const newItem = {
      title: product.title,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images?.[0],
      slug: product.slug?.current || product.slug, // Fetch the slug from Sanity
    };
  
    const updatedCart = [...currentCart, newItem];
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  
    // console.log("✅ Added to cart:", newItem);
    console.log("🧾 Updated cart:", updatedCart);
  
    // Optionally, show a success toast:
    toast.success("Item added to cart!");
  };

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="w-full">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.title}
                width={600}
                height={600}
                className="rounded-xl w-full object-cover mb-4"
              />
            )}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`border rounded-lg cursor-pointer overflow-hidden ${
                    mainImage === img ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-2">
              <p className="text-gray-400 line-through text-lg">
                ₹{product.originalPrice || product.price + 100}
              </p>
              <p className="text-xl font-semibold">₹{product.price}</p>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                Sale
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Taxes included. Calculated at checkout.
            </p>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`border rounded-full px-4 py-2 transition duration-150 ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center border rounded-full w-fit px-4 py-1 gap-4">
                <button className="text-lg" onClick={decrementQuantity}>
                  −
                </button>
                <span>{quantity}</span>
                <button className="text-lg" onClick={incrementQuantity}>
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mb-3">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-[#5a31f4] flex justify-center items-center hover:bg-[#4825c5] text-white py-3 rounded-full text-lg transition duration-200"
              >
                Confirm on<span className="font-bold ml-1">Call</span>
                <PhoneIcon width={20} className="mx-2" />
                <span className="ml-1 bg-white text-[#5a31f4] px-2 py-[2px] rounded text-sm font-bold">
                  Now!
                </span>
              </button>

              <button
                onClick={handleAddToCart}
                className="mt-3 w-full bg-[#5a31f4] gap-4 flex justify-center items-center hover:bg-[#4825c5] text-white py-3 rounded-full text-lg transition duration-200"
              >
                Add to cart <ShoppingCartIcon width={25} />
              </button>
            </div>

            <ul className="list-disc pl-5 space-y-6 text-gray-700 text-sm">
              <li>Free Shipping</li>
              <li>Unisex</li>
              <li>Comes with 1 free sticker</li>
              <li>Street/Casual</li>
              <li>Short sleeve</li>
            </ul>
          </div>
        </div>
      </div>
      {showForm && (
        <AnimatePresence>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              className="relative w-[90%] max-w-md rounded-xl bg-white p-8 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              {/* Close button */}
              <div className="flex-row justify-between items-center mb-6">
                <motion.h2
                  className="mb-4 text-2xl font-semibold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Confirm on Call
                </motion.h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  className="absolute right-6 top-6 text-lg font-bold"
                  onClick={() => setShowForm(false)}
                >
                  <XMarkIcon width={25} />
                </motion.button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                
                  const phoneNumber = form.elements.phone.value.trim();
                  const customerEmail = form.elements.email.value.trim();
                
                  // Indian phone number regex: starts with 6-9, followed by 9 digits
                  const phoneRegex = /^[6-9]\d{9}$/;
                
                  // Gmail regex: ends with @gmail.com (case insensitive)
                  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
                
                  if (!phoneRegex.test(phoneNumber)) {
                    toast.error("Please enter a valid Indian phone number.");
                    return;
                  }
                
                  if (!gmailRegex.test(customerEmail)) {
                    toast.error("Please enter a valid Gmail address (example@gmail.com)");
                    return;
                  }
                
                  const formData = {
                    customerName: form.elements.name.value.trim(),
                    phoneNumber,
                    customerEmail,
                    address: form.elements.address.value.trim(),
                    quantity,
                    size: selectedSize,
                    productTitle: product.title,
                    productImage: product.images?.[0],
                  };
                
                  const orderDoc = {
                    _type: "order",
                    customerName: formData.customerName,
                    phoneNumber: formData.phoneNumber,
                    customerEmail: formData.customerEmail,
                    address: formData.address,
                    orderNumber: uuidv4(),
                    status: "pending",
                    orderDate: new Date().toISOString(),
                    products: [
                      {
                        _key: uuidv4(),
                        title: formData.productTitle,
                        image: formData.productImage,
                        quantity: formData.quantity,
                        size: formData.size,
                        totalPrice: product.price * formData.quantity,
                      },
                    ],
                  };
                
                  try {
                    const result = await client.create(orderDoc);
                    console.log("✅ Order saved to Sanity:", result);
                    toast.success("Order placed! We'll call you soon.");
                    setShowForm(false);
                  } catch (error) {
                    console.error("❌ Failed to save order:", error);
                    toast.error("Order submission failed. Please try again.");
                  }
                }}
              >
                {/* User Info */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    className="w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    name="address"
                    placeholder="Address"
                    required
                    className="w-full resize-none rounded-lg border px-4 py-2"
                  />
                </div>

                {/* Size Selector */}
                <div className="mb-4">
                  <p className="mb-1 font-medium">Select Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size) => (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 transition ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity Controller */}
                <div className="mb-4">
                  <p className="mb-1 font-medium">Quantity:</p>
                  <div className="flex w-fit items-center gap-4 rounded-full border px-4 py-2">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      onClick={() =>
                        setQuantity((prev) => Math.max(prev - 1, 1))
                      }
                      className="text-xl font-semibold"
                    >
                      -
                    </motion.button>
                    <span className="text-lg">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="text-xl font-semibold"
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-4">
                  <p className="mb-1 font-medium">Product:</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images?.[0]}
                      alt="Product"
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    <span>{product.title}</span>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                >
                  Submit
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <Footer />
    </>
  );
}
