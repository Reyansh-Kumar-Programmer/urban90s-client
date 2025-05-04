"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { client } from "../../../utils/sanityClient";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 👈 new

export default function CategoryShop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("Shop");
  const searchParams = useSearchParams(); // 👈 get query params
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      let query = `*[_type == "product"`;
      if (category) {
        query += ` && category->title == "${category}"`; // 👈 filter by category title
        setCategoryTitle(category.charAt(0).toUpperCase() + category.slice(1));
      }
      query += `]{
        _id,
        title,
        price,
        "image": previewImage.asset->url,
        slug
      }`;
      const data = await client.fetch(query);
      setProducts(data);
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <section className="px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{categoryTitle}</h1>

        {/* Filters and Sort dropdowns... */}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <Link key={product._id || idx} href={`/product/${product.slug.current}`} passHref>
              <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <div className="relative">
                  <Image
                    src={product.image || "/fallback.jpg"}
                    alt={product.title}
                    width={500}
                    height={500}
                    className="rounded"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-xl">{product.title}</h3>
                <div className="mt-1 text-lg">
                  <span>₹{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
