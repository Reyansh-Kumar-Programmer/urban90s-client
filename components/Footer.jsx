"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");
  
    const { error } = await supabase
      .from("subscriptions")
      .upsert([{ email }], { onConflict: 'email' }) // prevent duplicates
      .select(); // get full error message if any
  
    if (error) {
      console.error("Supabase insert error:", error.message);
      toast.error("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }
  
    toast.success("You're subscribed!");
    setStatus("success");
    setEmail("");
  };
  

  return (
    <footer className="bg-white border-t mt-20 pt-12 pb-6">
      <div className="mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold">Subscribe to our emails</h2>
        <p className="mt-2 text-gray-600">
          Be the first to know about new collections and exclusive offers.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="px-4 py-2 w-72 border border-gray-300 rounded-full focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 flex items-center justify-center"
          >
            <ArrowRightIcon className="h-5 w-5 text-white" />
          </button>
        </form>
        {status === "success" && (
          <p className="text-green-600 mt-2 text-sm">Thanks for subscribing!</p>
        )}
        {status === "error" && (
          <p className="text-red-500 mt-2 text-sm">
            Something went wrong. Try again.
          </p>
        )}
      </div>

      <div className="text-center mt-10 text-sm text-gray-500 px-4">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          <span>© 2025, Urban90s Created by Reyansh</span>
          <span>·</span>
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Contact information
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Shipping policy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms of service
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Refund policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
