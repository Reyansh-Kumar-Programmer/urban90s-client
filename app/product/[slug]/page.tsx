// app/product/[slug]/page.tsx
import { client } from "@/utils/sanityClient";
import ProductViewer from "../[slug]/ProductViewer";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params;

  const query = `*[_type == "product" && slug.current == $slug][0]{
    title,
    price,
    originalPrice,
    "previewImage": previewImage.asset->url,
    "images": images[].asset->url,
    sizes
  }`;

  const product = await client.fetch(query, { slug });

  if (!product) return notFound();

  return <ProductViewer product={product} />;
}
