"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { client } from "../utils/sanityClient";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const fetchProducts = async () => {
  const query = `*[_type == "product"] | order(_createdAt desc) [0...4] {
    _id,
    title,
    price,
    "image": previewImage.asset->url
  }`;
  
  const products = await client.fetch(query);
  return products;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  // Fetch products on component mount
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      {/* Hero Section */}
      <motion.div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="/banner.png" alt="Banner" fill priority className="object-cover" />
        <div className="absolute inset-0 flex justify-center items-center px-4">
          <motion.div
            className="bg-white px-6 py-6 sm:px-10 sm:py-8 md:px-24 md:py-10 rounded-2xl max-w-xl mx-auto shadow-lg text-center space-y-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Spring Deals!</h1>
            <p className="text-gray-600 text-sm sm:text-base">New deals for spring!</p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-[#bfa897] hover:bg-[#a89080] text-black py-2 px-6 rounded-full font-medium"
            >
              SHOP NOW
            </button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, ease: "easeOut"}}
        className="flex justify-center items-center gap-5 flex-col mt-10 mb-4"
      >
        <motion.h1
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3, duration: 0.6}}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-black"
        >
          Urban 90s Apparel
        </motion.h1>

        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.5, duration: 0.6}}
          className="text-sm px-8 text-center"
        >
          Coming out with new clothes every time I get the chance!
        </motion.p>

        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.7, duration: 0.6}}
          onClick={() => router.push("/shop")}
          className="bg-[#bfa897] hover:bg-[#a89080] text-black py-2 px-6 rounded-full font-medium"
        >
          SHOP NOW
        </motion.button>
      </motion.div>
      {/* Popular Products */}
      <section className="px-10 md:px-20 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Popular Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.03 }}
              className="border rounded-xl overflow-hidden shadow-sm p-3 cursor-pointer transition-all"
              onClick={() => router.push("/shop")}
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold">{product.title}</p>
                <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-10 items-center"
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
        >
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Urban 90s Started
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Born in a small garage with just a sketchpad and a dream, Urban 90s was created
              to bring the golden era of street fashion back to life. We started with a few tees
              and now we’re here, repping the culture with every stitch.
            </p>
            <p className="text-gray-500 mt-4">
              Fueled by raw creativity and the beats of the streets, our journey is just getting started.
            </p>
          </div>

          {/* Image */}
          <div>
            <Image
              src="/Urb.png"
              alt="How it started"
              width={700}
              height={500}
              className="rounded-xl object-cover"
            />
          </div>
        </motion.div>
      </section>
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-10 items-center"
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
        >
          <div>
            <Image
              src="/social media.jpg"
              alt="How it started"
              width={700}
              height={500}
              className="rounded-xl object-cover"
            />
          </div>
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Urban 90s is growing
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              quickly spread to many people because of social media. Thorn expands to new designs every week so we have
              more to offer.
            </p>
          </div>

          {/* Image */}

        </motion.div>
      </section>
      <Footer />
    </motion.div>
  );
}
