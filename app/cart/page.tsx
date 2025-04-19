"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CartUI() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const cart = Cookies.get("cart");
    if (cart) {
      try {
        setCartItems(JSON.parse(cart));
      } catch (e) {
        console.error("Invalid cart cookie");
      }
    }
  }, []);

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = Math.max(
      1,
      updatedCart[index].quantity + delta
    );
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const handleRemove = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const checkoutHandler = async () => {
    try {
      const cookieData = Cookies.get("cart");
      const cartItems = cookieData ? JSON.parse(cookieData) : [];

      if (cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          email: email, // dynamically sent from Clerk
        }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 pb-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Cart</h2>
              <div className="flex items-center space-x-2 text-gray-500 text-sm cursor-pointer">
                <TrashIcon className="w-6 h-6 text-gray-400" />
                <span className="text-base">Remove</span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-6 gap-4"
                >
                  <div className="flex items-start gap-4 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      className="w-6 h-6 sm:w-5 sm:h-5 mt-1"
                    />
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-xs text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="w-9 h-9 border rounded text-2xl font-light"
                      >
                        −
                      </button>
                      <span className="text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="w-9 h-9 border rounded text-2xl font-light"
                      >
                        +
                      </button>
                    </div>

                    <div
                      className="text-sm text-red-500 cursor-pointer flex items-center gap-1"
                      onClick={() => handleRemove(idx)}
                    >
                      <TrashIcon className="w-5 h-5" />
                      Remove
                    </div>

                    <div className="text-lg font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-2 border-gray-300 p-6 rounded-lg h-fit shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span>₹{discount}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Grand total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={checkoutHandler}
              className="w-full mt-6 cursor-pointer bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border transition"
            >
              Checkout now
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t p-6 h-[250px]">
        <div className="text-center pt-5">
          <h2 className="text-xl font-bold">Subscribe to our emails</h2>
          <p className="mt-1 text-gray-600">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form className="mt-4 flex items-center justify-center">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 w-72 border border-gray-300 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900"
            >
              <ArrowRightIcon className="h-5 w-5 text-white" />
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <span>© 2025, Urban90s Created by Reyansh</span>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy policy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Contact information</a>
              <span>·</span>
              <a href="#" className="hover:underline">Shipping policy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms of service</a>
              <span>·</span>
              <a href="#" className="hover:underline">Refund policy</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
