"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Header from "../../components/Header";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { client } from "../../utils/sanityClient";
import toast from "react-hot-toast";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CartUI() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const email = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const cart = Cookies.get("cart");
    // console.log("Cart cookie:", cart);
    if (cart) {
      try {
        setCartItems(JSON.parse(cart));
      } catch (e) {
        console.error("Invalid cart cookie");
      }
    }
  }, []);

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = Math.max(
      1,
      updatedCart[index].quantity + delta
    );
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const handleRemove = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const checkoutHandler = async () => {
    if (!user) {
      toast.error("Please sign in to continue checkout");
      setTimeout(() => {
        router.push("/authentication/signup");
      }, 1500);
      return;
    }

    try {
      const cookieData = Cookies.get("cart");
      const cartItems = cookieData ? JSON.parse(cookieData) : [];

      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, email }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
      toast.error("Something went wrong while creating session.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Cart</h2>
              <div
                onClick={() => {
                  setCartItems([]);
                  Cookies.set("cart", JSON.stringify([]), { expires: 7 });
                }}
                className="flex items-center space-x-2 text-gray-500 text-sm cursor-pointer"
              >
                <TrashIcon className="w-5 h-5" />
                <span>Clear Cart</span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-gray-500 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => router.push(`/product/${item.slug}`)}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h2 className="text-base font-semibold line-clamp-1">
                          {item.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                        <p className="text-sm font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="w-8 h-8 border rounded flex items-center justify-center text-xl"
                      >
                        −
                      </button>
                      <span className="text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="w-8 h-8 border rounded flex items-center justify-center text-xl"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="ml-2 text-red-500 text-sm flex items-center gap-1"
                      >
                        <TrashIcon className="w-5 h-5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-2 border-gray-500 p-6 rounded-lg h-fit shadow-md">
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
              onClick={() => setShowForm(true)}
              className="w-full mt-6 cursor-pointer bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border-2 transition"
            >
              Confirm Your Order 📞
            </button>
          </div>
        </div>
      </main>
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
                const formData = {
                  customerName: form.elements.name.value,
                  phoneNumber: form.elements.phone.value.trim(),
                  customerEmail: form.elements.email.value.trim(),
                  address: form.elements.address.value.trim(),
                };
              
                // Phone number validation (must be exactly 10 digits, numeric)
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(formData.phoneNumber)) {
                  toast.error("Please enter a valid 10-digit Indian phone number");
                  return;
                }
              
                // Email validation (must end with '@gmail.com')
                const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
                if (!emailRegex.test(formData.customerEmail)) {
                  toast.error("Please enter a valid Gmail address (example@gmail.com)");
                  return;
                }
              
                // Create an array of product objects from cartItems
                const products = cartItems.map((item) => ({
                  _key: uuidv4(),
                  title: item.title,
                  image: item.image,
                  quantity: item.quantity,
                  size: item.size,
                  totalPrice: item.price * item.quantity,
                }));
              
                const orderDoc = {
                  _type: "order",
                  customerName: formData.customerName,
                  phoneNumber: formData.phoneNumber,
                  customerEmail: formData.customerEmail,
                  address: formData.address,
                  orderNumber: uuidv4(),
                  status: "pending",
                  orderDate: new Date().toISOString(),
                  products: products,
                };
              
                try {
                  const result = await client.create(orderDoc);
                  console.log("✅ Order saved to Sanity:", result);
                  toast.success("Order placed! We'll call you soon.");
                  setShowForm(false);
                  Cookies.remove("cart");
                  router.push("/order");
                } catch (error) {
                  console.error("❌ Failed to save order:", error);
                  alert(
                    "There was a problem submitting your order. Please try again."
                  );
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
                <div className="mb-3">
                  <textarea
                    name="address"
                    placeholder="Delivery Address"
                    required
                    className="w-full rounded-lg border px-4 py-2"
                  />
                </div>

                {/* Show all products in cart */}
                <div className="mb-3">
                  <h4 className="font-semibold mb-2">
                    Products in your order:
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div className="flex justify-center items-center gap-10">
                          <div>
                            <p className="text-sm pb-1 font-medium">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-md font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                  <p className="text-lg pt-4 font-semibold">
    Grand Total: ₹
    {cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString()}
  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-white hover:text-black border transition"
                >
                  Place Order
                </button>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Subscription Footer */}
      <Footer />
    </>
  );
}
