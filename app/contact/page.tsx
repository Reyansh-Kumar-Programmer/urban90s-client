"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />
      {/* Contact Form Section */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-14">
        <h1 className="text-4xl font-bold mb-8 ">Contact</h1>
        <form className="space-y-6" action="https://formsubmit.co/rexnoah0667@gmail.com" method="POST">
          <div className="flex flex-row  gap-5">
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            />

            <input
              type="email"
              placeholder="Email *"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone number"
              name="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
          </div>
          <div>
            <textarea
              placeholder="Comment"
              name="message"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit" // <-- Navigate to shop
            className="bg-[#bfa897] hover:bg-[#a89080] text-black py-2 px-6 rounded-full font-medium"
          >
            Send
          </button>
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="http://localhost:3000/" />
        </form>
      </div>

      {/* Footer Section */}
      <Footer />
    </motion.div>
  );
}