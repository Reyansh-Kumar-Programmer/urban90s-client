"use client"
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t mt-20 h-[200px] ">
      <div className="mx-auto px-4 pt-12 pb-6 text-center">
        <h2 className="text-2xl font-bold">Subscribe to our emails</h2>
        <p className="mt-2 text-gray-600">
          Be the first to know about new collections and exclusive offers.
        </p>
        <form className="mt-6 flex items-center justify-center">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 w-72 border border-gray-300 rounded-full focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900"
          >
            <ArrowRightIcon className="h-5 w-5 text-white cursor-pointer" />
          </button>
        </form>
      </div>
      <div className="text-center mb-8 text-sm text-gray-500 pb-6">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 px-4">
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
