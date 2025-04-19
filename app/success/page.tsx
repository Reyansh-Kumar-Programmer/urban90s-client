"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { user, isLoaded } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const name = user?.fullName;

  const [loading, setLoading] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  const saveOrder = async () => {
    if (loading || orderSaved) return;

    const cookieData = Cookies.get("cart");
    const cartItems = cookieData ? JSON.parse(cookieData) : [];

    console.log("🧾 Cart Items:", cartItems);

    const total = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const formattedProducts = cartItems.map((item: any) => {
      console.log("🛒 Item from cart:", item);
    
      return {
        title: item.title || "",                // check these are actually there
        image: item.image || "",
        quantity: item.quantity || 1,
        totalPrice: item.price * item.quantity || 0,
        size: item.size || "N/A",
      };
    });
    

    const orderData = {
      customerName: name,
      customerEmail: email,
      products: formattedProducts,
    };

    setLoading(true);
    const response = await fetch("/api/save-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const resJson = await response.json();
    console.log("✅ Response from /api/save-order:", resJson);

    Cookies.remove("cart");
    setLoading(false);
    setOrderSaved(true);
    router.push("/shop");
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
      <p className="mt-2 text-gray-500">
        Your order has been placed successfully.
      </p>

      <button
        onClick={saveOrder}
        disabled={loading || orderSaved}
        className={`mt-6 px-6 py-2 text-white rounded ${
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
  );
}
