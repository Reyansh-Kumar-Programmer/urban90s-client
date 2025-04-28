"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { client } from "@/utils/sanityClient";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
  slug: { current: string };
};

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category;

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      const query = `*[_type == "product" && category->slug.current == $category]{
        _id,
        title,
        price,
        "image": previewImage.asset->url,
        slug
      }`;

      const data = await client.fetch(query, { category });
      setProducts(data);
    };

    fetchProducts();
  }, [category]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <section className="px-4 md:px-8 pt-12">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {category?.toString().replace(/-/g, " ")}
        </h1>

        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
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
        )}
      </section>

      <Footer />
    </motion.div>
  );
}
