"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie"; // 🍪 import cookies
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface Product {
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
}

export default function ProductViewer({ product }: { product: Product }) {
  const [mainImage, setMainImage] = useState(product.images?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // Print the cart cookie every time the component mounts
    const cart = Cookies.get("cart");
    if (cart) {
      console.log("🛒 Cart Cookie:", JSON.parse(cart));
    } else {
      console.log("🛒 Cart is empty.");
    }
  }, []);

  const handleSizeClick = (size: string) => {
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
      alert("Please select a size before adding to cart.");
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
    };

    const updatedCart = [...currentCart, newItem];
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // expires in 7 days

    console.log("✅ Added to cart:", newItem);
    console.log("🧾 Updated cart:", updatedCart);
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
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Sale</span>
            </div>

            <p className="text-sm text-gray-500 mb-4">Taxes included. Calculated at checkout.</p>
            <p className="text-sm mb-6">
              Pay over time for orders over <strong>₹35.00</strong> with{" "}
              <span className="text-[#5a31f4] font-medium">Shop Pay</span>.{" "}
              <a href="#" className="underline">Learn more</a>
            </p>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes?.map((size: string) => (
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
                <button className="text-lg" onClick={decrementQuantity}>−</button>
                <span>{quantity}</span>
                <button className="text-lg" onClick={incrementQuantity}>+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mb-3">
              <button className="w-full bg-[#5a31f4] hover:bg-[#4825c5] text-white py-3 rounded-full text-lg transition duration-200">
                Buy with <span className="font-bold ml-1">shop</span>
                <span className="ml-1 bg-white text-[#5a31f4] px-2 py-[2px] rounded text-sm font-bold">Pay</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="mt-3 w-full bg-[#5a31f4] gap-4 flex justify-center items-center hover:bg-[#4825c5] text-white py-3 rounded-full text-lg transition duration-200"
              >
                Add to cart <ShoppingCartIcon width={25} />
              </button>
            </div>

            <p className="text-center underline text-sm mb-6">More payment options</p>

            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm">
              <li>Free Shipping</li>
              <li>Unisex</li>
              <li>Comes with 1 free sticker</li>
              <li>Street/Casual</li>
              <li>Short sleeve</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}