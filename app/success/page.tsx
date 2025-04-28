"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const name = user?.fullName;

  const [loading, setLoading] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");

  const validatePhoneNumber = (num: string) => /^[6-9]\d{9}$/.test(num);

  const saveOrder = async () => {
    if (loading || orderSaved) return;

    if (!phoneNumber || !shippingAddress) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setError("");

    const cookieData = Cookies.get("cart");
    const cartItems = cookieData ? JSON.parse(cookieData) : [];

    const formattedProducts = cartItems.map((item: any) => ({
      title: item.title || "",
      image: item.image || "",
      quantity: item.quantity || 1,
      totalPrice: item.price * item.quantity || 0,
      size: item.size || "N/A",
    }));

    const orderData = {
      customerName: name,
      customerEmail: email,
      phoneNumber,
      address: shippingAddress,
      products: formattedProducts,
      status: "paid",
    };

    setLoading(true);
    const response = await fetch("/api/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const resJson = await response.json();
    console.log("✅ Order response:", resJson);

    Cookies.remove("cart");
    setLoading(false);
    setOrderSaved(true);
    router.push("/order");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md">
        <img
          src="/checkout.jpg"
          alt="Order Illustration"
          className="w-full h-auto object-cover rounded-t-2xl shadow-lg"
        />

        <div className="bg-white shadow-md p-6 sm:p-8 w-full rounded-b-2xl">
          <h1 className="text-2xl font-bold text-gray-800">
            Thank you for your purchase!
          </h1>
          <p className="text-gray-500 mb-4">
            Please enter your delivery details below.
          </p>

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          />

          <textarea
            placeholder="Shipping Address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-28 resize-none"
          />

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

          <button
            onClick={saveOrder}
            disabled={loading || orderSaved}
            className={`mt-6 w-full py-3 text-white font-medium rounded-lg transition ${
              loading || orderSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading
              ? "Saving Order..."
              : orderSaved
              ? "Order Confirmed"
              : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
