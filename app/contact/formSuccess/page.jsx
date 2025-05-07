"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function FormSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Clean up
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Thank You! 🙏</h1>
      <p className="text-lg text-gray-700 mb-2">Your form has been successfully submitted.</p>
      <p className="text-gray-500">We will get back to you shortly.</p>
    </div>
  );
}

export default FormSuccess;
