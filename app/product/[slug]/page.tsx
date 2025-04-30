import { client } from "@/utils/sanityClient";
import ProductViewer from "./ProductViewer";
import { notFound } from "next/navigation";

// REMOVE TYPES TEMPORARILY
export default async function ProductPage({ params }: any) {
  const { slug } = params;

  const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    title, price, originalPrice,
    "previewImage": previewImage.asset->url,
    "images": images[].asset->url,
    sizes
  }`, { slug });

  if (!product) return notFound();

  return <ProductViewer product={product} />;
}
